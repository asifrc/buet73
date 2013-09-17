//Bismillah

/*
 * USER MODEL
 * ----------
 * Contains User schema for Mongoose,
 * CRUD interface to mongoDB,
 * and router interface to Express
 *
 * Instantiated with a constructor,
 *  - takes mongoose as parameter
*/


//Export Constructor
module.exports = function(mongoose) {

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
	
	//Convert POSTed data into user object, returns 
	
	//Register User (Save to Database)
	this.register = function(postData, cb) {
		//JSON response object
		var resp = new Resp();
		
		//Check for required fields
		var userObj = postData
		
		
		//Check for matching passwords
		
		//Create user object from model
		user = new User(userObj);
		
		//Save to database
		
		//Return User Object
		return resp;
	};
	
	
	
	return this;
};