// Bismillah

/**
* Database & General Model Utility Functions
*/

var rest = require('restler');
var db_url = process.env.NEO4J_URL || 'http://localhost:7474';
db_url += "/db/data/cypher";

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
	rest.postJson(db_url, query).on('complete', function(result, response) {
		if (response.statusCode !== 200)
		{
			err = "Registration Error: received "+response.statusCode+" response";
			return respond(superCb, err);
		}
		return respond(cb, err, result);
	});
};
exports.neo = neo;