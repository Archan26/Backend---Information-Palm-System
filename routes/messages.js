const express = require('express');
let jwt = require('jsonwebtoken');
const token = require('../middleWare/token.js');
const connection = require('../utils/connection.js');
const validation = require('../middleWare/validation.js');
const messageController = require('../controllers/messages')
var router = express.Router();

//POST method for send the message by Student
router.post('/send', token.checkToken, messageController.sendMessage);

//GET method for get all the messages of students
router.get('/receive', token.checkToken, messageController.receiveMessage);

//POST method for delete message by supervisor
router.post('/delete', token.checkToken, messageController.deleteMessage);

module.exports = router;