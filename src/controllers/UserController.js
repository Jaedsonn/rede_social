const errosCheck = require("../utils/erros")
const db = require("../config/connetion")
const findUser = require("../utils/findUser")
const bcrypt = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const { config } = require("dotenv")
config()

async function register(req, res) {
    try {
        const { username, password } = req.body
        const connect = (await db()).connect()


        const erros = await errosCheck(username, password)

        if (erros.length > 0) {
            throw new Error(erros)
        }

        const salt = bcrypt.genSaltSync(8)
        const hash_password = bcrypt.hashSync(password, salt)

        const createUserQuery = `INSERT INTO usuarios (username, password) VALUES (?, ?)`
        const createUser = await (await db()).query(createUserQuery, [username, hash_password])

        const user = await findUser(username)
        const { username: name, password: pass, user_id } = user[0]
        const token = sign({ user_id, name, pass }, process.env.TOKEN_SECRET)

        res.status(201).json({ token });
    } catch (error) {
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error("Username ou senha ausentes.");
        }

        const connection = await db();

        const [userRows] = await connection.query(`SELECT * FROM usuarios WHERE username = ?`, [username]);

        if (userRows.length === 0) {
            throw new Error("Username or password wrong.");
        }

        const { user_id, username: name, password: pass } = userRows[0]

        const isMatch = await bcrypt.compare(password, pass);
        if (!isMatch) {
            throw new Error("Username or password wrong.");
        }
        const token = sign({ user_id, name, pass }, process.env.TOKEN_SECRET)
        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

module.exports = { register, login }