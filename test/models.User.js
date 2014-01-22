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
		describe("id", function() {
			it("should return a null value for _id when no _id has been set", function() {
				var user = new User.Model();
				should(user.id()).equal(null);
			});
			it("should return the new value for _id set by the setter", function() {
				var user = new User.Model();
				var id = "1234";
				user.id(id).should.equal(id);
				user.id().should.equal(id);
			});
		});
		var fieldTest = function(field) {
			it("should contain a `"+field+"` property", function() {
				var user = new User.Model();
				(typeof user[field]).should.equal("object");
			});
			it("should set a value for `"+field+"` when present in parameter", function() {
				var obj = {};
				obj[field] = "value";
				var user = new User.Model(obj);
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
				var user = new User.Model(validUser());
				user.cpassword = validUser().password;
				user.email = "notavalidformat1";
				User.register(user, function(err, result) {
					err.should.equal("Registration Error: invalid email format");
					user = new User.Model(validUser());
					user.cpassword = validUser().password;
					user.email = "notavalid@format2";
					User.register(user, function(err, result) {
						err.should.equal("Registration Error: invalid email format");
						user = new User.Model(validUser());
						user.cpassword = validUser().password;
						user.email = "@notavalidformat3";
						User.register(user, function(err, result) {
							err.should.equal("Registration Error: invalid email format");
							done();
						});
					});
				});
			});
			it("should return an error if the email address already exists", function(done) {
				var user = new User.Model(validUser());
				user.cpassword = validUser().password;
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
					done();
				});
			});
			it("should return an array containing one UserModel object", function(done) {
				var user = new User.Model(validUser());
				user.cpassword = validUser().password;
				User.register(user, function(err, result) {
					should.not.exist(err);
					result.should.exist;
					Array.isArray(result).should.be.ok;
					result.length.should.equal(1);
					result[0].should.be.an.instanceOf(User.Model);
					done();
				});
			});
			it("should return a UserModel object with _id populated", function(done) {
				var user = new User.Model(validUser());
				user.cpassword = validUser().password;
				User.register(user, function(err, result) {
					result.should.exist;
					Array.isArray(result).should.be.ok;
					result.length.should.equal(1);
					result[0].should.be.an.instanceOf(User.Model);
					result[0].id().should.exist;
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
				User.register(user, function(err, result) {
					if (err)
					{
						done(err);
					}
					else
					{
						tempUsers.push(result[0]);
						countDown(cb);
					}
				});
			};
			reg(reg);
		});
		after(function(done) {
			emptyDb(done);
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
		it("should return one user when searching by id", function(done) {
			var criteria = {
				id: tempUsers[0].id()
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].id().should.equal(tempUsers[0].id());
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
		it("should populate the _id property of a UserModel object", function(done) {
			var criteria = {
				email: tempUsers[0].email
			};
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].email.should.equal(criteria.email);
				result[0].should.be.an.instanceOf(User.Model);
				result[0].id().should.exist;
				done();
			});
		});
		it("should take an empty UserModel object as a search parameter", function(done) {
			var criteria = new User.Model();
			criteria.displayName = tempUsers[1].displayName;
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.be.greaterThan(0);
				result[0].id().should.exist;
				result[0].displayName.should.equal(tempUsers[1].displayName);
				done();
			});
		});
		it("should take a full UserModel object as a search parameter", function(done) {
			var criteria = new User.Model(tempUsers[1]);
			User.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].id().should.exist;
				result[0].id().should.equal(tempUsers[1].id());
				done();
			});
		});
	});
	describe("Update", function() {
		it("should return an error if not passed an instance of UserModel", function(done) {
			var user = {};
			user.displayName = "Updated Name";
			User.update(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return an error if User's _id is null", function(done) {
			var user = new User.Model();
			user.displayName = "Updated Name";
			User.update(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return an error if User's _id is not found", function(done) {
			var user = new User.Model();
			user.id("0");
			user.displayName = "Updated Name";
			User.update(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return the saved user if successfully updated", function(done) {
			var user = new User.Model(validUser());
			user.cpassword = validUser().password;
			User.register(user, function(error, result) {
				should.not.exist(error);
				result.should.exist;
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].should.be.an.instanceOf(User.Model);
				result[0].id().should.exist;
				
				var newUser = new User.Model(validUser());
				newUser.id( result[0].id() );
				newUser.displayName = "Updated User";
				newUser.displayName.should.not.equal(result[0].displayName);
				
				User.update(newUser, function(err, res) {
					should.not.exist(err);
					res.should.exist;
					Array.isArray(res).should.be.ok;
					res.length.should.equal(1);
					res[0].should.be.an.instanceOf(User.Model);
					res[0].id().should.exist;
					res[0].id().should.equal(newUser.id());
					
					for (var field in  newUser)
					{
						if (typeof newUser[field] !== "function" && newUser[field] !== null)
						{
							newUser[field].should.equal(res[0][field]);
						}
					}
					done();
				});
			});
		});
	});
	describe("Remove", function() {
		it("should return an error if parameter is not a UserModel object", function(done) {
			var user = {};
			User.remove(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return an error if the id is null", function(done) {
			var user = new User.Model();
			User.remove(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should remove an existing user", function(done) {
			var user = new User.Model(validUser());
			user.cpassword = validUser().password;
			User.register(user, function(error, result) {
				should.not.exist(error);
				result.should.exist;
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].should.be.an.instanceOf(User.Model);
				result[0].id().should.exist;
				User.remove(result[0], function(err, res) {
					should.not.exist(err);
					Array.isArray(res).should.be.ok;
					res.length.should.equal(1);
					User.find(result[0], function(e,r) {
						hould.not.exist(e);
						Array.isArray(r).should.be.ok;
						r.length.should.equal(0);
						done();
					});
				});
			});
		});
	});
});