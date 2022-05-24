const express = require('express');
var router = express.Router();

const validation = require('../middleWare/validation.js');
const supervisorAuthController = require('../controllers/supervisorAuth')


//API for registration of supervisors 
router.post('/registration', validation.supervisor_register_validators, validation.validation, supervisorAuthController.supervisorRegistration);

//API for login of supervisor
router.post('/login', validation.supervisor_login_validators, validation.validation, supervisorAuthController.login);

module.exports = router;