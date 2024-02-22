const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token != null && token != "" && token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}

exports.getTeam = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        team.players = await User.trainerGetPlayers(team.id);
        
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};