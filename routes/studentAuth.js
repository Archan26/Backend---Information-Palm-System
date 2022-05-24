const express = require('express');
var router = express.Router();

const validation = require('../middleWare/validation.js');
const studentAuthController = require('../controllers/studentAuth')


//API for login of students
router.post('/login', validation.student_login_validators, validation.validation, studentAuthController.login);

// router.post('/add', studentAuthController.post);

module.exports = router;