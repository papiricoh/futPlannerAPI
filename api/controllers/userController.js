const User = require('../models/db');


exports.ne2wUser = async (req, res) => {
    try {
        const data = req.body
        const new_data = {
            username: data.username,
        }
        var result = await User.newUser(new_data);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};