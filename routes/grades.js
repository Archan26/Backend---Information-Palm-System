const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const gradesController = require('../controllers/grades')


//next id of grades
router.get('/nextNumber', token.checkToken, gradesController.nextId);

//API for registration of grades by admin
router.post('/register', token.checkToken, validation.admin_grade_register_validators, validation.validation, gradesController.gradeRegistration);

//API for get all the details of grades
router.get('/details', token.checkToken, gradesController.getDetails);

//API to update the details of grades
router.post('/update', token.checkToken, validation.admin_grade_update_validators, validation.validation, gradesController.updateGrade);

//API to delete grades details
router.post('/delete', token.checkToken, validation.admin_grade_delete_validators, validation.validation, gradesController.deleteGrade);

module.exports = router;