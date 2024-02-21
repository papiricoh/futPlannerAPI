const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}


exports.uploadFile = async (req, res) => {
    try {
        const data = req.body;//data.user_id, data.token, data.type
        
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
    
        const file = req.file;

        if (!file) {
            return res.status(400).send('No se ha subido ningún archivo.');
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        //Almacenar la URL en tu base de datos si es tipo perfil o club

        // Envía la URL de la imagen como respuesta
        res.status(200).json({
            message: 'Archivo subido con éxito',
            imageUrl: imageUrl
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};