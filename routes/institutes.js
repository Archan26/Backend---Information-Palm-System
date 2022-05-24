const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const instituteController = require('../controllers/institutes')


//next id of institute
router.get('/nextNumber', token.checkToken, instituteController.nextId);

//API for registration of institutes by admin
router.post('/register', token.checkToken, validation.admin_institute_register_validators, validation.validation, instituteController.instituteRegistration);

//API for get all the details of institutes
router.get('/details', token.checkToken, instituteController.getDetails);

//API to update the details of institutes
router.post('/update', token.checkToken, validation.admin_institute_update_validators, validation.validation, instituteController.updateInstitute);

//API to delete institutes details
router.post('/delete', token.checkToken, validation.admin_institute_delete_validators, validation.validation, instituteController.deleteInstitute);

module.exports = router;