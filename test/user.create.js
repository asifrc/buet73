//Bismillah

/*
 * Tests the schema
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


describe("User Module", function() {
	
	describe("MongoDB Connection", function() {
		it("should connect to mongo", function(done) {
			db.once('open', done);
		});
	});
	
	describe("User Model", function() {
		var bob, bobby;
		
		beforeEach(function() {
			bob = {
				fbid: "1234",
				firstName: "Robert",
				lastName: "Johnson",
				displayName: "Bobby Johnson",
				department: "Electrical Engineering",
				email: "rjohnson@asifchoudhury.com",
				password: "unhashedpassword",
				cpassword: "unhashedpassword",
				phone: "1 123 1234",
				address: "2828 82nd St",
				city: "Rapid City",
				stateProv: "South Dakota",
				zip: "57702",
				country: "United States",
			};
		});
		
		it("should create a User object", function() {
			delete bob.cpassword;
			bobby = new user.model(bob);
			bob.firstName.should.equal(bobby.firstName);
			
		});
		describe("Registration", function() {
			var reqFields = [
				'firstName',
				'lastName',
				'displayName',
				'department',
				'email',
				'password',
				'country'
			];
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
			
			it("should return successful when there are no errors", function(done) {
				user.register(bob, function(resp) {
					assert.equal(resp.error, null);
					done();
				});
			});
			
		});
	});
});