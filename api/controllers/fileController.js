const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}


exports.newTeam = async (req, res) => {
    try {
        var teamShieldRoute = null;
        if (req.file) {
            const filePath = req.file.path.replace(/\\/g, '/')
            teamShieldRoute = filePath;
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
        if(data.team_trainer != null && data.team_trainer != '') {
            await User.updateTrainerTeam(data.team_trainer.id, result);
        }
        
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.loadImage = async (req, res) => {
    const imageDir = req.body.data.imageDir;
    const fullImgDir = path.join(__dirname, `${imageDir}`);
    console.log(fullImgDir);

    fs.readFile(fullImgDir, (err, data) => {
        if (err) {
            res.status(500).send('Unable to read File');
        } else {
            const base64Image = new Buffer.from(data).toString('base64');
            res.status(200).json({ img: base64Image });
        }
    });
};