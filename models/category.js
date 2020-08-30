const mongoose = require('mongoose');
const stringStripHtml = require('string-strip-html');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
    },
    slug: {
        type: String,
        unique:true,
        index:true,
    },
    
},{timestamps: true});



module.exports = mongoose.model('Category', categorySchema);
