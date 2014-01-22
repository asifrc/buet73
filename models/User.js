//Bismillah

/**
* User Model
*/

var crud = require('./UserDB');
var crypto = require('crypto');

/**
* Class: User object
*/
function User (obj, noHash) {
	var self = this;
	var _id =  null;
	
	obj = (typeof obj === "object") ? obj : {};
	for (var i=0; i<allFields.length; i++)
	{
		var field = allFields[i];
		self[field] = (typeof obj[field] === "undefined") ? null : obj[field];
	}
	
	// Getter for _id
	self.id = function(id) {
		_id = (typeof id !== "undefined") ? id : _id;
		return _id;
	};
	
	// Make email lowercase
	if (typeof self.email === "string")
	{
		self.email = self.email.toLowerCase();
	}
	
	//Hash password
	var hash = function(pw) {
		var pwhash = crypto.createHash('md5');
		pwhash.update(pw);
		return pwhash.digest('hex');
	};
	self.hash = hash;
	self.confirmPassword = function(pw) {
		return ( self.password === hash(pw) );
	};
	
	// Provides access to initialization object to monitor changes
	var initObj = obj;
	self.initObj = function() {
		return initObj;
	};
	
	if (obj.constructor === UserModel)
	{
		_id = obj.id();
	}
	else
	{
		if (typeof noHash === "undefined" && typeof obj.password === "string" && obj.password.length > 0)
		{
			//Hash passed parameter if present and obj is not an instance of UserModel
			self.password = hash(obj.password);
			initObj.password = self.password;
		}
	}
	
	// Field Access
	self.reqFields = reqFields();
	self.thoptFields = optFields();
	self.allFields = allFields();
	// CRUD Functions
	/*
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
	*/
}

var reqFields = function() { return [
	'firstName',
	'lastName',
	'displayName',
	'department',
	'email',
	'password',
	'country'
];};
User.reqFields = reqFields();
var optFields = function() { return [
	'fbid',
	'city',
	'stateProv'
];};
User.optFields = optFields();
var allFields = reqFields().concat(optFields());
User.allFields = allFields;

exports = User;