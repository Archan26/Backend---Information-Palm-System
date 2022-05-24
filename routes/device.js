const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const deviceController = require('../controllers/device')


//for admin
//next id of device
router.get('/nextNumber', token.checkToken, deviceController.nextId);

//details for reg, update
router.get('/common', token.checkToken, deviceController.getCommon);

//device registration by admin
router.post('/register', token.checkToken, validation.admin_device_register_validators, validation.validation, deviceController.deviceRegistration);

//API for get all details of device  
router.get('/details', token.checkToken, deviceController.getDetails);

//device update by admin (assign supervisor)
router.post('/update', token.checkToken, validation.admin_device_update_validators, validation.validation, deviceController.updateDevice);



//for supervisors

router.get('/commonDetails', token.checkToken, deviceController.getCommonDetails);

router.get('/deviceDetails', token.checkToken, deviceController.getDeviceDetails);

//device assign by supervisor
router.post('/assignDevice', token.checkToken, validation.supervisor_assignDevice_validators, validation.validation, deviceController.assignDevice);

//device assign by supervisor
router.post('/unAssignDevice', token.checkToken, validation.supervisor_unAssignDdevice_validators, validation.validation, deviceController.unassignDevice);

module.exports = router;