// Bismillah

/**
* Database & General Model Utility Functions
*/

var rest = require('restler');

var neo4j_url = process.env.NEO4J_URL || 'http://localhost:7474';
neo4j_url += "/db/data/cypher";
exports.neo4j_url = function(url) {
	neo4j_url = url || neo4j_url;
	return neo4j_url;
};

/**
* Uniform method to call callbacks for exported functions
*/
var respond = function (callback, err, result) {
	err = err || null;
	if (typeof callback === "function")
	{
		callback(err, result);
	}
	return { err: err, result: result };
};
exports.respond = respond;

/**
* Make a Cypher Query to Neo4j
*/
var neo = function(query, superCb, cb) {
	var err = null;
	rest.postJson(neo4j_url, query).on('complete', function(result, response) {
		if (response.statusCode !== 200)
		{
			err = "Database Error: received "+response.statusCode+" response";
			return respond(superCb, err);
		}
		return respond(cb, err, result);
	});
};
exports.neo = neo;