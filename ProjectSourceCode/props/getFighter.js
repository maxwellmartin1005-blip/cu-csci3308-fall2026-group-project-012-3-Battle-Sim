async function getFighter(id, db) {
  return db.oneOrNone('SELECT * FROM fighters WHERE id = $1', [id]);
}

module.exports = getFighter;