const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const sStudentContoller = require('../controllers/s_students')



//Institutes details
//Grades details
//GET method for next id of student
router.get('/nextNumber', token.checkToken, sStudentContoller.nextId);

//GET method, will used in dropdown in registration and update form 
router.get('/common', token.checkToken, sStudentContoller.getCommon);

//API for registration of students by admin
router.post('/register', token.checkToken, validation.supervisor_student_register_validators, validation.validation, sStudentContoller.studentRegistration);

//API for get all the details of students 
router.get('/details', token.checkToken, sStudentContoller.getDetails);

//API to update the details of students
router.post('/update', token.checkToken, validation.supervisor_student_update_validators, validation.validation, sStudentContoller.updateStudent);

//API to delete students details
router.post('/delete', token.checkToken, validation.supervisor_student_delete_validators, validation.validation, sStudentContoller.deleteStudent);

module.exports = router;