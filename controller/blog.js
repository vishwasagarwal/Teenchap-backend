const Blog = require('../models/blog');
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const Category = require('../models/category');
const {createcategory, findIds} = require('../controller/category');
const fs = require('fs');

const smartTrim = (str, length, delim, appendix) => {
    if (str.length<= length) return str;

    var trimmedStr = str.substr(0, length + delim.length);

    var lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if (lastDelimIndex >= 0) 
        trimmedStr = trimmedStr.substr(0, lastDelimIndex);
    

    if (trimmedStr) 
        trimmedStr += appendix;
    
    return trimmedStr;
};
exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({error: "Image could not upload"})
        }
        const {title, body, category} = fields

        if (!title || !title.length) {
            return res.status(400).json({error: 'title is required'})
        }
        if (!body || body.length < 200) {
            return res.status(400).json({error: 'Content is too short'})
        }
        if(!files.photo){
            return res.status(400).json({error:'Cover Photo is required'});
        }
        let categories = category && category.split(',');
        createcategory(categories, () => {
            let arrayofCategories
            findIds(categories, (arrayofCategories) => {
                let blog = new Blog();
                blog.title = title
                blog.body = body
                blog.slug = slugify(title).toLowerCase()
                blog.mtitle = `${title} | ${
                    process.env.APP_NAME
                }`
                blog.mdesc = smartTrim(stripHtml(body), 160, ' ', '')
                blog.postedBy = req.user._id;
                blog.excerpt = smartTrim(stripHtml(body), 320, ' ', '...')

                if (files.photo) {
                    if (files.photo.size > 100000000) {
                        return res.status(400).json({error: 'Image should be less than 10mb in size'});
                    }
                    blog.photo.data = fs.readFileSync(files.photo.path)
                    blog.photo.contentType = files.photo.type
                }
                blog.save((err, result) => {
                    if (err) {
                        return res.status(400).json({error: err})
                    }
                    Blog.findByIdAndUpdate(result._id, {
                        $push: {
                            category: arrayofCategories
                        }
                    }, {new: true}).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({error: err})
                        }
                        res.json(result);
                    })
                })
            });
        });
    })
}
exports.listAllBlogsCategories = (req,res)=>{
    /*let limit = req.body.limit ? parseInt(req.body.limit):10
    let skip =  req.body.skip ? parseInt(req.body.skip): 0;

    let blogs
    let category

    Blog.find({})
    .populate('category','_id name slug')
    .populate('postedBy','_id name username profile')
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt category postedBy createdAt updatedAt')
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({error:err});
        }else{
            blogs = data;
            Category.find({})
            category
        }
    })
  */

}

exports.read = (req,res)=>{
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug})
    .populate('category','_id name slug')
    .populate('postedBy','_id name username profile')
    .select('_id title slug body mtitle mdesc excerpt category postedBy createdAt updatedAt')
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({error:err});
        }else{
            res.status(200).json(data);
        }
    })

}
exports.remove = (req,res) =>{
    const slug = req.params.slug.toLowerCase()
    Blog.findOneAndRemove({slug})
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({error:err});
        }else{
            res.status(200).json({message:"Blog Delete successfully"});
        }
    })

}
/*
exports.update = (req,res)=>{
    const slug = req.params.slug.tolowerCase();
    Blog.findOne({slug}).exec((err,oldBlog)=>{
        if(err){
            return res.status(400).json({error:err})
        }
        let form = new formidable.IncomingForm()
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({error: "Image could not upload"})
        }
        const {title, body, category} = fields
        let categories = category && category.split(',');
        createcategory(categories, () => {
            let arrayofCategories
            findIds(categories, (arrayofCategories) => {
                let blog = new Blog();
                blog.title = title
                blog.body = body
                blog.slug = slugify(title).toLowerCase()
                blog.mtitle = `${title} | ${
                    process.env.APP_NAME
                }`
                blog.mdesc = smartTrim(stripHtml(body), 160, ' ', '')
                blog.postedBy = req.user._id;
                blog.excerpt = smartTrim(stripHtml(body), 320, ' ', '...')

                if (files.photo) {
                    if (files.photo.size > 100000000) {
                        return res.status(400).json({error: 'Image should be less than 10mb in size'});
                    }
                    blog.photo.data = fs.readFileSync(files.photo.path)
                    blog.photo.contentType = files.photo.type
                }
                blog.save((err, result) => {
                    if (err) {
                        return res.status(400).json({error: err})
                    }
                    Blog.findByIdAndUpdate(result._id, {
                        $push: {
                            category: arrayofCategories
                        }
                    }, {new: true}).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({error: err})
                        }
                        res.json(result);
                    })
                })
            });
        });
    })
    })
}*/
exports.listAll = (req,res)=>{
    Blog.find({})
    .populate('category','_id name slug')
    .populate('postedBy','_id name username profile')
    .select('_id title slug excerpt category postedBy createdAt updatedAt')
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({error:err});
        }else{
            res.status(200).json(data);
        }
    })
}

exports.photo = (req,res)=>{
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .select('photo')
    .exec((err,blog)=>{
        if(err || !blog ){
            return res.status(400).json(
                {
                    error:err
                }
            )
        }
        res.set('Content-Type', blog.photo.contentType)
        return res.send(blog.photo.data);
    })
}