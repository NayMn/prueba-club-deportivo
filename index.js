import express from 'express'
import { writeFile } from 'fs/promises'
import { readFile } from "fs/promises"
import { nanoid } from 'nanoid'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathFile = __dirname + "/data/deporte.json";

// middleware: para que la info no sea undefined habilitar req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// archivos estaticos:
app.use(express.static(__dirname + '/public'));

// CRUD:

// crear un deporte nuevo: 

app.post("/agregar", async (req, res) => {
    try {

        const nombre = req.body.nombre
        const precio = req.body.precio
        const newDeporte = {
            nombre: nombre,
            precio: precio,
            id: nanoid()
        }

        // guardar en json:  leer info, empujar y guardar info 
        const stringDeportes = await readFile(pathFile, 'utf8');
        const deportesArray = JSON.parse(stringDeportes);

        // empujar
        deportesArray.push(newDeporte)
        // guardar 
        await writeFile(pathFile, JSON.stringify(deportesArray))

        return res.json({ ok: deportesArray })



    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false })
    }
})


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
        return res.status(500).json({ ok: false });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto", PORT)
});

