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
			(typeof user).should.equal("object");
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
				user[field].should.equal("Value");
			});
		};
		for (var i=0; i<User.allFields.length; i++)
		{
			fieldTest(User.allFields[i]);
		}
	});
	describe("Register", function() {
		before(function(done) {
			emptyDb(done);
		});
		afterEach(function(done) {
			emptyDb(done);
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
			reqTest("cpassword");
			
			it("should return an error if the passwords do not match", function(done) {
				var invalidUser = validUser();
				invalidUser.cpassword = invalidUser.password+"mismatch";
				User.register(invalidUser, function(err, result) {
					err.should.equal("Registration Error: passwords do not match");
					done();
				});
			});
		});
		describe("Valid User", function() {
			it("should return no error if successfully registered", function(done) {
				var user = validUser();
				user.cpassword = user.password;
				User.register(user, function(err, result) {
					should.not.exist(err);
					result.statusCode.should.equal(200);
					done();
				});
			});
		});
	});
	describe("Find", function() {
		
	});
});