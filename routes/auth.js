const express=require('express');
const {signup,signin,signout,requireSignin,googleLogin}= require('../controller/auth');
const router = express.Router()

//validator 
const {userSignupValidator,userSigninValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index');


router.post('/signup',userSignupValidator,runValidation,signup);
router.post('/signin',userSigninValidator,runValidation,signin);
router.get('/signout',signout);
router.get('/secret',requireSignin,(req,res)=>{
    return res.json({
        user:req.user
    })
})
//google login
router.post('/google-login',googleLogin)

module.exports = router;