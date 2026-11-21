const {db} = require('./db');

function getFighterTemplates() {
  return db.any(`SELECT f.id, f.name, f.element, f.health, f.attack, f.defense,
      f.alteration, f.permanence, f.agility,
      ARRAY(SELECT move_id FROM moves_to_fighters
            WHERE fighter_id = f.id ORDER BY move_id) AS "defaultMoves"
    FROM fighters f WHERE f.creator_id = 0 ORDER BY f.id`);
}

function getAllowedMoves(moves, template) {
  if (!template) return [];
  return moves.filter(move =>
    move.element === template.element || template.defaultMoves.includes(move.id)
  );
}

module.exports = {getFighterTemplates, getAllowedMoves};
