const express = require('express');
var router = express.Router();

const token = require('../middleWare/token.js');
const validation = require('../middleWare/validation.js');
const categoriesController = require('../controllers/categories')


//next id of categories
router.get('/nextNumber', token.checkToken, categoriesController.nextId);

//API for inserion of categories by admin
router.post('/register', token.checkToken, validation.admin_category_register_validators, validation.validation, categoriesController.registerCategory);

//API for get all the details of categories
router.get('/details', token.checkToken, categoriesController.getDetails);

//API to update the details of categories
router.post('/update', token.checkToken, validation.admin_category_update_validators, validation.validation, categoriesController.updateCategory);

//API to delete categories details
router.post('/delete', token.checkToken, validation.admin_category_delete_validators, validation.validation, categoriesController.deleteCategory);

module.exports = router;