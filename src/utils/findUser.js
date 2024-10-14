const db = require("../config/connetion")


async function findUser(username) {
    const checkUserExists = `SELECT * FROM usuarios WHERE username = ?`
    const findUser = await (await db()).query(checkUserExists, [username]);
    
    return findUser[0]
}

module.exports = findUser