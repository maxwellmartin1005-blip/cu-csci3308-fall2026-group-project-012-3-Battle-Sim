const {db} = require('./db');
const {validateFighter} = require('./validateFighter');

async function saveFighter(user, input, image, startingStats) {
  if (!user || !Number.isInteger(user.id)) {
    throw new Error('Sign in before saving a fighter.');
  }

  // Starting stats come from the server, never from form fields or zero defaults.
  const statNames = ['health', 'attack', 'defense', 'alteration', 'permanence', 'agility'];
  if (!startingStats || statNames.some(name => !Number.isInteger(startingStats[name]))) {
    throw new Error('Provide starting stats before saving a fighter.');
  }

  const availableMoves = await db.any('SELECT id FROM moves');
  const errors = await validateFighter(input, image, availableMoves);
  if (errors.length) {
    const error = new Error(errors.join(' '));
    error.status = 400;
    error.errors = errors;
    throw error;
  }

  return db.tx(async transaction => {
    const fighter = await transaction.one(
      `INSERT INTO fighters
        (creator_id, name, element, image, health, attack, defense, alteration, permanence, agility)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, element`,
      [user.id, input.fighterName.trim(), input.element, image.buffer,
        startingStats.health, startingStats.attack, startingStats.defense,
        startingStats.alteration, startingStats.permanence, startingStats.agility]
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
}

module.exports = saveFighter;
