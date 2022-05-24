const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const aStudentController = require('../controllers/a_students.js');



//GET method for next id of student
router.get('/nextNumber', token.checkToken, aStudentController.nextId);

//GET method, will used in dropdown in registration and update form 
router.get('/common', token.checkToken, aStudentController.getCommon);

//POST method for registration of students by admin
router.post('/register', token.checkToken, validation.admin_student_register_validators, validation.validation, aStudentController.postRegistration);

//GET method for get all the details of students 
router.get('/details', token.checkToken, aStudentController.getStudents);

//POST method for update the details of students by admin
router.post('/update', token.checkToken, validation.admin_student_update_validators, validation.validation, aStudentController.updateStudents);

//POST method for delete students details by admin
router.post('/delete', token.checkToken, validation.admin_student_delete_validators, validation.validation, aStudentController.deleteStudetns);

module.exports = router;