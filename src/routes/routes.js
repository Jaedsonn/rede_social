const { Router } = require("express");
const { register, login } = require("../controllers/UserController");
const tokenVerify = require("../middleware/token");
const { getPosts, createPost, deletePost, updatePost } = require("../controllers/PostsController");

const router = Router();

router.post("/register", register)
router.post("/login", login)

router.get("/posts", tokenVerify, getPosts)
router.post("/post/create", tokenVerify, createPost)
router.delete("/post/delete/:id", tokenVerify, deletePost)
router.put("/post/update/:id", tokenVerify, updatePost)

module.exports = router