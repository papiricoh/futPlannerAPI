const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}

async function asignCategories(teams) {
    var new_teams = [];
    for (const team of teams) {
        var newTeam = team;
        var sub_category_list = await User.getSubcategoryById(team.sub_category_id);
        newTeam.sub_category = sub_category_list[0];
        var category_list = await User.getCategoryById(team.sub_category.category_id);
        newTeam.category = category_list[0];
        new_teams[new_teams.length] = newTeam;
    }
    return new_teams;
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
        }else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.getOwnerClub = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }

        if(await User.getUserType(data.user_id) != 'owner') {
            throw new Error("User is player or trainer")
        }
        var result = await User.getOwnerClub(data.user_id);
        res.status(200).json(result[0]);
    } catch (err) {
        if (err.message.includes("Token")) {
            res.status(404).json({ error: err.message });
        }else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.getOwnerTeams = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }

        if(await User.getUserType(data.user_id) != 'owner') {
            throw new Error("User is player or trainer")
        }
        var club = await User.getOwnerClub(data.user_id);

        var teams = await User.getTeamsByClub(club[0].id);
        var result = await asignCategories(teams);
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("Token")) {
            res.status(404).json({ error: err.message });
        }else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.getTrainersAsOwner = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }

        if(await User.getUserType(data.user_id) != 'owner') {
            throw new Error("User is player or trainer")
        }
        var club = await User.getOwnerClub(data.user_id);
        var result = await User.getTrainersByClub(club[0].id);
        for (const user of result) {
            delete user.password;
        }
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("Token")) {
            res.status(404).json({ error: err.message });
        }else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};