//Bismillah

/**
* Tests for models/UserDBDB.js
*/

var User = require('../models/User');
var UserDB = require('../models/UserDB');
var u = UserDB(User);
console.log("USER", u);

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

describe.skip("UserDB Model", function() {
	before(function(done) {
		emptyDb(done);
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
				var old_url = UserDB.db_url();
				UserDB.db_url(old_url+"/badaddress");
				var user = new UserDB.Model(validUser());
				user.cpassword = "password";
				UserDB.register(user, function(err, result) {
					err.should.exist;
					UserDB.db_url(old_url);
					done();
				});
			});
			it("should return an object when the callback passed is not a function", function() {
				var user = new UserDB.Model(validUser());
				user.cpassword = "password";
				var e = new Error();
				var block = function() {
					UserDB.register(user, {});
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
					UserDB.register(invalidUser, function(err, result) {
						err.should.equal("Registration Error: "+field+" field is missing");
						done();
					});
				});
				it("should return an error when `"+field+"` is blank", function(done) {
					var invalidUser = validUser();
					invalidUser.cpassword = invalidUser.password;
					invalidUser[field] = "";
					UserDB.register(invalidUser, function(err, result) {
						err.should.equal("Registration Error: "+field+" field cannot be blank");
						done();
					});
				});
			};
			for (var i=0; i<UserDB.reqFields.length; i++)
			{
				reqTest(UserDB.reqFields[i]);
			}
			
			it("should return an error if password confirmation missing", function(done) {
				var invalidUser = validUser();
				UserDB.register(invalidUser, function(err, result) {
					err.should.equal("Registration Error: cpassword field is missing");
					done();
				});
			});
			it("should return an error if the passwords do not match", function(done) {
				var invalidUser = validUser();
				invalidUser.cpassword = invalidUser.password+"mismatch";
				UserDB.register(invalidUser, function(err, result) {
					err.should.equal("Registration Error: passwords do not match");
					done();
				});
			});
			it("should return an error if the email is invalidly formatted", function(done) {
				var user = new UserDB.Model(validUser());
				user.cpassword = validUser().password;
				user.email = "notavalidformat1";
				UserDB.register(user, function(err, result) {
					err.should.equal("Registration Error: invalid email format");
					user = new UserDB.Model(validUser());
					user.cpassword = validUser().password;
					user.email = "notavalid@format2";
					UserDB.register(user, function(err, result) {
						err.should.equal("Registration Error: invalid email format");
						user = new UserDB.Model(validUser());
						user.cpassword = validUser().password;
						user.email = "@notavalidformat3";
						UserDB.register(user, function(err, result) {
							err.should.equal("Registration Error: invalid email format");
							done();
						});
					});
				});
			});
			it("should return an error if the email address already exists", function(done) {
				var user = new UserDB.Model(validUser());
				user.cpassword = validUser().password;
				UserDB.register(user, function(err, result) {
					should.not.exist(err);
					UserDB.register(user, function(err, result) {
						err.should.equal("Registration Error: email already in use");
						done();
					});
				});
			});
		});
		describe("Valid UserDB", function() {
			it("should return no error if successfully registered", function(done) {
				var user = new UserDB.Model(validUser());
				user.cpassword = validUser().password;
				UserDB.register(user, function(err, result) {
					should.not.exist(err);
					done();
				});
			});
			it("should return an array containing one UserDBModel object", function(done) {
				var user = new UserDB.Model(validUser());
				user.cpassword = validUser().password;
				UserDB.register(user, function(err, result) {
					should.not.exist(err);
					result.should.exist;
					Array.isArray(result).should.be.ok;
					result.length.should.equal(1);
					result[0].should.be.an.instanceOf(UserDB.Model);
					done();
				});
			});
			it("should return a UserDBModel object with _id populated", function(done) {
				var user = new UserDB.Model(validUser());
				user.cpassword = validUser().password;
				UserDB.register(user, function(err, result) {
					result.should.exist;
					Array.isArray(result).should.be.ok;
					result.length.should.equal(1);
					result[0].should.be.an.instanceOf(UserDB.Model);
					result[0].id().should.exist;
					done();
				});
			});
		});
	});
	describe("Find", function() {
		var tempUserDBs = [];
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
				var user = new UserDB.Model(validUser());
				user.cpassword = "password";
				UserDB.register(user, function(err, result) {
					if (err)
					{
						done(err);
					}
					else
					{
						tempUserDBs.push(result[0]);
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
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				done();
			});
		});
		it("should return all users when criteria is an empty object", function(done) {
			var criteria = {
			};
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(tempUserDBs.length);
				done();
			});
		});
		it("should return one user when searching by id", function(done) {
			var criteria = {
				id: tempUserDBs[0].id()
			};
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].id().should.equal(tempUserDBs[0].id());
				done();
			});
		});
		it("should return results containing all UserDBModel fields", function(done) {
			var criteria = {
				email: tempUserDBs[0].email
			};
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].email.should.equal(criteria.email);
				result[0].should.be.an.instanceOf(UserDB.Model);
				done();
			});
		});
		it("should return zero users when searching for a non-existent field", function(done) {
			var criteria = {
				doesnotexist: "DOESNOTEXIST"
			};
			UserDB.find(criteria, function(err, result) {
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
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(0);
				done();
			});
		});
		it("should return a single match when passed an existing UserDBModel object", function(done) {
			tempUserDBs[0].should.be.an.instanceOf(UserDB.Model);
			var criteria = new UserDB.Model(tempUserDBs[0]);
			criteria.should.be.an.instanceOf(UserDB.Model);
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].should.be.an.instanceOf(UserDB.Model);
				done();
			});
		});
		it("should populate the _id property of a UserDBModel object", function(done) {
			var criteria = {
				email: tempUserDBs[0].email
			};
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].email.should.equal(criteria.email);
				result[0].should.be.an.instanceOf(UserDB.Model);
				result[0].id().should.exist;
				done();
			});
		});
		it("should take an empty UserDBModel object as a search parameter", function(done) {
			var criteria = new UserDB.Model();
			criteria.displayName = tempUserDBs[1].displayName;
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.be.greaterThan(0);
				result[0].id().should.exist;
				result[0].displayName.should.equal(tempUserDBs[1].displayName);
				done();
			});
		});
		it("should take a full UserDBModel object as a search parameter", function(done) {
			var criteria = new UserDB.Model(tempUserDBs[1]);
			UserDB.find(criteria, function(err, result) {
				should.not.exist(err);
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].id().should.exist;
				result[0].id().should.equal(tempUserDBs[1].id());
				done();
			});
		});
	});
	describe("Update", function() {
		it("should return an error if not passed an instance of UserDBModel", function(done) {
			var user = {};
			user.displayName = "Updated Name";
			UserDB.update(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return an error if UserDB's _id is null", function(done) {
			var user = new UserDB.Model();
			user.displayName = "Updated Name";
			UserDB.update(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return an error if UserDB's _id is not found", function(done) {
			var user = new UserDB.Model();
			user.id("0");
			user.displayName = "Updated Name";
			UserDB.update(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return the saved user if successfully updated", function(done) {
			var user = new UserDB.Model(validUser());
			user.cpassword = validUser().password;
			UserDB.register(user, function(error, result) {
				should.not.exist(error);
				result.should.exist;
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].should.be.an.instanceOf(UserDB.Model);
				result[0].id().should.exist;
				
				var newUserDB = new UserDB.Model(validUser());
				newUserDB.id( result[0].id() );
				newUserDB.displayName = "Updated UserDB";
				newUserDB.displayName.should.not.equal(result[0].displayName);
				
				UserDB.update(newUserDB, function(err, res) {
					should.not.exist(err);
					res.should.exist;
					Array.isArray(res).should.be.ok;
					res.length.should.equal(1);
					res[0].should.be.an.instanceOf(UserDB.Model);
					res[0].id().should.exist;
					res[0].id().should.equal(newUserDB.id());
					
					for (var field in  newUserDB)
					{
						if (typeof newUserDB[field] !== "function" && newUserDB[field] !== null)
						{
							newUserDB[field].should.equal(res[0][field]);
						}
					}
					done();
				});
			});
		});
	});
	describe("Remove", function() {
		it("should return an error if parameter is not a UserDBModel object", function(done) {
			var user = {};
			UserDB.remove(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should return an error if the id is null", function(done) {
			var user = new UserDB.Model();
			UserDB.remove(user, function(err, result) {
				err.should.exist;
				done();
			});
		});
		it("should remove an existing user", function(done) {
			var user = new UserDB.Model(validUser());
			user.cpassword = validUser().password;
			UserDB.register(user, function(error, result) {
				should.not.exist(error);
				result.should.exist;
				Array.isArray(result).should.be.ok;
				result.length.should.equal(1);
				result[0].should.be.an.instanceOf(UserDB.Model);
				result[0].id().should.exist;
				UserDB.remove(result[0], function(err, res) {
					should.not.exist(err);
					Array.isArray(res).should.be.ok;
					res.length.should.equal(0);
					UserDB.find(result[0], function(e,r) {
						should.not.exist(e);
						Array.isArray(r).should.be.ok;
						r.length.should.equal(0);
						done();
					});
				});
			});
		});
	});
});