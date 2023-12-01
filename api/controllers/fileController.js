const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}


exports.uploadPicture = async (req, res) => {
    try {
        var teamShieldRoute = null;
        if (req.file) {
            teamShieldRoute = req.file.path;
        }
        const data = JSON.parse(req.body.data);
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'owner') {
            throw new Error("User is player or trainer")
        }
        const club = await User.getOwnerClub(data.user_id);
        var result = await User.newTeam({
            name: data.team_name, 
            shield_url: teamShieldRoute, 
            sub_category: data.team_sub_category_id, 
            club_id: club[0].id
        })
        
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
