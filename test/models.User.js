//Bismillah

/**
* Tests for models/User.js
*/

var User = require('../models/User');

var should = require("should"),
	assert = require("assert");

var rest = require('restler');
var db_url = process.env.NEO4J_URL || 'http://localhost:7474';
db_url += "/db/data/cypher";

var strToTitle = function(str) {
	return str.toLowerCase().replace(/(?:^.)|(?:\s.)/g, function(letter) { return letter.toUpperCase(); });
};
var userValues = {
	fbid: 15000000000,
	firstName: [
		"James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas"
	],
	lastName: [
		"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore"
	],
	department: [
		"Architecture",
		"Civil Engineering",
		"Chemical Engineering",
		"Electrical Engineering",
		"Mechanical Engineering",
		"Metallurgical Engineering",
		"Naval Architecture"
	],
	country: [
		'United States', "Australia", "Bangladesh", "China", "India", "United Kingdom"
	]
};

var validUser = function() {
	var vals = userValues;
	vals.firstName.push(vals.firstName.shift());
	vals.lastName.push(vals.lastName.shift());
	return {
		fbid: (vals.fbid++).toString(),
		firstName: vals.firstName[0],
		lastName: vals.lastName[0],
		displayName: vals.firstName[0]+" "+vals.lastName[0],
		department:  vals.department[Math.floor(Math.random()*vals.department.length)],
		email: (vals.firstName[0]+vals.lastName[0]).toLowerCase()+"@asifchoudhury.com",
		password: "password",
		country: vals.country[Math.floor(Math.random()*vals.country.length)]
	};
};

var emptyDb = function(cb) {
	var query = {"query": "MATCH (n)-[r]-() DELETE n,r"};
	rest.postJson(db_url, query).on('complete', function(data, response) {
		if (response.statusCode === 200)
		{
			query = {"query": "MATCH (n) DELETE n"};
			rest.postJson(db_url, query).on('complete', function(data, response) {
				if (response.statusCode === 200)
				{
					cb();
				}
				else
				{
					cb(response.statusCode);
				}
			});
		}
		else
		{
			cb(response.statusCode);
		}
	});
};

