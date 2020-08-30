const express=require('express');
const {requireSignin,authMiddleware}= require('../controller/auth');
const {read} = require('../controller/user')
const router = express.Router()


router.get('/profile',requireSignin,authMiddleware,read);

module.exports = router;