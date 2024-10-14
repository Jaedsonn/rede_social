const db = require("../config/connetion")


async function findPost(titulo) {
    const checkUserExists = `SELECT * FROM posts WHERE titulo = ?`
    const findUser = await (await db()).query(checkUserExists, [titulo]);
    return findUser[0][0]
}

module.exports = findPost