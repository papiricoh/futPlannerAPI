const mysql = require("mysql2");
const dbConfig = require("../config/config.js");

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

const User = {
    async getAllClubs() {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM clubs`);
        if (rows.length) {
            return rows;
        }
        throw new Error('No Clubs in the database');
    },
    async newUser(data) {
        try {
            const result = await connection.promise().query(
                `INSERT INTO users (username, password, first_name, last_name, photo_url, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)`, 
                [data.username, data.cryptedpassword, data.first_name, data.last_name, data.photo_url, data.dob]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting user into the database');
        }
    },
    async getUserByUsername(username) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM users WHERE username = '` + username + `'`);
        if (rows.length) {
            return rows[0];
        }
        throw new Error('No User with the name ' + username + ' in the database');
    },
    async setNewToken(data) {
        try {
            const result = await connection.promise().query(
                `UPDATE users SET last_token_key = ? WHERE username = ?`, 
                [data.token, data.username]
            );
            if(result.length){
                return true;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting user into the database');
        }
    },
};

module.exports = User;