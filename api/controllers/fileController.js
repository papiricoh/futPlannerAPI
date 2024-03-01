const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}

/**
 * el metodo uploadFile permite subir un archivo al servidor, las fotos son almacenadas 
 * en el directorio de la api uploads y gestionadas segun su naturaleza (perfil o escudo)
 * @param {*} req requerimientos, autentificacion y archivo a subir
 * @param {*} res el resultado en json si la subida ha sido exitosa
 * @returns nada, es usado como break en caso de no haber subido ningun archivo
 */
exports.uploadFile = async (req, res) => {
    try {
        const data = req.body;//data.user_id, data.token, data.type
        
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
    
        const file = req.file;

        if (!file) {
            res.status(400).send('No se ha subido ningún archivo.');
            return;
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        //Almacenar la URL en tu base de datos si es tipo perfil o club

        if(data.type == 'profile') {
            await User.updateProfileImage(data.user_id, imageUrl);
        }else if(data.type == 'club') {
            if(await User.getUserType(data.user_id) != 'owner') {
                throw new Error("User is player or trainer does not have permissions to change club shield")
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

/**
 * Middleware que comprueba a traves de los headers si el usuario tiene autorizacion para ver el archivo 
 * @param {*} req requerimientos de la llamada (headers)
 * @param {*} res resultado en json en caso de denegacion de acceso
 * @param {*} next funcion de progreso del middleware, continua el acceso
 */
exports.checkAuth = async (req, res, next) => {
    try {
        const filePath = req.path;
        const userId = req.headers['x-user-id'];
        const token = req.headers['x-token'];

        if(config.tokenMode) {
            await checkToken(userId, token);
        }
        console.log(filePath,userId,token);

        //Bypass de los checkers del middleware al acceder a las imagenes
        if (true) {
            next();
        } else {
            res.status(403).send('Acceso al archivo denegado');
        }

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}