//Bismillah

/**
* User Model
*/

var crypto = require('crypto');
var rest = require('restler');
var db_url = process.env.NEO4J_URL || 'http://localhost:7474';
db_url += "/db/data/cypher";

var reqFields = function() { return [
	'firstName',
	'lastName',
	'displayName',
	'department',
	'email',
	'password',
	'country'
];};
exports.reqFields = reqFields();
var optFields = function() { return [
	'fbid',
	'phone',
	'address',
	'city',
	'stateProv',
	'zip'
];};
exports.optFields = optFields();
var allFields = reqFields().concat(optFields());
exports.allFields = allFields;

/**
* Class: User object
*/
var UserModel = function(obj) {
	var self = this;
	obj = (typeof obj === "object") ? obj : {};
	for (var i=0; i<allFields.length; i++)
	{
		var field = allFields[i];
		self[field] = (typeof obj[field] === "undefined") ? null : obj[field];
	}
};
exports.Model = UserModel;


var respond = function (callback, err, result) {
	err = err || null;
	if (typeof callback === "function")
	{
		callback(err, result);
	}
	return { err: err, result: result };
};

/**
* Create a User
*/
var register = function(user, cb) {
	var err = null;
	
	var fields = reqFields();
	fields.push('cpassword');
	for (var i=0; i<fields.length; i++)
	{
		var field = fields[i];
		if (typeof user[field] === "undefined")
		{
			err = "Registration Error: "+field+" field is missing";
			return respond(cb, err);
		}
		if (user[field] === "")
		{
			err = "Registration Error: "+field+" field cannot be blank";
			return respond(cb, err);
		}
	}
	if (user.password !== user.cpassword)
	{
		err = "Registration Error: passwords do not match";
		return respond(cb, err);
	}
	//Hash password
	delete user.cpassword;
	var pwhash = crypto.createHash('md5');
	pwhash.update(user.password);
	user.password = pwhash.digest('hex');
	// Send Create request to NEO4J
	var cypher = "CREATE (u:User { props } ) ";
	cypher += "MERGE (d:Department { name: \""+user.department+"\" }) ";
	cypher += "MERGE (c:Country { name: \""+user.country+"\" }) ";
	cypher += "CREATE UNIQUE (u)-[:Studied]->(d) ";
	cypher += "CREATE UNIQUE (u)-[:LivesIn]->(c) ";
	cypher += "RETURN u";
	var query = {
		"query": cypher,
		"params": {
			"props": user
		}
	};
	rest.postJson(db_url, query).on('complete', function(result, response) {
		if (response.statusCode !== 200)
		{
			err = "Registration Error: receive "+response.statusCode+" response";
			return respond(cb, err);
		}
		return respond(cb, err, response);
	});
};
exports.register = register;

/**
* Retrieve a User
*/
var parseUsers = function(result) {
	var users = [];
	for (var i=0; i<result.data.length; i++)
	{
		var user = new UserModel(result.data[i][0].data);
		users.push(user);
	}
	return users;
};
var find = function(criteria, cb) {
	var err = null;
	
	var cypher = "MATCH (u:User) ";
	var props = [];
	
	for (var property in criteria)
	{
		props.push("u."+property+"=\""+criteria[property]+"\" ");
	}
	cypher += (props.length>0) ? "WHERE "+props.join("AND") : "";
	cypher += "RETURN u";
	//console.log("\n\nQUERY:\n\n", cypher);//DEBUG
	var query = {
		"query": cypher
	};
	rest.postJson(db_url, query).on('complete', function(result, response) {
		var users = parseUsers(result);
		return respond(cb, err, users);
	});
};
exports.find = find;