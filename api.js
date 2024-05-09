const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./api/routes');

app.use(cors());

//Sistema de almacenaje de archivos
const multer = require('multer');
const path = require('path');
const fileController = require('./api/controllers/fileController.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('photo'), fileController.uploadFile);

app.use('/uploads', fileController.checkAuth, express.static('uploads'));

//Fin del sistema de almacenaje de archivos

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server in port: ${port}`);
});

module.exports = app;