describe("User Model", function() {
	before(function(done) {
		emptyDb(done);
	});
	describe("UserModel", function() {
		it("should create a new User object", function() {
			var user = new User.Model();
			user.should.be.an.instanceOf(User.Model);
		});
		it("should create a new User object from another User object", function() {
			var obj = validUser();
			var userA = new User.Model(obj);
			userA.should.be.an.instanceOf(User.Model);
			var userB = new User.Model(userA);
			userB.should.be.an.instanceOf(User.Model);
			for (var field in userA) 
			{
				if (userA[field] !== null && typeof userB[field] !== "function")
				{
					userA[field].should.equal(userB[field]);
				}
			}
		});
		var fieldTest = function(field) {
			it("should contain a `"+field+"` property", function() {
				var user = new User.Model();
				(typeof user[field]).should.equal("object");
			});
			it("should set a value for `"+field+"` when present in parameter", function() {
				var obj = {};
				obj[field] = "Value";
				var user = new User.Model(obj);
				if (field !== "password")
				{
					user[field].should.equal("Value");
				}
				else
				{
					user.confirmPassword("Value").should.be.ok;
				}
			});
		};
		for (var i=0; i<User.allFields.length; i++)
		{
			fieldTest(User.allFields[i]);
		}
		it("should accept and return a valid user object as a parameter", function() {
			var obj = validUser();
			var user = new User.Model(obj);
			user.should.be.an.instanceOf(User.Model);
		});
	});
	describe("Register", function() {
		before(function(done) {
			emptyDb(done);
		});
		afterEach(function(done) {
			emptyDb(done);
		});
		describe("Connection", function() {
			it("should return an error if the server returns an error code", function(done) {
				var old_url = User.db_url();
				User.db_url(old_url+"/badaddress");
				var user = new User.Model(validUser());
				user.cpassword = "password";
				User.register(user, function(err, result) {
					err.should.exist;
					User.db_url(old_url);
					done();
				});
			});
			it("should return an object when the callback passed is not a function", function() {
				var user = new User.Model(validUser());
				user.cpassword = "password";
				var e = new Error();
				var block = function() {
					User.register(user, {});
				};
				should(block).not.throw(e);
			});
		});
		describe("Validation", function() {
			var reqTest = function(field) {
				it("should return an error when `"+field+"` is missing", function(done) {
					var invalidUser = validUser();
					invalidUser.cpassword = invalidUser.password;
					delete invalidUser[field];
					User.register(invalidUser, function(err, result) {
						err.should.equal("Registration Error: "+field+" field is missing");
						done();
					});
				});
				it("should return an error when `"+field+"` is blank", function(done) {
					var invalidUser = validUser();
					invalidUser.cpassword = invalidUser.password;
					invalidUser[field] = "";
					User.register(invalidUser, function(err, result) {
						err.should.equal("Registration Error: "+field+" field cannot be blank");
						done();
					});
				});
			};
			for (var i=0; i<User.reqFields.length; i++)
			{
				reqTest(User.reqFields[i]);
			}
			
			it("should return an error if password confirmation missing", function(done) {
				var invalidUser = validUser();
				User.register(invalidUser, function(err, result) {
					err.should.equal("Registration Error: cpassword field is missing");
					done();
				});
			});
			it("should return an error if the passwords do not match", function(done) {
				var invalidUser = validUser();
				invalidUser.cpassword = invalidUser.password+"mismatch";
				User.register(invalidUser, function(err, result) {
					err.should.equal("Registration Error: passwords do not match");
					done();
				});
			});
			it("should return an error if the email is invalidly formatted", function(done) {
				var user = validUser();
				user.cpassword = user.password;
				user.email = "notavalidformat1";
				User.register(user, function(err, result) {
					err.should.equal("Registration Error: invalid email format");
					user = validUser();
					user.cpassword = user.password;
					user.email = "notavalid@format2";
					User.register(user, function(err, result) {
						err.should.equal("Registration Error: invalid email format");
						user = validUser();
						user.cpassword = user.password;
						user.email = "@notavalidformat3";
						User.register(user, function(err, result) {
							err.should.equal("Registration Error: invalid email format");
							done();
						});
					});
				});
			});
			it("should return an error if the email address already exists", function(done) {
				var user = validUser();
				user.cpassword = user.password;
				User.register(user, function(err, result) {
					should.not.exist(err);
					User.register(user, function(err, result) {
						err.should.equal("Registration Error: email already in use");
						done();
					});
				});
			});
		});
		describe("Valid User", function() {
			it("should return no error if successfully registered", function(done) {
				var user = new User.Model(validUser());
				user.cpassword = validUser().password;
				User.register(user, function(err, result) {
					should.not.exist(err);
					result.data.should.exist;
					done();
				});
			});
		});
	});
	describe("Find", function() {
		var tempUsers = [];
		before(function(done) {
			this.timeout(20000); // Extended max timeout for Travis CI
			var userCount = 10;
			var countDown = function(cb) {
				if (--userCount <= 0)
				{
					tempUsers.map(function(el) {
						delete el.cpassword;
					});
					done();
				}
				else
				{
					cb(cb);
				}
			};
			var reg = function(cb) {
				var user = new User.Model(validUser());
				user.cpassword = "password";
				tempUsers.push(user);
				User.register(user, function(err, result) {
					if (err)
					{
						done(err);
					}
					else
					{
						countDown(cb);
					}
				});
			};
			reg(reg);
		});
		it("should return an array", function(done) {
			var criteria = {
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				done();
			});
		});
		it("should return all users when criteria is an empty object", function(done) {
			var criteria = {
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(tempUsers.length);
				done();
			});
		});
		it("should return one user when searching by fbid", function(done) {
			var criteria = {
				fbid: tempUsers[0].fbid
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].fbid.should.equal(criteria.fbid);
				done();
			});
		});
		it("should return results containing all UserModel fields", function(done) {
			var criteria = {
				email: tempUsers[0].email
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].email.should.equal(criteria.email);
				result[0].should.be.an.instanceOf(User.Model);
				done();
			});
		});
		it("should return zero users when searching for a non-existent field", function(done) {
			var criteria = {
				doesnotexist: "DOESNOTEXIST"
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(0);
				done();
			});
		});
		it("should return zero users when searching for a non-matching firstName", function(done) {
			var criteria = {
				firstName: "DOESNOTEXIST"
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(0);
				done();
			});
		});
		it("should return a single match when passed an existing UserModel object", function(done) {
			tempUsers[0].should.be.an.instanceOf(User.Model);
			var criteria = new User.Model(tempUsers[0]);
			criteria.should.be.an.instanceOf(User.Model);
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].should.be.an.instanceOf(User.Model);
				done();
			});
		});
	});
});