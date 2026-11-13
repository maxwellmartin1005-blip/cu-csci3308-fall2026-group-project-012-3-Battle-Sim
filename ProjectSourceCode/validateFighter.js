const sharp = require('sharp');

const elements = ['fire', 'water', 'earth', 'life', 'light', 'dark'];
const maxImageSize = 2 * 1024 * 1024;

async function validateImage(image) {
  if (!image) return 'Choose a PNG or JPEG image.';
  if (image.size > maxImageSize) return 'Choose an image no larger than 2 MB.';

  const imageTypes = {png: 'image/png', jpeg: 'image/jpeg'};
  try {
    const decoder = sharp(image.buffer, {failOn: 'warning'});
    const metadata = await decoder.metadata();
    if (!imageTypes[metadata.format] || image.mimetype !== imageTypes[metadata.format]) {
      return 'Use a readable PNG or JPEG image file.';
    }

    // Decode the pixels too: a valid-looking header alone does not prove the image is readable.
    await decoder.raw().toBuffer();
    return null;
  } catch {
    return 'Use a readable PNG or JPEG image file.';
  }
}

async function validateFighter(input, image, availableMoves) {
  const errors = [];
  const name = typeof input.fighterName === 'string' ? input.fighterName.trim() : '';
  if (!name || name.length > 255) {
    errors.push('Enter a fighter name between 1 and 255 characters.');
  }
  if (!elements.includes(input.element)) {
    errors.push('Choose one of the six elements.');
  }

  const selectedMoves = input.moves || [];
  const moveIds = Array.isArray(selectedMoves) ? selectedMoves : [selectedMoves];
  const availableMoveIds = new Set(availableMoves.map(move => String(move.id)));
  const hasMoves = moveIds.length > 0;
  const hasDuplicateMoves = new Set(moveIds).size !== moveIds.length;
  const hasUnknownMoves = moveIds.some(id => !availableMoveIds.has(id));

  if (!hasMoves || hasDuplicateMoves || hasUnknownMoves) {
    errors.push('Choose at least one available move.');
  }

  const imageError = await validateImage(image);
  if (imageError) errors.push(imageError);
  return errors;
}

module.exports = {elements, maxImageSize, validateFighter};
