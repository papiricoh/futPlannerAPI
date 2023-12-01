const User = require('../models/db');


exports.uploadPicture = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No se subió ningún archivo.');
        }
        console.log(req.file.path);
        res.status(200).json("OK");
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
