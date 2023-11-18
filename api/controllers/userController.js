const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    
}


exports.getUserTeam = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }

        if(await User.getUserType(data.user_id) != 'player' && await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is owner or undefined")
        }
        var result = await User.getUserTeam(data.user_id);
        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};