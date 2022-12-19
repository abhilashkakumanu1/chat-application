import express from "express";
import path from "path";
const app = express();

app.use(express.static(path.resolve(__dirname, './public/')))

app.get("/health-check", (_, res) => {
    res.send("Hello world!!!!")
})

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})