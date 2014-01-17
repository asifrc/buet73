//Bismillah

/**
* User Model
*/

var reqFields = function() { return [
	'firstName',
	'lastName',
	'displayName',
	'department',
	'email',
	'password',
	'country'
]};
exports.reqFields = reqFields();
var optFields = function() { return [
	'fbid',
	'phone',
	'address',
	'city',
	'stateProv',
	'zip'
]};
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
	err = (typeof err === "undefined") ? null : err;
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
	}
	return respond(cb, err);
};