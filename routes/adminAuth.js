const express = require('express');
var router = express.Router();

const validation = require('../middleWare/validation.js');
const adminAuthController = require('../controllers/adminAuth')


//POST method for login of admin
router.post('/login', validation.admin_login_validators, validation.validation, adminAuthController.login);

module.exports = router;