//Bismillah

/**
* Tests for models/User.js
*/

var User = require('../models/User');

var should = require("should")
	, assert = require("assert");
	
var validUser = function() {
	return {
		fbid: "1234",
		firstName: "Bob",
		lastName: "Anderson",
		displayName: "Bobby Anderson",
		department: "Electrical Engineering",
		email: "banderson@asifchoudhury.com",
		password: "unhashedpassword",
		phone: "1 123 1234",
		address: "2828 82nd St",
		city: "Rapid City",
		stateProv: "South Dakota",
		zip: "57702",
		country: "United States",
	};
};

describe("User Model", function() {
	describe("UserModel", function() {
		it("should create a new User object", function() {
			var user = new User.Model();
			(typeof user).should.equal("object");
		});
		for (var i=0; i<User.allFields.length; i++)
		{
			var field = User.allFields[i];
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
		}
	});
	describe("Register", function() {
		describe("Validation", function() {
			for (var i=0; i<User.reqFields.length; i++)
			{
				var field = User.reqFields[i];
				it("should return an error when `"+field+"` is missing", function(done) {
					var invalidUser = validUser();
					delete invalidUser[field];
					User.register(invalidUser, function(err, result) {
						err.should.equal("Registration Error: "+field+" field is missing");
						done();
					});
				});
			}
		});
	});
});