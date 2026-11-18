const classSelect = document.getElementById('templateId');
const elementInput = document.getElementById('element');
const statValues = document.querySelectorAll('[data-stat]');
const moveChoices = document.querySelectorAll('[data-move-id]');
const moveFieldset = document.getElementById('fighterMoves');

classSelect.addEventListener('change', () => {
  const option = classSelect.selectedOptions[0];
  const hasClass = Boolean(option.value);
  const defaultIds = new Set((option.dataset.moves || '').split(',').filter(Boolean));
  elementInput.value = option.dataset.element || '';
  for (const value of statValues) {
    value.textContent = option.dataset[value.dataset.stat] || '—';
  }
  for (const choice of moveChoices) {
    const allowed = hasClass && (choice.dataset.element === option.dataset.element || defaultIds.has(choice.dataset.moveId));
    choice.hidden = !allowed;
    const checkbox = choice.querySelector('input');
    checkbox.disabled = !allowed;
    checkbox.checked = allowed && defaultIds.has(checkbox.value);
  }
  moveFieldset.disabled = !hasClass;
});

const imageInput = document.getElementById('fighterImage');
const preview = document.getElementById('imagePreview');
let previewUrl;

imageInput.addEventListener('change', () => {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  preview.hidden = true;
  imageInput.setCustomValidity('');
  const file = imageInput.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    imageInput.setCustomValidity('Choose a PNG or JPEG image no larger than 2 MB.');
    imageInput.reportValidity();
    return;
  }
  previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.hidden = false;
});
