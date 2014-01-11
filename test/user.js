//Bismillah

/**
* Tests the User schema
*/

var should = require("should")
	, assert = require("assert")
	, mongoose = require('mongoose');

//Connect to MongoDB
var mongoUrl = "mongodb://localhost/buet73tests";
mongoose.connect(mongoUrl);
var db = mongoose.connection;

//Require User Module, passing mongoose
var user = require("../routes/user")(mongoose);

var reqFields = [
	'firstName',
	'lastName',
	'displayName',
	'department',
	'email',
	'password',
	'country'
];
var optFields = [
	'fbid',
	'phone',
	'address',
	'city',
	'stateProv',
	'zip'
];
var allFields = reqFields.concat(optFields);



describe("MongoDB Connection", function() {
	it("should connect to mongo", function(done) {
		db.once('open', done);
	});
});

var newBob = function() {
	return {
		fbid: "1234",
		firstName: "Jan",
		lastName: "Itor",
		displayName: "Dr. Jan Itor",
		department: "Electrical Engineering",
		email: "drjanitor@asifchoudhury.com",
		password: "unhashedpassword",
		cpassword: "unhashedpassword",
		phone: "1 123 1234",
		address: "2828 82nd St",
		city: "Rapid City",
		stateProv: "South Dakota",
		zip: "57702",
		country: "United States",
	};
};

var emptyDoc = function() {
	user.model.find(function(err, users) {
		users.map(function(u) { u.remove(); });
	});
};

describe("User Module", function() {
	describe("User Model", function() {
		var bob, bobby;
		
		beforeEach(function() {
			emptyDoc();
			bob = newBob();
		});
		
		afterEach(emptyDoc);
		
		it("should create a User object", function() {
			delete bob.cpassword;
			bobby = new user.model(bob);
			bob.firstName.should.equal(bobby.firstName);
			
		});
		
		describe("Registration", function() {
			
			beforeEach(function() {
				bob = newBob();
			});
			
			it("should return the user when there are no errors", function(done) {
				user.register(bob, function(resp) {
					(resp.error == null).should.be.ok;
					(typeof resp.data.users.length).should.equal("number");
					resp.data.users.length.should.equal(1);
					resp.data.users[0].firstName.should.equal(bob.firstName);
					done();
				});
			});
			
			describe("Required Fields", function() {
				for (var i=0; i<reqFields.length; i++)
				{
					var field = reqFields[i];
					it("should save "+field, function(done) {
						bob[field] = "TestValue";
						user.register(bob, function(resp) {
							(resp.error == null).should.be.ok;
							var obj = {};
							obj[field] = "TestValue"
							user.model.count(obj, function(err, count) {
								count.should.equal(1);
								done();
							});
						});
					});
				}
			});
			
			describe("Missing Required Field", function() {
				for (var i=0; i<reqFields.length; i++)
				{
					var field = reqFields[i];
					it("should return an error when "+field+" is missing", function(done) {
						delete bob[field];
						user.register(bob, function(resp) {
							resp.error.should.equal("Bad request: "+field+" field is missing");
							done();
						});
					});
				}
			});
			
			/*
			describe("Empty String in Required Field", function() {
				for (var i=0; i<reqFields.length; i++)
				{
					var field = reqFields[i];
					it("should return an error when "+field+" is missing", function(done) {
						bob = newBob();
						bob[field] = "";
						user.register(bob, function(resp) {
							resp.error.should.equal("Bad request: "+field+" field is missing");
							done();
						});
					});
				}
			});
			*/
			
			describe("Optional Fields", function() {
				for (var i=0; i<optFields.length; i++)
				{
					var field = optFields[i];
					it("should save "+field, function(done) {
						bob[field] = "TestValue";
						user.register(bob, function(resp) {
							(resp.error == null).should.be.ok;
							var obj = {};
							obj[field] = "TestValue"
							user.model.count(obj, function(err, count) {
								count.should.equal(1);
								done();
							});
						});
					});
				}
			});
			
			describe("Missing Optional Field", function() {
				for (var i=0; i<reqFields.length; i++)
				{
					var field = reqFields[i];
					it("should still save successfully when "+field+" is missing", function(done) {
						delete bob[field];
						user.register(bob, function(resp) {
							resp.error.should.equal("Bad request: "+field+" field is missing");
							done();
						});
					});
				}
			});
			
			describe("Invalid Password", function() {
				it("should return an error when confirmation field is missing", function(done) {
					delete bob.cpassword;
					user.register(bob, function(resp) {
						resp.error.should.equal("Password must be confirmed");
						done();
					});
				});
				it("should return an error on mismatch", function(done) {
					bob.cpassword = "mismatch";
					user.register(bob, function(resp) {
						resp.error.should.equal("Passwords do not match");
						done();
					});
				});
				it("should return an error when blank", function(done) {
					bob.password = "";
					bob.cpassword = "";
					user.register(bob, function(resp) {
						resp.error.should.equal("Password cannot be blank");
						done();
					});
				});
			});
			
			describe("No Callback", function() {
				it("should not throw any errors", function() {
					(user.register(bob) || true).should.be.ok;
				});
			});
			
		});
		
		describe("Update", function() {
			
			afterEach(emptyDoc);
			
			for (var i=0; i<allFields.length; i++)
			{
				var field = allFields[i];
				it("should update "+field+" to 'TestValue'", function(done) {
					user.register(newBob(), function(resp) {
						(resp.error == null).should.be.ok;
						(typeof resp.data.users).should.equal("object");
						resp.data.users.length.should.equal(1);
						resp.data.users[0][field] = "TestValue";
						resp.data.users[0].save(function(err, uUser, nAffected) {
							(err == null).should.be.ok;
							nAffected.should.equal(1);
							var obj = {};
							obj[field] = "TestValue";
							user.model.count(obj, function(err, count) {
								count.should.equal(1);
								done();
							});
						});
					});
				});
			}
			
		});
		
	});
});