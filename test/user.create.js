//Bismillah

/*
 * Tests the schema
*/

var assert = require("assert")
	, mongoose = require('mongoose');

//Connect to MongoDB
var mongoUrl = "mongodb://localhost/buet73";
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
				phone: "1 123 1234",
				address: "2828 82nd St",
				city: "Rapid City",
				stateProv: "South Dakota",
				zip: "57702",
				country: "United States",
			};
		});
		
		it("should create a User object", function() {
			bobby = new user.model(bob);
			assert.equal(bob.firstName, bobby.firstName);
			
		});
		describe("Registration", function() {
			
			it("should return with no error on successful registration", function() {
				assert.equal(user.register(bob).error, null);
			});
			
		});
			
		
	});
});