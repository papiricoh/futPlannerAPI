const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token != null && token != "" && token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}

exports.example = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};