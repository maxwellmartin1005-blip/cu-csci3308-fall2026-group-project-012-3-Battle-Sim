const elements = ['fire', 'water', 'earth', 'life', 'light', 'dark'];
const maxImageSize = 2 * 1024 * 1024;

function validateFighter(input, image, availableMoves) {
  const errors = [];
  const name = typeof input.fighterName === 'string' ? input.fighterName.trim() : '';
  if (!name || name.length > 255) errors.push('Enter a fighter name between 1 and 255 characters.');
  if (!elements.includes(input.element)) errors.push('Choose one of the six elements.');

  const selectedMoves = Array.isArray(input.moves) ? input.moves : [input.moves];
  const moveIds = selectedMoves.filter(value => typeof value === 'string' && /^[1-9]\d*$/.test(value));
  const validMoves = new Set(availableMoves.map(move => String(move.id)));
  if (!moveIds.length || moveIds.length !== selectedMoves.length ||
      new Set(moveIds).size !== moveIds.length || moveIds.some(id => !validMoves.has(id))) {
    errors.push('Choose at least one available move.');
  }

  if (!image) {
    errors.push('Choose a PNG or JPEG image.');
  } else {
    const data = image.buffer;
    const png = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const jpeg = data.length >= 3 && data[0] === 255 && data[1] === 216 && data[2] === 255;
    if (!((png && image.mimetype === 'image/png') || (jpeg && image.mimetype === 'image/jpeg'))) {
      errors.push('Use a PNG or JPEG image file.');
    }
    if (image.size > maxImageSize) errors.push('Choose an image no larger than 2 MB.');
  }
  return errors;
}

module.exports = {elements, maxImageSize, validateFighter};
