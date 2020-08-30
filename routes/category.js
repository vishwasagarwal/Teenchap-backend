const express=require('express');
const {requireSignin,authMiddleware}= require('../controller/auth');
//const {read} = require('../controller/user')
const {autocomplete}=require('../controller/category');
const router = express.Router()
const {runValidation} = require('../validators/index');
const {categoryCreateValidator} = require('../validators/category');


router.get('/category/autocomplete/',autocomplete)

module.exports = router;