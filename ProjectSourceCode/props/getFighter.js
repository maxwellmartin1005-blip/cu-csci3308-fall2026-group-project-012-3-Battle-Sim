async function getFighter(id, db) {
    const query = `\
        SELECT * from fighters\
            WHERE creator_id = ${id}\
    `;

    const response = await db.one(query);
    return response;
}

module.exports = getFighter;