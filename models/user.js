const mongoose = require('mongoose');
const crypto = require('crypto');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String,
        required: true
    },
    hash_password: {
        type: String,
        required: true
    },
    salt: String,
    about: {
        type: String
    },
    profilepic: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        data: String,
        default: ""
    },
    coverpic:{
        data:Buffer,
        contentType:String
    },
    Followers: [{ type: ObjectId, ref: "User" }],
	Following: [{ type: ObjectId, ref: "User" }],
}, {timestamps: true});

userSchema.virtual('password').set(function(password) { // create a temporary variable called _password
    this._password = password
    // generate salt
    this.salt = this.makeSalt()
    // encryptPassword
    this.hash_password = this.encryptPassword(password);
}).get(function () {
    return this._password;
})

userSchema.methods = {
    authenticate: function(plaintext) {
        return this.encryptPassword(plaintext) === this.hash_password;

    },
    encryptPassword: function(password) {
        if (!password) 
            return ""
        
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password).digest('hex');
        } catch (err) {
            return ""
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + "";
    }
}

module.exports = mongoose.model('User', userSchema);
