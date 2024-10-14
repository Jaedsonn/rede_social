const Posts = require("../utils/getPosts");
const db = require("../config/connetion");
const findPost = require("../utils/findPost");


async function getPosts(req, res) {
    try {
        const data = req.data
        console.log(req.data)
        const user = await Posts(data.name);
        const posts = user.map((post) => {
            const id = post.post_Id;
            const title = post.titulo;
            const descricao = post.descricao;
            const imagem_capa = post.imagem_capa;

            return {
                id,
                title,
                descricao,
                imagem_capa
            }
        })
        res.status(200).json({ posts })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

async function createPost(req, res) {
    try {
        const { titulo, descricao, imagem_capa } = req.body
        const data = req.data;
        console.log(data)
        const connection = await db();

        const createPostsQuery = `INSERT INTO
    posts (
        user_id,
        titulo,
        descricao,
        imagem_capa
    )
VALUES (
        ?,
        ?,
        ?,
        ?
    );`;

        const createPost = await connection.query(createPostsQuery, [data.user_id, titulo, descricao, imagem_capa])

        const post = await findPost(titulo)
        res.status(201).json({ post: post })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

async function deletePost(req, res) {
    try {
        const connect = await db()
        const { id } = req.params
        const deletePostQuery = `DELETE FROM posts
WHERE post_id = ?;
`
        const deletePost = await connect.query(deletePostQuery, [id])
        console.log(deletePost)

        res.status(200).json({ message: "Post deletado" })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}

async function updatePost(req, res) {
    try {
        const connection = await db();
        const { titulo, descricao, imagem_capa } = req.body;
        const { id } = req.params
        const [currentPost] = await connection.query('SELECT * FROM posts WHERE post_id = ?', [id]);

        if (!currentPost.length) {
            throw new Error('Post não encontrado');
        }

        // Substitui valores nulos ou vazios pelos valores atuais
        const title = titulo || currentPost[0].titulo;
        const description = descricao || currentPost[0].descricao;
        const image = imagem_capa || currentPost[0].imagem_capa;

        const query = `
        UPDATE posts
        SET titulo = ?, descricao = ?, imagem_capa = ?
        WHERE post_id = ?;
    `;

        const [result] = await connection.query(query, [title, description, image, id]);
        res.status(200).json({ result })
    } catch (error) {
        console.log(error)
        let erros = Array.from([error.message]) || ['No error descriptor']
        if (error.errors) {
            erros = error.errors.map(element => element.message)
        }
        res.status(401).json({ 'message': 'Request fail', erros })
    }
}




module.exports = { getPosts, createPost, deletePost, updatePost }