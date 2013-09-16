//Bismillah 

var assert = require("assert");
var user = require("../routes/user");

describe("User", function() {
	it("should a property of x with the value of 10", function() {
		assert.equal(10, user.x );
	});
});