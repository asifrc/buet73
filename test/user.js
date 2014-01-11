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
		firstName: "Bob",
		lastName: "Anderson",
		displayName: "Bobby Anderson",
		department: "Electrical Engineering",
		email: "banderson@asifchoudhury.com",
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
		
		describe("Find", function() {
			var james = newBob();
			james.firstName = "James";
			
			before(emptyDoc);
			
			beforeEach(function(done) {
				user.register(bob, function(resp) {
					user.register(james);
					done();
				});
			});
			
			afterEach(emptyDoc);
			
			describe("No Criteria", function() {
			
				it("should not throw any errors when no parameters are passed", function() {
					(user.find(bob) || true).should.be.ok;
				});
				
				it("should return all users when empty object is passed", function(done) {
					user.find({}, function(resp) {
						(resp.error == null).should.be.ok;
						resp.data.users.length.should.equal(2);
						done();
					});
				});
			});
			
			describe("Single Criterion", function() {
				
				it("should return one user when sent one criterion matching one record", function(done) {
					user.find({ firstName: bob.firstName}, function(resp) {
						(resp.error == null).should.be.ok;
						resp.data.users.length.should.equal(1);
						resp.data.users[0].firstName.should.equal(bob.firstName);
						done();
					});
				});
				
				it("should two multiple users with one criterion matching two records", function(done) {
					user.find({ country: bob.country}, function(resp) {
						(resp.error == null).should.be.ok;
						resp.data.users.length.should.equal(2);
						resp.data.users[0].firstName.should.equal(bob.firstName);
						resp.data.users[1].firstName.should.equal(james.firstName);
						done();
					});
				});
			});
			
			describe("Multiple Criteria", function() {
			
				it("should return one user when sent criteria matching one record", function(done) {
					user.find({ firstName: bob.firstName, lastName: bob.lastName}, function(resp) {
						(resp.error == null).should.be.ok;
						resp.data.users.length.should.equal(1);
						resp.data.users[0].firstName.should.equal(bob.firstName);
						resp.data.users[0].lastName.should.equal(bob.lastName);
						done();
					});
				});
				
				it("should return two users with criteria matching two records", function(done) {
					user.find({ country: bob.country, zip: james.zip}, function(resp) {
						(resp.error == null).should.be.ok;
						resp.data.users.length.should.equal(2);
						resp.data.users[0].firstName.should.equal(bob.firstName);
						resp.data.users[1].firstName.should.equal(james.firstName);
						done();
					});
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