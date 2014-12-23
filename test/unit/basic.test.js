var should = require('should');

describe("Basic Unit Test with Mocha", function() {
  it("should pass", function() {
    var value = true;
    value.should.be.ok;
  });
});
