const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController.js');
const userController = require('../controllers/userController.js');
const fileController = require('../controllers/fileController.js');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload/team', upload.single('teamPhoto'), fileController.newTeam);

router.get('/clubs', mainController.getAllClubs);
router.get('/categories', mainController.getCategories);

router.post('/newUser', mainController.newUser);
router.post('/logIn', mainController.logIn);
router.post('/logIn/token', mainController.logInToken);
router.post('/user/changePassword', mainController.changePassword);

router.post('/teams/user', userController.getUserTeam)
router.post('/club/owner', userController.getOwnerClub)
router.post('/teams/owner', userController.getOwnerTeams)
router.post('/trainers/owner', userController.getTrainersAsOwner)

module.exports = router;