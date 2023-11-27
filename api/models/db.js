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
                `INSERT INTO users (username, password, first_name, last_name, photo_url, date_of_birth, club_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [data.username, data.cryptedpassword, data.first_name, data.last_name, data.photo_url, data.dob, data.club_id]
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
    async newOwner(userId, clubId) {
        try {
            const result = await connection.promise().query(
                `UPDATE clubs SET owner_id = ? WHERE id = ?`, 
                [userId, clubId]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting owner into the database');
        }
    },
    async getUserTeam(userId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM teams WHERE id = (SELECT team_id FROM ` + await this.getUserType(userId) + `s WHERE user_id = ? LIMIT 1)`, 
                [userId]
            );
            if(result.length){
                return result[0];
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error finding team in the database');
        }
    },
    async getTeamsByClub(clubId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM teams WHERE club_id = ?`, 
                [clubId]
            );
            if(result.length){
                return result[0];
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error finding team in the database');
        }
    },
    async getSubcategoryById(sub_categoryId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM sub_categories WHERE id = ? LIMIT 1`, 
                [sub_categoryId]
            );
            if(result.length){
                return result[0];
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error finding sub-category in the database');
        }
    },
    async getCategoryById(categoryId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM categories WHERE id = ? LIMIT 1`, 
                [categoryId]
            );
            if(result.length){
                return result[0];
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error finding category in the database');
        }
    },


    async getUserClub(userId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM clubs WHERE owner_id = ?`, 
                [userId]
            );
            if(result.length){
                return result[0];
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error finding club in the database');
        }
    },
    async newTrainer(userId, teamId) {
        try {
            const result = await connection.promise().query(
                `INSERT INTO trainers (user_id, team_id) VALUES (?, ?)`, 
                [userId, teamId]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting trainer into the database');
        }
    },
    async newPlayer(userId, teamId, position, shirtNumber, nationality) {
        try {
            const result = await connection.promise().query(
                `INSERT INTO players (user_id, team_id, position, shirt_number, nationality) VALUES (?, ?, ?, ?, ?)`, 
                [userId, teamId, position, shirtNumber, nationality]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting trainer into the database');
        }
    },
    async getUserType(userId) {
        try {
          const [rows, fields] = await connection.promise().query(
            `
              SELECT
                CASE
                  WHEN o.owner_id IS NOT NULL THEN 'owner'
                  WHEN p.user_id IS NOT NULL THEN 'player'
                  WHEN t.user_id IS NOT NULL THEN 'trainer'
                  ELSE 'unkown'
                END AS tipo_usuario
              FROM users u
              LEFT JOIN clubs o ON u.id = o.owner_id
              LEFT JOIN players p ON u.id = p.user_id
              LEFT JOIN trainers t ON u.id = t.user_id
              WHERE u.id = ?
            `, 
            [userId]
          );
          
          if (rows.length > 0) {
            return rows[0].tipo_usuario;
          } else {
            throw new Error('User does not exist');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Error querying the database');
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
    async getUserToken(id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM users WHERE id = '` + id + `'`);
        if (rows.length) {
            return rows[0].last_token_key;
        }
        throw new Error('No User with id ' + id + ' in the database');
    },
    async checkIfExistsClub(id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM clubs WHERE id = '` + id + `'`);
        if (rows.length) {
            return rows[0];
        }
        throw new Error('No club with id ' + id + ' in the database');
    },
    async checkIfExistsTeam(id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM teams WHERE id = '` + id + `'`);
        if (rows.length) {
            return rows[0];
        }
        throw new Error('No team with id ' + id + ' in the database');
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
    async changePassword(data) {
        try {
            const result = await connection.promise().query(
                `UPDATE users SET password = ? WHERE username = ? AND password = ?`, 
                [data.new_password, data.username, data.old_password]
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
    async getPlayer(username) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM players WHERE user_id = (SELECT id FROM users WHERE username = '` + username + `')`);
        if (rows.length) {
            return rows[0];
        }
        return null;
    },
    async getTrainer(username) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM trainers WHERE user_id = (SELECT id FROM users WHERE username = '` + username + `')`);
        if (rows.length) {
            return rows[0];
        }
        return null;
    },
    async getOwner(username) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM owners WHERE user_id = (SELECT id FROM users WHERE username = '` + username + `')`);
        if (rows.length) {
            return rows[0];
        }
        return null;
    },
};

module.exports = User;