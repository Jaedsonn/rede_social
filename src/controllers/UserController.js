const errosCheck = require("../utils/erros")
const db = require("../config/connetion")
const findUser = require("../utils/findUser")
const bcrypt = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const { config } = require("dotenv")
config()

async function getUser(req, res) {
    try {
        const data = req.data
        const usuario = await findUser(data.name)
        console.log(data)
        res.status(200).json({ usuario })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

async function getAllUser(req, res) {
    try {
        const checkUserExists = `SELECT * FROM usuarios`
        const findUser = await (await db()).query(checkUserExists);


        res.status(200).json({ usuarios:findUser[0] })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

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

async function deleteUser(req, res) {
    try {
        const connect = await db()
        const { id } = req.params
        const deleteUserQuery = `DELETE FROM usuarios
WHERE user_id = ?;
`
        const deleteUser = await connect.query(deleteUserQuery, [id])
        console.log(deleteUser)

        res.status(200).json({ message: "usuario deletado" })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

async function updateUser(req, res) {
    try {
        const connection = await db();
        const { username, password } = req.body;
        const { id } = req.params;

        const [currentUser] = await connection.query(`SELECT * FROM usuarios WHERE user_id = ?`, [id]);

        if (!currentUser.length) {
            throw new Error('User não encontrado');
        }

        const name = username || currentUser[0].username;
        const pass = password || currentUser[0].password;

        const query = `
            UPDATE usuarios
            SET username = ?, password = ?
            WHERE user_id = ?;
        `;

        const [result] = await connection.query(query, [name, pass, id]);

        res.status(200).json({ message: "User update done" });
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

module.exports = { register, login, deleteUser, updateUser, getUser, getAllUser }