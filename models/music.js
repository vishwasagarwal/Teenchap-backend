const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: true,
        min:3,
        max:160,
    },
    slug: {
        type: String,
        index:true
    },
    Captions: {
        type: {},
        required: true,
        min:200,
        max:2000000
    },
    mtitle: {
        type: String,
    },
    mdesc: {
        type: String,
    },
    Url:{
        type:String,
        required:true
    },
    category:[{type:ObjectId,ref:'Category',required:true}],
    postedBy:{type:ObjectId,ref:'User'},
}, {timestamps: true});

module.exports = mongoose.model('Blog', blogSchema);
