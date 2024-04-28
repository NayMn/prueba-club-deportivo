import express from "express";
const app = express();

app.get("/", async (req, res) => {
    res.send("titulo pagina principal")
})



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("servidor escuchando")
})
