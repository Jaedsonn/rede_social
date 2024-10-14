const db = require("../config/connetion")


async function Posts(username) {
    const checkUserExists = `SELECT u.user_id, u.username, p.post_id, p.titulo, p.descricao, p.imagem_capa
FROM usuarios u
    LEFT JOIN posts p ON u.user_id = p.user_id
WHERE
    u.username = ?;`
    const findUser = await (await db()).query(checkUserExists, [username]);

    return findUser[0]
}

module.exports = Posts