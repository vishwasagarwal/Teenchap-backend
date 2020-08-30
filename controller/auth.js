const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {OAuth2Client} = require('google-auth-library');
const shortid = require('shortid');



exports.signup = (req,res)=>{
    const {name,email,password}=req.body;
    User.findOne({email:email}).exec((err,user)=>{
        if(user){
            return res.status(400).json({
                error: "email is already taken"
            })
        }
        let username = shortid.generate();

        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        const NewUser = {
            username,
            profile,
            name,
            email,
            password
        };
        let newuser = new User(NewUser);
        newuser.save((err,success)=>{
            if(err){
                return res.status(400).json({
                    error:err
                })

            }
            const token = jwt.sign({_id:success._id},process.env.JWT_SECRET,{expiresIn:'30d'});
            res.cookie('token', token,{expireIn:'30d'});
            const {_id, username, name, email} = success;
            return res.json({
            token,
            user: {_id, username, name, email}
           })
        });
    })
}

exports.signin = (req,res) =>{
    // check if user exist 
    const {email, password} = req.body
    //authenticate 
    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            res.json({
                error:"User with that email does not exist. please signup"
            })
        }
       if(!user.authenticate(password)){
        res.json({
            error:"Password does not match"
        })
       }
       const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'30d'});
       res.cookie('token', token,{expireIn:'30d'});
       const {_id, username, name, email} = user;
       return res.json({
           token,
           user:{
            _id, username, name, email
           }
       })
    });
    //generate jwt and send to client 
};


exports.signout = (req,res)=>{
    res.clearCookie();
    res.json({
        message: "Sign Out successfully"
    });
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
});
exports.authMiddleware = (req,res,next)=>{
    const authUserId = req.user._id
    console.log(authUserId)
    User.findById({_id:authUserId}).exec((err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:'User not found'
            })
        }
        req.profile = user
        next()
    })
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req,res) =>{
   const idToken = req.body.tokenId;
   client.verifyIdToken({idToken,audience: process.env.GOOGLE_CLIENT_ID}).then(response=>{
       console.log(response)
       const {email_verified, name, email, jti} = response.payload;
       if(email_verified){
           User.findOne({email}).exec((err,user)=>{
               if(user){
                const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'30d'});
                res.cookie('token', token,{expireIn:'30d'});
                const {_id,email,name,username}= user;
                return res.json({token, user:{_id,email,name,username}})
               }
               else {
                let username = shortId.generate();
                let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                let password = jti;
                let newuser = new User({name,email,profile,username,password});
                newuser.save((err,success)=>{
                    if(err){
                        return res.status(400).json({
                            error:err
                        })
        
                    }
                    const token = jwt.sign({_id:success._id},process.env.JWT_SECRET,{expiresIn:'30d'});
                res.cookie('token', token,{expireIn:'30d'});
                const {_id,email,name,username}= success;
                return res.json({token, user:{_id,email,name,username}})
                })
               }
           })
       }
       else {
           return res.status(400).json({
               error:'Google Login Failed. Try again.'
           });
       }
   })
}