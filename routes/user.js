//Bismillah

/*
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

	/*
		User Schema and Model
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
		this.data = null;
		if (typeof obj === "object")
		{
			for (o in obj)
			{
				this[o] = obj.o;
			}
		}
	};
	
	var respond = function(ret, cb) {
		if (typeof cb === "function")
		{
			cb(ret);
		}
		return ret;
	};
		
	

	
	/* 
		Register User (Save to Database)
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
				return respond(resp);
			}
			userObj[field] = postData[field];
		}
		//Add all optional fields if they exist
		for (var i=0; i<reqFields.length; i++)
		{
			var field = reqFields[i];
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
					return respond(resp);
				}
			}
			else
			{
				resp.error = "Passwords do not match";
				return respond(resp);
			}
		}
		else
		{
			resp.error = "Password must be confirmed";
			return respond(resp);
		}
		
		//Create user object from model
		var user = new User(userObj);
		
		//Save to database
		user.save(function(err) {
			console.log("Saved!!"); //Dev
		});
		
		//Return User Object
		return respond(resp);
	};
	
	
	
	return this;
};