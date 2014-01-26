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
	var content, owner, ownerId;
	before(function() {
		content = "This is a post.";
		owner = new User.Model();
		ownerId = "1234";
		owner.id(ownerId);
	});
	describe("PostModel Class", function() {
		describe("Initialization", function() {
			it("should create a Post object", function() {
				var post = new Post.Model();
				post.should.be.an.instanceof(Post.Model);
			});
			it("should set the content property when passed", function() {
				var post = new Post.Model(content);
				post.content.should.equal(content);
			});
			it("should set the owner property when passed content and a User object", function() {
				var post = new Post.Model(content, owner);
				post.content.should.equal(content);
				post.owner.should.be.an.instanceOf(User.Model);
				post.owner.id().should.equal(ownerId);
			});
			it("should cast owner to a full User object when passed a string", function() {
				var post = new Post.Model(content, ownerId);
				post.content.should.equal(content);
				post.owner.should.be.an.instanceOf(User.Model);
				post.owner.id().should.equal(ownerId);
			});
			it("should cast owner to a full User object when passed a number", function() {
				var post = new Post.Model(content, parseInt(ownerId));
				post.content.should.equal(content);
				post.owner.should.be.an.instanceOf(User.Model);
				post.owner.id().should.equal(ownerId);
			});
		});
		describe("ID", function() {
			it("should return a null value for _id when no _id has been set", function() {
				var post = new Post.Model();
				should(post.id()).equal(null);
			});
			it("should return the new value for _id set by the setter", function() {
				var post = new Post.Model();
				post.id(ownerId).should.equal(ownerId);
				post.id().should.equal(ownerId);
			});
		});
	});
	describe("Create", function() {
		describe("Validation", function() {
			it("should return an error if the post parameter is not a Post object", function(done) {
				var post = {};
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
			it("should return an error if the content property is null", function(done) {
				var post = new Post.Model();
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
			it("should return an error if the post owner is null", function(done) {
				var post = new Post.Model();
				post.content = content;
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
			it("should return an error if the post owner is not a User object", function(done) {
				var post = new Post.Model();
				post.content = content;
				post.owner = {};
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
			it("should return an error if the post owner's id is not set", function(done) {
				var post = new Post.Model();
				post.content = content;
				post.owner = new User.Model();
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
		});
	});
});