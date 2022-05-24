const express = require('express');
var router = express.Router();

const resourcesController = require('../controllers/resources');




//GET method for get all the details of books
router.get('/details', resourcesController.getDetails);

//POST method for book view by Student
router.post('/requestFile', resourcesController.requestFile);

//GET method for requested file for view
router.get('/getFile', resourcesController.getFile);

module.exports = router;