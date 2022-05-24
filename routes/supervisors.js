const express = require('express');
const token = require('../middleWare/token.js');
const connection = require('../utils/connection');
const validation = require('../middleWare/validation.js');
const supervisorController = require('../controllers/supervisors')
var router = express.Router();


//API for get all the details of supervisors 
router.get('/details', token.checkToken, supervisorController.getDetails);

//API for get all the details of verified supervisors 
router.get('/verified_details', token.checkToken, supervisorController.getVerifiedDetails);

//API to transfer the all students from one supervisor to another verified supervisor
router.post('/transfer', token.checkToken, validation.admin_supervisor_transfer_validators, validation.validation, supervisorController.transfer);

//API for supervisor verification 
router.post('/verification', token.checkToken, validation.admin_supervisor_verification_validators, validation.validation, supervisorController.verification);

//API to delete supervisors details
//In this first it will count no. of students under particular supervisor, 
//if it is 0 then details can be delete else not
router.post('/delete', token.checkToken, validation.admin_supervisor_delete_validators, validation.validation, supervisorController.deleteSupervisor);

module.exports = router;