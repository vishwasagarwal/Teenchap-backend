const express=require('express');
const {create,listAll,listAllBlogsCategories,read,remove,photo}= require('../controller/blog');
const {requireSignin,authMiddleware}= require('../controller/auth');


const router = express.Router()

router.post('/blog',requireSignin,authMiddleware,create);
router.get('/blogs',listAll);
router.post('/blogs-categories',listAllBlogsCategories);
router.get('/blog/:slug',read);
router.get('/blog/photo/:slug',photo);
router.delete('/blog/:slug',requireSignin,authMiddleware,remove);
//router.put('/blog/:slug',requireSignin,authMiddleware,update);
module.exports = router;