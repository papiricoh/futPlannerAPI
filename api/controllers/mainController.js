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
        const data = req.body
        const new_data = {
            username: data.username,
            cryptedpassword: await bcrypt.hashSync(data.password, saltRounds),    //USE BRCYPT TO ENCODE CRYPTO HASH
            first_name: data.first_name,
            last_name: data.last_name,
            photo_url: data.photo_url,
            dob: data.date_of_birth,
        }
        var result = await User.newUser(new_data);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
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

        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("password")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error: " + err.message });
        }
    }
};
