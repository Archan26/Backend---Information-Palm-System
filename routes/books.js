const express = require('express');
const multer = require("multer");
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const booksControllers = require('../controllers/books')


//Function for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});
const uploadStorage = multer({ storage: storage });


router.post('/fileCheck', token.checkToken, booksControllers.fileCheck);

//POST method for upload the single file and enter the data in database of books
router.post("/upload/single", token.checkToken, uploadStorage.single("file"), booksControllers.uploadFile)

//GET method for next id of book
router.get('/nextNumber', token.checkToken, booksControllers.nextId);

//GET method, will used in dropdown in registration and update form 
router.get('/common', token.checkToken, booksControllers.getCommon);

//GET method for get all the details of books
router.get('/details', token.checkToken, booksControllers.bookDetails);

//POST method for update the details of books by admin
router.post('/update', token.checkToken, validation.admin_books_update_validators, validation.validation, booksControllers.updateBooks);

//POST method for delete books details by admin
router.post('/delete', token.checkToken, validation.admin_books_delete_validators, validation.validation, booksControllers.deleteBooks);

var book_name = "";
//POST method for book view by admin
router.post('/requestFile', token.checkToken, booksControllers.requestFile);

//GET method for requested file for view
router.get('/getFile', booksControllers.getFile);

module.exports = router;