const Category = require('../models/category');
const slugify = require('slugify');
const async = require('async');
const AutoComplete = require('../autocomplete/main').AutoComplete;
const url = require('url');
const category = require('../models/category');

function slugs(nameid){
    return slugify(nameid).toLowerCase();
}
exports.createcategory = (arrayofCategories,callback)=>{
    let name = [];
    console.log(arrayofCategories);
    name=name.concat(arrayofCategories)
    console.log(name);
    let slug = name.map(slugs);
    let datas = [];
    for(let i =0; i<name.length;i++){
        let data = {"name":name[i],"slug":slug[i]};
        datas.push(data);
    }
    console.log(datas)
    async.each(datas,function(data,callback){
        let newCategory = new Category()
        newCategory.name = data.name;
        newCategory.slug = data.slug;
        newCategory.save((err,result)=>{
            if(err){
                console.log(err)
                callback(err);
            }
            else{
                callback(null);
            }
        });
    },function(err){
        callback(true)
    })
}
exports.findIds = (arrayofCategories,callback) =>{
    let arrayofCategoriesIds = []
    async.each(arrayofCategories,function(category,callback){
        Category.findOne({name:category}).exec((err,result)=>{
            if(result){
                arrayofCategoriesIds.push(result._id)
            }
            callback(null)
        }
        )
    },function(err){
        console.log(arrayofCategoriesIds);
        callback(arrayofCategoriesIds)
    })
}
/*exports.autocomplete = (req,res) =>{
    let q = (url.parse(req.url, true).query).search;
    let query = {
        "$or": {"$regex": q, "$options": "i"}
    }
// Autocomplete configuration
var configuration = {
	//Fields being autocompleted, they will be concatenated
	autoCompleteFields : ["slug"],
	//Returned data with autocompleted results
	dataFields: ["_id"],
	//Maximum number of results to return with an autocomplete request
	maximumResults: 5,
	//MongoDB model (defined earlier) that will be used for autoCompleteFields and dataFields
	model: Category
}


//initialization of AutoComplete Module
var myMembersAutoComplete = new AutoComplete(configuration, function(){
  //any calls required after the initialization
  console.log("Loaded " + myMembersAutoComplete.getCacheSize() + " words in auto complete");
});

myMembersAutoComplete.getResults(q, function(err, words){
  if(err)
    res.json([]);
  else
  {
    const result = words.map(word =>word.word);
    res.json(result);
  }
    
});
}

*/
exports.autocomplete = (req, res) => {
    let q = (url.parse(req.url, true).query).search;
    let query = {
        "$or": [{"slug": {"$regex": q, "$options": "i"}}]
    }
    let output = [];
  
    Category.find(query).limit(6).then( category => {
        if(category.length > 0) {
            category.forEach(category => {
              output.push(category.slug);
            });
        }
        console.log(output);
        res.json(output);
    }).catch(err => {
      console.log('error');
      console.log(err);
      res.json([]);
    });
  
};