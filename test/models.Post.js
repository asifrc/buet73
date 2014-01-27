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
	var users = [];
	before(function(done) {
		content = helper.samplePost().content;
		helper.emptyDb(function() {
			helper.createPublicNode(function(error, res) {
				if (error)
				{
					done(error);
				}
				helper.createUsers(5, users, function(err) {
					if (err)
					{
						done(err);
					}
					User.find({}, function(err, res) {
						users = res;
						Array.isArray(users).should.be.ok;
						users.length.should.equal(5);
						users[0].should.be.an.instanceOf(User.Model);
						users[0].id().should.exist;
						owner = users[0];
						ownerId = owner.id();
						done();
					});
				});
			});
		});
	});
	//after(helper.emptyDb);
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
			it("should cast owner to a full User object when passed an _id number", function() {
				var post = new Post.Model(content, ownerId);
				post.content.should.equal(content);
				post.owner.should.be.an.instanceOf(User.Model);
				post.owner.id().should.equal(ownerId);
			});
			it("should cast owner to a full User object when passed a string", function() {
				var post = new Post.Model(content, ownerId.toString());
				post.content.should.equal(content);
				post.owner.should.be.an.instanceOf(User.Model);
				post.owner.id().should.equal(ownerId);
			});
			it("should ignore owner if in an invalid format", function() {
				var post = new Post.Model(content, {});
				post.content.should.equal(content);
				should.not.exist(post.owner);
			});
			it("should set the access property to 'Private' by default", function() {
				var post = new Post.Model();
				post.access.should.exist;
				post.access.should.equal("Private");
			});
		});
		describe("Properties", function() {
			it("should return a null value for _id when no _id has been set", function() {
				var post = new Post.Model();
				should(post.id()).equal(null);
			});
			it("should return the new value for _id set by the setter", function() {
				var post = new Post.Model();
				post.id(ownerId).should.equal(ownerId);
				post.id().should.equal(ownerId);
			});
			it("should allow access to be set directly", function() {
				var post = new Post.Model();
				post.access.should.equal("Private");
				post.access = "Public";
				post.access.should.equal("Public");
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
				var post = helper.samplePost();
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
			it("should return an error if the post owner is not a User object", function(done) {
				var post = helper.samplePost();
				post.owner = {};
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
			it("should return an error if the post owner's id is not set", function(done) {
				var post = new Post.Model();
				post.content = helper.samplePost().content;
				post.owner = new User.Model();
				Post.create(post, function(err, res) {
					err.should.exist;
					done();
				});
			});
		});
		describe("Valid Post", function() {
			it("should return an array containing one PostModel object", function(done) {
				var post = helper.samplePost(owner);
				Post.create(post, function(err, result) {
					should.not.exist(err);
					result.should.exist;
					Array.isArray(result).should.be.ok;
					result.length.should.equal(1);
					result[0].should.be.an.instanceOf(Post.Model);
					result[0].owner.should.be.an.instanceOf(User.Model);
					done();
				});
			});
		});
	});
});