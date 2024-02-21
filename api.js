const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./api/routes');

//Sistema de almacenaje de archivos
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('imagen'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    //Almacenar la URL en tu base de datos

    // Envía la URL de la imagen como respuesta
    res.status(200).json({
        message: 'Archivo subido con éxito',
        imageUrl: imageUrl
    });
});

app.use('/uploads', express.static('uploads'));

//Fin del sistema de almacenaje de archivos

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use('/api', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server in port: ${port}`);
});

module.exports = app;