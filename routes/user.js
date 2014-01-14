//Bismillah

/**
* USER MODULE
* ----------
* Contains User schema for Mongoose,
* CRUD interface to mongoDB,
* and router interface to Express
*
* Instantiated with a constructor,
*  - takes mongoose as parameter
*/

var crypto = require('crypto');

//Export Constructor
module.exports = function(mongoose) {

	/**
	* User Schema and Model
	*/
	
	//User Schema
	var schema = new mongoose.Schema({
		fbid: String,
		firstName: String,
		lastName: String,
		displayName: String,
		department: String,
		email: String,
		password: String,
		phone: String,
		address: String,
		city: String,
		stateProv: String,
		zip: String,
		country: String,
		profilePic: String,
		TS: Date
	});
	
	//User Model
	var User = mongoose.model('User', schema);
	
	//Export Model
	this.model = User;
	
	//JSON response object
	var Resp = function(obj) {
		this.error = null;
		this.data = (typeof obj === "object") ? obj : null;
	};
	
	var respond = function(ret, cb) {
		if (typeof cb === "function")
		{
			cb(ret);
		}
		return ret;
	};
		
	

	
	/**
	* Register User (Save to Database)
	*/
	this.register = function(postData, cb) {
		//JSON response object
		var resp = new Resp();
		
		//Check for required fields
		
		var reqFields = [
			'firstName',
			'lastName',
			'displayName',
			'department',
			'email',
			'password',
			'country'
		];
		var optFields = [
			'fbid',
			'phone',
			'address',
			'city',
			'stateProv',
			'zip'
		];
		
		var userObj = {};
		//Add all required fields to userObj, return error if missing
		for (var i=0; i<reqFields.length; i++)
		{
			var field = reqFields[i];
			if (typeof postData[field] === "undefined")
			{
				resp.error = "Bad request: "+field+" field is missing";
				return respond(resp, cb);
			}
			userObj[field] = postData[field];
		}
		//Add all optional fields if they exist
		for (var i=0; i<reqFields.length; i++)
		{
			var field = optFields[i];
			if (typeof postData[field] !== "undefined")
			{
				userObj[field] = postData[field];
			}
		}
		
		//Check for matching passwords and encrypt on success
		if (typeof postData.cpassword !== "undefined")
		{
			if (userObj.password==postData.cpassword)
			{
				if (userObj.password.length>0)
				{
					//On successful match, encrypt password
					var pwhash = crypto.createHash('md5');
					pwhash.update(userObj.password);
					userObj.password = pwhash.digest('hex');
				}
				else
				{
					resp.error = "Password cannot be blank";
					return respond(resp, cb);
				}
			}
			else
			{
				resp.error = "Passwords do not match";
				return respond(resp, cb);
			}
		}
		else
		{
			resp.error = "Password must be confirmed";
			return respond(resp, cb);
		}
		
		//Create user object from model
		var user = new User(userObj);
		
		//Save to database
		user.save(function(err) {
			resp.error = err;
			//Return User Object
			resp = new Resp({ "users": [ user ] });
			return respond(resp, cb);
		});
	};
	
	/**
	* Retrieve Users by Criteria
	*/
	var findUser = function(criteria, cb) {
		var resp = new Resp({ users: [] });
		
		if (typeof criteria.password === "string")
		{
			var pwhash = crypto.createHash('md5');
			pwhash.update(criteria.password);
			criteria.password = pwhash.digest('hex');
		}
		
		User.find(criteria, function(err, data) {
			resp = new Resp({ users: data });
			resp.error = err;
			return respond(resp,cb);
		});
	};
	this.find = findUser;
	
	/**
	* Find a Single User
	*/
	var findOne = function(criteria, cb, handler) {
		var resp = new Resp();
		if (typeof criteria.id !== "string")
		{
			resp.error = "Invalid format - userID is invalid";
			return handler(resp);
		}
		findUser({_id: criteria.id}, function(response) {
			if (response.error)
			{
				return handler(response);
			}
			if (response.data.users.length != 1)
			{
				resp.error = "The user id return an invalid number of users("+response.data.users.length+")";
				return handler(resp);
			}
			handler(response);
		});
	};
	
	/**
	* Update User by ID
	*/
	this.update = function(criteria, cb) {
		var resp = new Resp();
		findOne(criteria, cb, function(response) {
			if (response.error)
			{
				return respond(response, cb);
			}
			user = response.data.users[0];
			for (var field in criteria)
			{
				user[field] = criteria[field];
			}
			user.save(function(err, usr) {
				resp = new Resp({users: [usr] });
				resp.error = err;
				return respond(resp, cb);
			});
		});
	};
	
	/**
	* Remove User by ID
	*/
	//this.remove = 
	
	return this;
};