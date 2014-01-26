// Bismillah

/**
* Tests for models/Post.js
*/

var helper = require('./helper.models.js');
var Post = require('../models/Post');
var User = require('../models/User');

var should = require("should"),
	assert = require("assert");

describe("Post Model", function() {
	describe("PostModel Class", function() {
		describe("Initialization", function() {
			it("should create a Post object", function() {
				var post = new Post.Model();
				post.should.be.an.instanceof(Post.Model);
			});
		});
	});
});