var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('127.0.0.1:27017/nodeblog');

/*show*/
router.get('/show/:id', function(req, res, next) {
	var db = req.db;
	var id = req.params.id;
	var post = db.get('posts');
	post.findById(id, function(err, post) {
		res.render('show', {
			"post": post
		});
	});
});

/* GET POST*/
router.get('/add', function(req, res, next) {
	var db = req.db;
	var categories = db.get('categories');
	categories.find({}, {}, function(err, categories) {
		console.log(categories);
		res.render('addPost', {
			"title": "Add Post",
			"categories": categories
		});
	});
});

/* Post posts regieter*/
router.post('/add', function(req, res, next) {

	// get value from req
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	console.log(req.files);

	if (req.files.mainimage) {
		var mainImageOrginalName = req.files.mainimage.originalName;
		var mainImageName = req.files.mainimage.name;
		var mainImageMime = req.files.mainimage.mimetype;
		var mainImagePath = req.files.mainimage.path;
		var mainImageExt = req.files.mainimage.extension;
		var mainImageSize = req.files.mainimage.size;
	} else {
		var mainImageName = 'noimage.png';
	}



	// Form validation
	req.checkBody('title', "Title field is empty.").notEmpty();
	req.checkBody('body', "Body field is empty.").notEmpty();

	// Check errors
	var errors = req.validationErrors();
	var db = req.db;
	if (errors) {

		var categories = db.get('categories');
		categories.find({}, {}, function(err, categories) {
			console.log(categories);
			res.render('addPost', {
				"title": "Add Post",
				"categories": categories,
				"body": body,
				"errors": errors
			});
		});
	} else {

		var posts = db.get('posts');
		console.log('before insert');
		// submit to save
		posts.insert({
			"title": title,
			"category": category,
			"body": body,
			"author": author,
			"date": date,
			"mainimage": mainImageName
		}, function(err, post) {
			if (err) {
				res.send('There was an issuing in submitting the post');
			} else {
				req.flash('success', "Post submitted");
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

/*Add comment*/
router.post('/addcomment', function(req, res, next) {
	// get value from req
	var postid = req.body.postid;
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var commentDate = new Date();

	// Form validation
	req.checkBody('email', "Email field is empty.").notEmpty();
	req.checkBody('email', "Email is not formatted.").isEmail();
	req.checkBody('name', "Name field is empty.").notEmpty();
	req.checkBody('body', "Body field is empty.").notEmpty();

	// Check errors
	var errors = req.validationErrors();
	var db = req.db;
	if (errors) {
		var posts = db.get('posts');
		posts.findById(postid, function(err, post) {
			res.render('show', {
				"errors": errors,
				"post": post
			});
		});
	} else {
		var comment = {
			"name": name,
			"email": email,
			"body": body,
			"commentDate": commentDate
		};

		var posts = db.get('posts');
		console.log('before update');

		// update to save
		posts.update({
				"_id": postid
			}, {
				$push: {
					"comments": comment
				}
			},
			function(err, doc) {
				if (err) {
					throw err;
				} else {
					req.flash('success', "Commit Added");
					res.location('/posts/show/' + postid);
					res.redirect('/posts/show/' + postid);
				}
			}
		);
	}

});
module.exports = router;