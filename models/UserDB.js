//Bismillah

/**
* User Model
*/

var crypto = require('crypto');
var rest = require('restler');
var DB_URL = process.env.NEO4J_URL || 'http://localhost:7474';
DB_URL += "/db/data/cypher";
var db_url = function(url) {
	DB_URL = url || DB_URL;
	return DB_URL;
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
//exports.respond = respond;

/**
* Make a Cypher Query to Neo4j
*/
var neo = function(query, superCb, cb) {
	var err = null;
	rest.postJson(DB_URL, query).on('complete', function(result, response) {
		if (response.statusCode !== 200)
		{
			err = "Registration Error: received "+response.statusCode+" response";
			return respond(superCb, err);
		}
		return respond(cb, err, result);
	});
};

/**
* Create a User
*/
var register = function(userData, cb) {
	var err = null;
	
	var user = new User(userData);
	
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
	var emailFormat = /.+@.+\..+/i;
	if (!emailFormat.test(user.email))
	{
		err = "Registration Error: invalid email format";
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
	
	// Check for unique email address
	var cypher = "match (n:User) where n.email=\""+user.email+"\" return count(n)";
	neo({query: cypher}, cb, function(err, res) {
		if (res.data[0][0] !== 0)
		{
			err = "Registration Error: email already in use";
			return respond(cb, err);
		}
		// Send Create request to NEO4J
		var cypher = "CREATE (u:User { props } ) ";
		cypher += "MERGE (d:Department { name: \""+user.department+"\" }) ";
		cypher += "MERGE (c:Country { name: \""+user.country+"\" }) ";
		cypher += "CREATE UNIQUE (u)-[:Studied]->(d) ";
		cypher += "CREATE UNIQUE (u)-[:LivesIn]->(c) ";
		cypher += "RETURN u, id(u)";
		//console.log("\n\nQUERY:\n\n", cypher);//DEBUG
		var query = {
			"query": cypher,
			"params": {
				"props": user
			}
		};
		//console.log("\n\nQUERY:\n\n", query);//DEBUG
		neo(query, cb, function(err, result) {
			var users = parseUsers(result);
			return respond(cb, err, users);
		});
	});
};
//exports.register = register;

/**
* Retrieve a User
*/
var parseUsers = function(result) {
	var users = [];
	for (var i=0; i<result.data.length; i++)
	{
		var user = new User(result.data[i][0].data, true);
		user.id(result.data[i][1]);
		users.push(user);
	}
	return users;
};
var find = function(criteria, cb) {
	var err = null;
	
	var cypher = "MATCH (u:User) ";
	var props = [];
	
	// Convert queries if ID is included
	if (typeof criteria.id !== "undefined")
	{
		var id = (typeof criteria.id === "function") ? criteria.id() : criteria.id;
		if (id !== null)
		{
			props.push("id(u)="+id+" ");
		}
		delete criteria.id;
	}
	
	for (var property in criteria)
	{
		if (criteria[property] !== null && typeof criteria[property] !== "function")
		{
			props.push("u."+property+"=\""+criteria[property]+"\" ");
		}
	}
	cypher += (props.length>0) ? "WHERE "+props.join("AND ") : "";
	cypher += "RETURN u, id(u)";
	//console.log("\n\nQUERY:\n\n", cypher);//DEBUG
	var query = {
		"query": cypher
	};
	neo(query, cb, function(err, result) {
		var users = parseUsers(result);
		return respond(cb, err, users);
	});
};
//exports.find = find;

/**
* Update a User
*/
var update = function(user, cb) {
	var err = null;
	
	if (user.constructor !== User)
	{
		err = "Update Error: not an instance of User";
		return respond(cb, err);
	}
	if (user.id() === null)
	{
		err = "Update Error: User must have an id";
		return respond(cb, err);
	}
	
	// Identify fields that have changed
	var changed = [];
	for (var field in user)
	{
		if (typeof user.initObj()[field] !== "undefined")
		{
			if (user.initObj()[field] !== user[field])
			{
				changed.push(field);
			}
		}
		else
		{
			if (user[field] !== null && field !== "password")
			{
				changed.push(field);
			}
		}
	}
	
	// Construct Cypher query
	var cypher = "MATCH (u:User) WHERE id(u)="+user.id();
	cypher += " SET u = {props}";
	cypher += " RETURN u, id(u)";
	//console.log("\n\nQUERY:\n\n", cypher);//DEBUG
	var query = {
		"query": cypher,
		"params": {
			"props": user
		}
	};
	//console.log("\n\nQUERY:\n\n", query);//DEBUG
	neo(query, cb, function(err, result) {
		var users = parseUsers(result);
		if (users.length === 0)
		{
			err = "Update Error: User id not found";
		}
		return respond(cb, err, users);
	}, true);
};
//exports.update = update;

/**
* Delete a User
*/
var remove = function(user, cb) {
	var err = null;
	
	if (user.constructor !== User)
	{
		err = "Removal Error: invalid user format";
		return respond(cb, err);
	}
	if (user.id() === null)
	{
		err = "Removal Error: invalid user id";
		return respond(cb, err);
	}
	var cypher = "MATCH (u)-[r]-()";
	cypher += " WHERE id(u)="+user.id();
	cypher += " DELETE u,r";
	var query = {"query": cypher};
	neo(query, cb, function(error, result) {
		return respond(cb, error, []);
	});
};
//exports.remove = remove;

// Variable Declarations
var User,
	reqFields,
	optFields,
	allFields;

var UserDB = function(Model) {
	User = Model;
	var user = new User();
	reqFields = user.reqFields;
	optFields = user.optFields;
	allFields = user.allFields;
	this.Model = Model;
	this.allFields = allFields;
	this.reqFields = reqFields;
	this.optFields = optFields;
	this.db_url = db_url;
	this.respond = respond;
	this.register = register;
	this.find = find;
	this.update = update;
	this.remove = remove;
	return this;
};
module.exports = UserDB;