const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController.js');
const userController = require('../controllers/userController.js');

router.get('/clubs', mainController.getAllClubs);

router.post('/newUser', mainController.newUser);
router.post('/logIn', mainController.logIn);
router.post('/logIn/token', mainController.logInToken);
router.post('/user/changePassword', mainController.changePassword);

router.post('/teams/user', userController.getUserTeam)
router.post('/club/owner', userController.getOwnerClub)

module.exports = router;