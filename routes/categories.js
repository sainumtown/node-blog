var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('127.0.0.1:27017/nodeblog');


/*Show*/
router.get('/show/:category', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({
		category: req.params.category
	}, {}, function(err, posts) {
		res.render('index', {
			"title": req.params.category,
			"posts": posts
		});
	});

});

/*add */
router.get('/add', function(req, res, next) {
	res.render('addCategories', {
		"titles": "Add categores"
	});
});

/* Categories posts regieter*/
router.post('/add', function(req, res, next) {

	// get value from req
	var title = req.body.title;

	// Form validation
	req.checkBody('title', "Title field is empty.").notEmpty();

	// Check errors
	var errors = req.validationErrors();
	var db = req.db;
	if (errors) {
		res.render('addCategories', {
			"title": "Add Post",
			"errors": errors
		});
	} else {

		var categories = db.get('categories');
		console.log('before insert');
		// submit to save
		categories.insert({
			"title": title,
		}, function(err, category) {
			if (err) {
				res.send('There was an issuing in submitting the category');
			} else {
				req.flash('success', "category submitted");
				res.location('/');
				res.redirect('/');
			}
		});
	}

});

module.exports = router;