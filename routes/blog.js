const express=require('express');
const {create}= require('../controller/blog');
const {requireSignin,authMiddleware}= require('../controller/auth');


const router = express.Router()

router.post('/blog',requireSignin,authMiddleware,create);

module.exports = router;