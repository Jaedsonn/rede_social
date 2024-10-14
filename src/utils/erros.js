const db = require("../config/connetion")

async function errosCheck(name, password) {
    const erros = [];

    const connection = (await db()).connect();
    console.log('Conectado ao MySQL!');

    const checkUserExists = `SELECT * FROM usuarios WHERE username = ?`
    const findUser = await (await db()).query(checkUserExists, [name]);

    if (findUser[0].length != 0) {
        throw new Error("User already exists")
    }

    if (!password) {
        erros.push("Password missing");
    }
    if (!name) {
        console.log(name)
        erros.push("Name missing")
    }
    if (password && password.length < 6) {
        erros.push("Invalid password")
    }

    return erros
}

module.exports = errosCheck