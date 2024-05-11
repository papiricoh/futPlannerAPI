const User = require('../models/db');
const config = require('../config/config');

async function checkToken(id, token) {
    if(token != null && token != "" && token == await User.getUserToken(id)) {
        return true;
    }else {
        throw new Error("Token invalid")
    }
}

exports.getTeam = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        team.players = await User.trainerGetPlayers(team.id);
        team.club = await User.getClubByUser(data.user_id);
        
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

exports.getMatches = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        var matches = await User.trainerGetMatches(team.id);
        
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

exports.getPlayerReports = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        var player = await User.trainerGetPlayer(data.player_user_id);
        if(player.team_id != team.id) {
            throw new Error('El identificador del equipo del entrenador no es el mismo que el del jugador')
        }
        var reports = await User.getPlayerLimitedReports(player.player_id);
        for (const report of reports) {
            report.match = await User.getMatch(report.match_id);
        }


        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ error: "Error: " + err.message });
    }
};


exports.getMatchReports = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var match = await User.getMatch(data.match_id);
        
        match.reports = await User.getMatchReports(match.id);
        


        res.status(200).json(match);
    } catch (err) {
        res.status(500).json({ error: "Error: " + err.message });
    }
};

//INSERT MATCH
exports.insertMatch = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        var match = { 
            match_date: data.match_date,
            map_coords: data.map_coords,
            place_name: data.place_name,
            home_team_id: data.home_team_id,
            home_team_name: data.home_team_name,
            away_team_id: data.away_team_id,
            away_team_name: data.away_team_name,
            sub_category_id: data.sub_category_id
        }
        var ok = await User.insertMatch(team, match);
        


        res.status(200).json(ok);
    } catch (err) {
        res.status(500).json({ error: "Error: " + err.message });
    }
};

//INSERT REPORTS
exports.insertReports = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        //var team = await User.trainerGetTeam(data.user_id);
        var ok = []
        for (const report of data.reports) {
            ok.push(await User.insertReport(data.match_id, report));
        }
        await User.evaluateMatch(data.match_id)
        

        res.status(200).json(ok);
    } catch (err) {
        res.status(500).json({ error: "Error: " + err.message });
    }
};


exports.checkMatches = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        var pending_match = await User.getPendingMatch(team.id);
        var next_match = await User.getNextMatch(team.id);
        
        
        var result = {
            pending_match: null,
            next_match: null,
        }
        result.pending_match = pending_match;
        result.next_match = next_match;


        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Error: " + err.message });
    }
};

exports.getTeamAnalytics = async (req, res) => {
    try {
        const data = req.body
        if(config.tokenMode) {
            await checkToken(data.user_id, data.token);
        }
        if(await User.getUserType(data.user_id) != 'trainer') {
            throw new Error("User is not a trainer")
        }
        var team = await User.trainerGetTeam(data.user_id);
        let raw_data = await User.getTeamAnalytics(team.id);
        
        const averages = {
            performancePerMinute: (raw_data.avg_general_performance / raw_data.total_played_time * 10).toFixed(2),
            goalRate: (raw_data.total_goals / (raw_data.total_matches * 90)).toFixed(2)
        };

        var result = raw_data
        result.performancePerMinute = averages.performancePerMinute;
        result.goalRate = averages.goalRate;


        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Error: " + err.message });
    }
};
