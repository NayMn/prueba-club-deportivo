import express from 'express'
import { readFile } from "fs/promises"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathFile = __dirname + "/data/deporte.json";

// archivos estaticos:
app.use(express.static(__dirname + '/public'));




// read
app.get("/deportes", async (req, res) => {
    try {
        const stringDeportes = await readFile(pathFile, 'utf8');
        console.log(stringDeportes)
        const deportesArray = JSON.parse(stringDeportes);
        console.log(deportesArray)

        return res.json(deportesArray);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: true });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto", PORT)
});

