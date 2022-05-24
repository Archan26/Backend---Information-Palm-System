const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const dashboardController = require('../controllers/dashboard')


//API for get all the counts 
router.get('/details', token.checkToken, dashboardController.getCounts);

module.exports = router;