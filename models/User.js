//Bismillah

/**
* User Model
*/

var crypto = require('crypto');
var rest = require('restler');
var db_url = process.env.NEO4J_URL || 'http://localhost:7474';
db_url += "/db/data/cypher";
exports.db_url = function(url) {
	db_url = url || db_url;
	return db_url;
};

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
	'city',
	'stateProv'
];};
exports.optFields = optFields();
var allFields = reqFields().concat(optFields());
exports.allFields = allFields;

/**
* Class: User object
*/
function UserModel (obj) {
	var self = this;
	obj = (typeof obj === "object") ? obj : {};
	for (var i=0; i<allFields.length; i++)
	{
		var field = allFields[i];
		self[field] = (typeof obj[field] === "undefined") ? null : obj[field];
	}
	//Hash password
	var hash = function(pw) {
		var pwhash = crypto.createHash('md5');
		pwhash.update(pw);
		return pwhash.digest('hex');
	};
	this.hash = hash;
	this.confirmPassword = function(pw) {
		return ( this.password === hash(pw) );
	};
	//Hash passed parameter if present and obj is not an instance of UserModel
	if (typeof obj.password === "string" && obj.password.length > 0 && obj.constructor !== UserModel)
	{
		this.password = hash(obj.password);
	}
}
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
var register = function(userData, cb) {
	var err = null;
	
	var user = new UserModel(userData);
	
	var fields = reqFields();
	for (var i=0; i<fields.length; i++)
	{
		var field = fields[i];
		if (user[field] === null)
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
	if (typeof userData.cpassword === "undefined")
	{
		err = "Registration Error: cpassword field is missing";
		return respond(cb, err);
	}
	if (!user.confirmPassword(userData.cpassword))
	{
		err = "Registration Error: passwords do not match";
		return respond(cb, err);
	}
	
	//Delete null fields so Cypher Query functions properly
	fields = optFields();
	for (var j=0; j<fields.length; j++)
	{
		var prop = fields[j];
		if (user[prop] === null)
		{
			delete user[prop];
		}
	}
	
	// Send Create request to NEO4J
	var cypher = "CREATE (u:User { props } ) ";
	cypher += "MERGE (d:Department { name: \""+user.department+"\" }) ";
	cypher += "MERGE (c:Country { name: \""+user.country+"\" }) ";
	cypher += "CREATE UNIQUE (u)-[:Studied]->(d) ";
	cypher += "CREATE UNIQUE (u)-[:LivesIn]->(c) ";
	cypher += "RETURN u";
	//console.log("\n\nQUERY:\n\n", cypher);//DEBUG
	var query = {
		"query": cypher,
		"params": {
			"props": user
		}
	};
	//console.log("\n\nQUERY:\n\n", query);//DEBUG
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
var parseUsers = function(result,res) {
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
		if (criteria[property] !== null && typeof criteria[property] !== "function")
		{
			props.push("u."+property+"=\""+criteria[property]+"\" ");
		}
	}
	cypher += (props.length>0) ? "WHERE "+props.join("AND ") : "";
	cypher += "RETURN u";
	//console.log("\n\nQUERY:\n\n", cypher);//DEBUG
	var query = {
		"query": cypher
	};
	rest.postJson(db_url, query).on('complete', function(result, response) {
		var users = parseUsers(result,response);
		return respond(cb, err, users);
	});
};
exports.find = find;