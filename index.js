import express from 'express'
import { writeFile } from 'fs/promises'
import { readFile } from "fs/promises"
import { nanoid } from 'nanoid'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathFile = __dirname + "/data/deporte.json";

// middleware: 
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

        // guardar en json,  leer info:
        const stringDeportes = await readFile(pathFile, 'utf8');
        const deportesArray = JSON.parse(stringDeportes);

        // empujar info:
        deportesArray.push(newDeporte)
        // guardar info:
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

// update: 
app.get("/editar", async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const nuevoPrecio = req.query.precio;

        const stringDeportes = await readFile(pathFile, 'utf8');
        const deportesArray = JSON.parse(stringDeportes);

        const deporteIndex = deportesArray.findIndex(item => item.nombre === nombre);
        if (deporteIndex === -1) {
            return res.status(404).json({ ok: false, message: "Deporte no encontrado" });
        }

        // Actualizar el precio del deporte
        deportesArray[deporteIndex].precio = nuevoPrecio;

        await writeFile(pathFile, JSON.stringify(deportesArray));
        return res.json({ ok: true, message: "Precio del deporte actualizado correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false });
    }
});



// delete:
app.delete("/eliminar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const stringDeportes = await readFile(pathFile, 'utf8');
        const deportesArray = JSON.parse(stringDeportes);

        const deporteIndex = deportesArray.findIndex(item => item.id === id);
        if (deporteIndex === -1) {
            return res.status(404).json({ ok: false, message: "Deporte no encontrado" });
        }

        deportesArray.splice(deporteIndex, 1);

        await writeFile(pathFile, JSON.stringify(deportesArray));
        return res.json({ ok: true, message: "Deporte eliminado correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false });
    }
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto", PORT)
});

