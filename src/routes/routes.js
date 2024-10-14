const { Router } = require("express");
const { register, login, deleteUser, updateUser, getUser, getAllUser } = require("../controllers/UserController");
const tokenVerify = require("../middleware/token");
const { getPosts, createPost, deletePost, updatePost } = require("../controllers/PostsController");

const router = Router();

router.post("/register", register)
router.post("/login", login)
router.delete("/delete/:id", tokenVerify, deleteUser)
router.put("/update/:id", tokenVerify, updateUser)
router.get("/", tokenVerify, getUser)
router.get("/all", tokenVerify, getAllUser)

router.get("/posts", tokenVerify, getPosts)
router.post("/postz/create", tokenVerify, createPost)
router.delete("/post/delete/:id", tokenVerify, deletePost)
router.put("/post/update/:id", tokenVerify, updatePost)

module.exports = router