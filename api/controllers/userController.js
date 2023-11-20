const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token == await User.getUserToken(token)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
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
        if (err.message.includes("Token")) {
            res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};