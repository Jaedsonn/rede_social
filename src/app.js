const express = require("express");
const userRouter = require("./routes/routes")
const cors = require("cors")

const app = express();
const port = 4001;

app.use(cors())
app.use(express.json())
app.use("/user", userRouter)

app.get("/", (req, res) => {
    res.send("Olá mundo")
})

app.listen(port, () => {
    console.log(`Server running in http://localhost:${port}`)
})