const User = require('../models/db');


exports.getUserTeam = async (req, res) => {
    try {
        const data = req.body
        if(await User.getUserType(data.user_id) != 'player' && await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is owner or undefined")
        }
        var result = await User.getUserTeam(data.user_id);
        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};