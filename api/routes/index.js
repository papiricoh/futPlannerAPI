const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController.js');
const userController = require('../controllers/userController.js');
const trainerController = require('../controllers/trainerController.js');

/*
#############################################################
CORE ROUTES
#############################################################
*/
router.get('/clubs', mainController.getAllClubs);
router.get('/categories', mainController.getCategories);

router.post('/newUser', mainController.newUser);
router.post('/logIn', mainController.logIn);
router.post('/logIn/token', mainController.logInToken);
router.post('/user/changePassword', mainController.changePassword);

/*
#############################################################
OWNER (FutPlannerAdmin) ROUTES
#############################################################
*/
router.post('/teams/user', userController.getUserTeam)
router.post('/club/owner', userController.getOwnerClub)
router.post('/teams/owner', userController.getOwnerTeams)
router.post('/trainers/owner', userController.getTrainersAsOwner)
router.post('/newTeam/owner', userController.newTeam)
router.post('/fullTeam/owner/id', userController.getFullTeamByIdOwner)
router.post('/unasignPlayer/owner', userController.unasignPlayer)
router.post('/updatePlayer/owner', userController.updatePlayer)
router.post('/changeTrainerTeam/owner', userController.changeTrainerTeam)
router.post('/removeTrainerFromTeam/owner', userController.removeTrainerFromTeam)
router.post('/getAvariablePlayers/owner', userController.getAvariablePlayers)
router.post('/addPlayersToTeam/owner', userController.addPlayersToTeam)
router.post('/getAllUsers/owner', userController.getAllUsersOwner)
router.post('/changeClubName/owner', userController.changeClubName)
router.post('/getClubAnalytics/owner', userController.getClubAnalytics)

/*
#############################################################
TRAINER ROUTES
#############################################################
*/
router.post('/trainer/getTeam', trainerController.getTeam)
router.post('/trainer/getMatches', trainerController.getMatches)
router.post('/trainer/getPlayerReports', trainerController.getPlayerReports)
router.post('/trainer/getMatchReports', trainerController.getMatchReports)
router.post('/trainer/insertMatch', trainerController.insertMatch)
router.post('/trainer/insertReports', trainerController.insertReports)
router.post('/trainer/checkMatches', trainerController.checkMatches)
router.post('/trainer/getTeamAnalytics', trainerController.getTeamAnalytics)


module.exports = router;