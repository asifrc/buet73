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
exports.register = function(user, cb) {
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
	var query = {
		"query": "CREATE (n:User { props } ) RETURN n",
		"params": {
			"props": user
		}
	};
	rest.postJson(db_url, query).on('complete', function(data, response) {
		return respond(cb, err, response);
	});
};