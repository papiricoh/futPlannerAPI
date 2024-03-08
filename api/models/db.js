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
    async getAllSubCategories(categoryId) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM sub_categories WHERE category_id = ?`, categoryId);
        if (rows.length) {
            return rows;
        }
        throw new Error('No Sub Categories in the database');
    },

    async getClubByUser(user_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM clubs WHERE id = (SELECT club_id FROM users WHERE id = ?) LIMIT 1`, user_id);
        if (rows.length) {
            return rows[0];
        }
        throw new Error('No Club with id: ' + user_id);
    },

    async getMatch(match_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM matches WHERE id = ? LIMIT 1`, match_id);
        if (rows.length) {
            return rows[0];
        }
        throw new Error('No Match with id: ' + match_id);
    },

    async getMatchReports(match_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM reports WHERE match_id = ?`, match_id);
        if (rows.length) {
            return rows;
        }
        throw new Error('No Match with id: ' + match_id);
    },
    async getAllCategories() {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM categories`);
        if (rows.length) {
            return rows;
        }
        throw new Error('No Categories in the database');
    },
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
    async getTeamById(teamId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM teams WHERE id = ? LIMIT 1`, 
                [teamId]
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
    async getTeamTrainer(teamId) {
        try {
            const result = await connection.promise().query(
                `SELECT * FROM users WHERE id = (SELECT user_id FROM trainers WHERE team_id = ? LIMIT 1)`, 
                [teamId]
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
    async getTeamPlayers(teamId) {
        try {
            const result = await connection.promise().query(
                `SELECT users.*, players.position, players.shirt_number, players.nationality FROM users INNER JOIN players ON users.id = players.user_id WHERE players.team_id = ?;`, 
                [teamId]
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
    async getTeamCategory(teamId) {
        try {
            const result = await connection.promise().query(
                `SELECT c.category_name AS category, sc.sub_category_name AS subcategory FROM teams t INNER JOIN sub_categories sc ON t.sub_category_id = sc.id INNER JOIN categories c ON sc.category_id = c.id WHERE t.id = ?;`, 
                [teamId]
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


    async getOwnerClub(userId) {
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
    async unasignPlayer(player_id) {
        try {
            const result = await connection.promise().query(
                `UPDATE players SET team_id = ? WHERE user_id = ?`, 
                [null, player_id]
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
    async updatePlayer(player) {
        try {
            const result = await connection.promise().query(
                `UPDATE players SET position = ?, shirt_number = ?, nationality = ? WHERE user_id = ?`, 
                [player.position, player.shirt_number, player.nationality, player.id]
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
    async updateUser(player) {
        try {
            const result = await connection.promise().query(
                `UPDATE users SET first_name = ?, last_name = ? WHERE id = ?`, 
                [player.first_name, player.last_name, player.id]
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
    async updateTrainer(player, team_id) {
        
        try {
            const result = await connection.promise().query(
                `UPDATE trainers SET team_id = ? WHERE user_id = ?`, 
                [team_id, player.id]
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
    async removeTrainerFromTeam(player) {
        
        try {
            const result = await connection.promise().query(
                `UPDATE trainers SET team_id = ? WHERE user_id = ?`, 
                [null, player.id]
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
    async getTrainersByClub(club_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT u.*, t.team_id
        FROM users u
        INNER JOIN trainers t ON u.id = t.user_id
        LEFT JOIN teams tm ON t.team_id = tm.id
        WHERE u.club_id = ?;`, [club_id]);
        if (rows.length) {
            return rows;
        }
        return null;
    },
    async newTeam(data) {
        try {
            const result = await connection.promise().query(
                `INSERT INTO teams (team_name, shield_url, sub_category_id, club_id) VALUES (?, ?, ?, ?)`, 
                [data.name, data.shield_url, data.sub_category, data.club_id]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting team into the database');
        }
    },
    async updateTrainerTeam(user_id, team_id) {
        try {
            const result = await connection.promise().query(
                `UPDATE trainers SET team_id = ? WHERE user_id = ?;`, 
                [team_id, user_id]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting team into the database');
        }
    },
    async getAvariablePlayers(team_id) {
        try {
            const result = await connection.promise().query(
                `SELECT 
                u.*, p.position, p.shirt_number, p.nationality, p.team_id
            FROM 
                users u
                INNER JOIN players p ON u.id = p.user_id
            WHERE 
                p.team_id IS NULL
                AND u.club_id = (SELECT club_id FROM teams WHERE id = ?);`, 
                [team_id]
            );
            if(result.length){
                return result[0];
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting team into the database');
        }
    },
    async addPlayersToTeam(team_id, player) {
        try {
            const result = await connection.promise().query(
                `UPDATE players SET team_id = ? WHERE user_id = ?;`, 
                [team_id, player.id]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting player team into the database');
        }
    },
    async updateProfileImage(user_id, url) {
        try {
            const result = await connection.promise().query(
                `UPDATE users SET photo_url = ? WHERE id = ?;`, 
                [url, user_id]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error updating profile img into the database');
        }
    },
    async updateClubImage(club_id, url) {
        try {
            const result = await connection.promise().query(
                `UPDATE clubs SET shield_url = ? WHERE id = ?;`, 
                [url, club_id]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error updating club img into the database');
        }
    },

    async trainerGetTeam(user_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM teams WHERE id = (SELECT team_id FROM trainers WHERE user_id = '` + user_id + `') LIMIT 1`);
        if (rows.length) {
            return rows[0];
        }
        return null;
    },
    
    async trainerGetPlayers(team_id) {
        const [rows, fields] = await connection.promise().query(`SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.photo_url,
        users.date_of_birth,
        players.id AS player_id,
        players.position,
        players.shirt_number,
        players.nationality
        FROM 
        players
        JOIN 
        users ON players.user_id = users.id
        WHERE 
        players.team_id = ` + team_id + `;`);
        if (rows.length) {
            return rows;
        }
        return null;
    },

    async trainerGetMatches(team_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM matches WHERE home_team_id = ` + team_id + ` OR away_team_id = ` + team_id + ` ORDER BY match_date`);
        if (rows.length) {
            return rows;
        }
        return null;
    },

    async trainerGetPlayer(player_id) {
        const [rows, fields] = await connection.promise().query(`SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.photo_url,
        users.date_of_birth,
        players.id AS player_id,
        players.position,
        players.shirt_number,
        players.nationality,
        players.team_id
        FROM 
        players
        JOIN 
        users ON players.user_id = users.id
        WHERE 
        users.id = ` + player_id + `;`);
        if (rows.length) {
            return rows[0];
        }
        return null;
    },

    async getPlayerLimitedReports(player_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM reports WHERE player_id = ` + player_id + ` LIMIT 6`);
        if (rows.length) {
            return rows;
        }
        return null;
    },

    async getPlayerReports(player_id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM reports WHERE player_id = ` + player_id);
        if (rows.length) {
            return rows;
        }
        return null;
    },
    async insertMatch(team, match) {
        try {
            const result = await connection.promise().query(
                `INSERT INTO matches (match_date, map_coords, place_name, home_team_id, home_team_name, away_team_id, away_team_name, sub_category_id, evaluated) VALUES (FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?, ?, 0)`,
                [match.match_date, match.map_coords, match.place_name, match.home_team_id == team.id ? team.id : null, match.home_team_name, match.away_team_id == team.id ? team.id : null, match.away_team_name, team.sub_category_id]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting match into the database');
        }
    },
    async insertReport(player_id, match_id, report) {
        try {
            const result = await connection.promise().query(
                `INSERT INTO reports (player_id, match_id, general_performance, tactical_performance, passes_quality, ball_control, game_vision, played_time, goals, red_cards, yellow_cards) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [player_id, match_id, report.general_performance, report.tactical_performance, report.passes_quality, report.ball_controll, report.game_vision, report.played_time, report.goals, report.red_cards, report.yellow_cards]
            );
            if(result.length){
                return result[0].insertId;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error('Error inserting report into the database');
        }
    },
};

module.exports = User;