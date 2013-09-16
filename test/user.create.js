//Bismillah

/*
 * Tests the schema
*/

var assert = require("assert")
	, mongoose = require('mongoose');

//Connect to MongoDB
var mongoUrl = "mongodb://localhost/buet73";
mongoose.connect(mongoUrl);
var user = require("../routes/user")(mongoose);

describe("User Module Mongoose", function() {
	
	it("should connect to mongo", function(done) {
		user.connect(done);
	});
	
	describe("User Schema & Model", function() {
		
		it("should create a User object from the User model", function() {
			var bob = {
				fbid: "1234",
				firstName: "Bob",
				lastName: "Johnson"
			};
			var bobby = new user.model(bob);
			assert.equal(bob.firstName, bobby.firstName);
		});
		
	});
});