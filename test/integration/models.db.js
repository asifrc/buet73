// Bismillah

/**
* Tests for models/db.js
*/

var db = require('../../models/db');

var should = require("should"),
	assert = require("assert");

describe("DB & Model Utility Functions", function() {
	describe("Neo4j", function() {
		it("should successfully connect to the Server", function(done) {
			var cypher = "MATCH (n) RETURN n";
			var query = { query: cypher };
			db.neo(query, done, function(err, result) {
				should.not.exist(err);
				done();
			});
		});
		it("should return an error if the Server returns an error code", function(done) {
			var old_url = db.neo4j_url();
			db.neo4j_url(old_url+"/badaddress");
			var cypher = "MATCH (n) RETURN n";
			var query = { query: cypher };
			db.neo(query, function(err, result) {
				err.should.exist;
				db.neo4j_url(old_url);
				done();
			},done);
		});
	});
	describe("Respond", function() {
		it("should return an object if no callback is passed", function() {
			var resp = db.respond();
			(typeof resp.err).should.equal("object");
		});
		it("should call the callback passing the error and result", function(done) {
			var error = "Error";
			var result = "Result";
			var cb = function(err, res) {
				err.should.equal(error);
				res.should.equal(result);
				done();
			};
			db.respond(cb, error, result);
		});
	});
});
