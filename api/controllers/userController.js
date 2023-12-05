const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token != null && token != "" && token == await User.getUserToken(id)) {
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

exports.getFullTeamByIdOwner = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }

        if(await User.getUserType(data.user_id) != 'owner') {
            throw new Error("User is player or trainer")
        }
        var team = await User.getTeamById(data.team_id);
        var trainer = await User.getTeamTrainer(data.team_id);
        if(trainer != null && trainer.length != 0) {
            trainer = trainer[0];
            delete trainer.password;
            delete trainer.last_token_key;
        }else {
            trainer = null;
        }
        var players = await User.getTeamPlayers(data.team_id);

        for (const p of players) {
            delete p.password;
            delete p.last_token_key;
        }

        var result = team[0];
        result.trainer = trainer;
        if(players.length != 0) {
            result.players = players;
        }else {
            result.players = null;
        }
        const categories = await User.getTeamCategory(data.team_id);
        result.category = categories[0].category;
        result.subcategory = categories[0].subcategory;


        res.status(200).json(result);
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


exports.newTeam = async (req, res) => {
    try {
        const data = req.body;
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'owner') {
            throw new Error("User is player or trainer")
        }
        const club = await User.getOwnerClub(data.user_id);
        var result = await User.newTeam({
            name: data.team_name,
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