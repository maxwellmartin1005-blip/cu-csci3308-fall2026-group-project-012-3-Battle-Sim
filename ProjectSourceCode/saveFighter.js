const {db} = require('./db');
const {validateFighter} = require('./validateFighter');
const {getFighterTemplates, getAllowedMoves} = require('./fighterTemplates');
const {writeFile, unlink} = require('node:fs/promises');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const sharp = require('sharp');

function validationError(errors) {
  const error = new Error(errors.join(' '));
  error.status = 400;
  error.errors = errors;
  return error;
}

async function saveFighter(user, input, image) {
  if (!user || !Number.isInteger(user.id)) {
    throw new Error('Sign in before saving a fighter.');
  }

  const templates = await getFighterTemplates();
  const template = templates.find(item => String(item.id) === input.templateId);
  if (!template) throw validationError(['Choose an available class.']);

  const moves = await db.any('SELECT id, element FROM moves');
  const availableMoves = getAllowedMoves(moves, template);
  const details = {...input, element: template.element};
  const errors = await validateFighter(details, image, availableMoves);
  if (errors.length) throw validationError(errors);

  const {format} = await sharp(image.buffer).metadata();
  const extension = format === 'png' ? '.png' : '.jpg';
  const filename = randomUUID() + extension;
  const imageFile = path.join(__dirname, 'images', filename);
  const imageUrl = '/images/' + filename;
  await writeFile(imageFile, image.buffer, {flag: 'wx'});

  try {
    return await db.tx(async transaction => {
      const fighter = await transaction.one(
        `INSERT INTO fighters
          (creator_id, name, element, image, health, attack, defense, alteration, permanence, agility)
         VALUES ($1, $2, $3, $4::text, $5, $6, $7, $8, $9, $10)
         RETURNING id, name, element`,
        [user.id, input.fighterName.trim(), template.element, imageUrl,
          template.health, template.attack, template.defense,
          template.alteration, template.permanence, template.agility]
      );

      await transaction.none(
        'INSERT INTO users_to_fighters (user_id, fighter_id) VALUES ($1, $2)',
        [user.id, fighter.id]
      );

      for (const moveId of input.moves) {
        await transaction.none(
          'INSERT INTO moves_to_fighters (move_id, fighter_id) VALUES ($1, $2)',
          [moveId, fighter.id]
        );
      }

      return fighter;
    });
  } catch (error) {
    try {
      await unlink(imageFile);
    } catch (cleanupError) {
      console.error('Could not remove unused fighter image:', cleanupError.message);
    }
    throw error;
  }
}

module.exports = saveFighter;
