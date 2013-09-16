//Bismillah 

var assert = require("assert");

describe("Bismillah", function() {
	for (var i=0; i<5; i++)
	{
		it("should pass "+i, function() {
			assert.equal(true, true );
		});
	}
	it("should fail ", function() {
		assert.equal(true, false );
	});
});