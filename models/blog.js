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
    body: {
        type: {},
        required: true,
        min:200,
        max:2000000
    },
    excerpt: {
        type: String,
        required: true,
        max:1000
    },
    mtitle: {
        type: String,
    },
    mdesc: {
        type: String,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    category:[{type:ObjectId,ref:'Category',required:true}],
    postedBy:{type:ObjectId,ref:'User'},
}, {timestamps: true});

module.exports = mongoose.model('Blog', blogSchema);


//TODO add like options 
//TODO add comment options 
