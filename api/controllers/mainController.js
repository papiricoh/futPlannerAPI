const User = require('../models/db');

//CRYPTO 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const tokenSaltRounds = 4;

async function generateToken(username) {
    return await bcrypt.hashSync(username, tokenSaltRounds);
}

exports.getAllClubs = async (req, res) => {
    try {
        res.status(200).json(await User.getAllClubs());
    } catch (err) {
        if (err.message.includes("Not found")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.newUser = async (req, res) => {
    try {
        const data = req.body;
        const new_data = {
            username: data.username,
            cryptedpassword: await bcrypt.hashSync(data.password, saltRounds),    //USE BRCYPT TO ENCODE CRYPTO HASH
            first_name: data.first_name,
            last_name: data.last_name,
            photo_url: data.photo_url,
            dob: data.date_of_birth,
        }
        if(data.type == null || ( data.type != "owner" && data.type != "player" && data.type != "trainer" )) {
            throw new Error('Invalid userType');
        }
        var result = null; //RETURNS USER ID
        switch (data.type) {
            case "owner":
                var clubId = data.club_id;
                //TODO:
                await User.checkIfExistsClub(clubId);

                result = await User.newUser(new_data);
                await User.newOwner(result, clubId);
                break;
            case "trainer":
                var teamId = data.team_id;
                //TODO:
                await User.checkIfExistsTeam(teamId);

                result = await User.newUser(new_data);
                await User.newTrainer(result, teamId);
                break;
            case "player":
                var teamId = data.team_id;
                //TODO:
                await User.checkIfExistsTeam(teamId);

                result = await User.newUser(new_data);
                await User.newPlayer(result, teamId, data.position, data.shirt_number, data.nationality);
                break;
        
            default:
                throw new Error('Invalid userType');
        }
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("userType")) {
            res.status(404).json({ error: err.message });
        }else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.logIn = async (req, res) => {
    try {
        var result = null;
        const data = req.body
        const gettedUser = await User.getUserByUsername(data.username);
        
        if(await bcrypt.compareSync(data.password, gettedUser.password)) {
            result = gettedUser;
        }else {
            throw new Error('Incorrect password')
        }
        result.last_token_key = await generateToken(result.username);
        tokenized = {token: result.last_token_key, username: result.username};
        User.setNewToken(tokenized);
        delete result.password;
        result.user_type = await User.getUserType(result.id);
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("password") || err.message.includes("No User with the name")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.logInToken = async (req, res) => {
    try {
        var result = null;
        const data = req.body
        const gettedUser = await User.getUserByUsername(data.username);
        
        if(data.token == gettedUser.last_token_key) {
            result = gettedUser;
        }else {
            throw new Error('Incorrect token')
        }
        delete result.password;
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("token")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};

exports.changePassword = async (req, res) => {
    try {
        var result = null;
        const data = req.body
        const gettedUser = await User.getUserByUsername(data.username);
        
        if(await bcrypt.compareSync(data.old_password, gettedUser.password)) {
            result = gettedUser;
            User.changePassword({new_password: await bcrypt.hashSync(data.new_password, saltRounds), username: gettedUser.username, old_password: gettedUser.password});
        }else {
            throw new Error('Incorrect password')
        }
        result.last_token_key = await generateToken(result.username);
        tokenized = {token: result.last_token_key, username: result.username};
        User.setNewToken(tokenized);
        delete result.password;

        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("password")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};
