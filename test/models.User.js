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
		email: vals.firstName[0]+vals.lastName[0]+"@asifchoudhury.com",
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
	describe("Initialization", function() {
		it("should create a new User object", function() {
			var user = new User();
			user.should.be.an.instanceOf(User);
		});
		it("should create a new User object from another User object", function() {
			var obj = validUser();
			var userA = new User(obj);
			userA.should.be.an.instanceOf(User);
			var userB = new User(userA);
			userB.should.be.an.instanceOf(User);
			for (var field in userA) 
			{
				if (userA[field] !== null && typeof userB[field] !== "function")
				{
					userA[field].should.equal(userB[field]);
				}
			}
		});
		it("should accept and return a valid user object as a parameter", function() {
			var obj = validUser();
			var user = new User(obj);
			user.should.be.an.instanceOf(User);
		});
	});
	describe("id", function() {
		it("should return a null value for _id when no _id has been set", function() {
			var user = new User();
			should(user.id()).equal(null);
		});
		it("should return the new value for _id set by the setter", function() {
			var user = new User();
			var id = "1234";
			user.id(id).should.equal(id);
			user.id().should.equal(id);
		});
	});
	var fieldTest = function(field) {
		it("should contain a `"+field+"` property", function() {
			var user = new User();
			(typeof user[field]).should.equal("object");
		});
		it("should set a value for `"+field+"` when present in parameter", function() {
			var obj = {};
			obj[field] = "value";
			var user = new User(obj);
			if (field !== "password")
			{
				user[field].should.equal("value");
			}
			else
			{
				user.confirmPassword("value").should.be.ok;
			}
		});
	};
	describe("Required Fields", function() {
		for (var i=0; i<User.allFields.length; i++)
		{
			fieldTest(User.allFields[i]);
		}
	});
	describe("Register", function() {
		it.skip("should register the user", function(done) {
			var user = new User(validUser());
		});
		it.skip("should return an error if the user is already registered", function(done) {
		
		});
	});
	describe("Update", function() {
	
	});
	describe("Save", function() {
	
	});
	describe("Remove", function() {
	
	});
});