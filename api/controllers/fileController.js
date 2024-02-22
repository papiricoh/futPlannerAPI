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

        if(data.type == 'profile') {
            await User.updateProfileImage(data.user_id, imageUrl);
        }else if(data.type == 'club') {
            if(await User.getUserType(data.user_id) != 'owner') {
                throw new Error("User is player or trainer")
            }
            const club = await User.getOwnerClub(data.user_id);
            
            await User.updateClubImage(club[0].id, imageUrl);
        }

        // Envía la URL de la imagen como respuesta
        res.status(200).json({
            message: 'Archivo subido con éxito',
            imageUrl: imageUrl
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.checkAuth = async (req, res, next) => {
    try {
        const filePath = req.path;
        const userId = req.headers['x-user-id'];
        const token = req.headers['x-token'];

        if(config.tokenMode) {
            await checkToken(userId, token);
        }
        console.log(filePath,userId,token);

        if (true) {
            next();
        } else {
            res.status(403).send('Acceso al archivo denegado');
        }

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}