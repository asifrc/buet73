//Bismillah

/*
 * Tests the schema
*/

var assert = require("assert")
	, mongoose = require('mongoose');

//Connect to MongoDB
var mongoUrl = "mongodb://localhost/buet73";
mongoose.connect(mongoUrl);
var user = require("../routes/user")(mongoose.connection);

describe("User Module Mongoose", function() {
	it("should connect to mongo", function(done) {
		user.connect(done);
	});
});