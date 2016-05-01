var express = require('express');
var router = express.Router();
var mongo =  require('mongodb');
var db = require('monk')('127.0.0.1:27017/nodeblog');


/* GET home page blog spot. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{},function(err,posts){
		res.render('index',{posts:posts});	
	});
	// res.render('index',{title:"GOod"});
});

module.exports = router;
