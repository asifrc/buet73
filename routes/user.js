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

	//Mongoose Connection to MongoDB
	var db = mongoose.connection;
	
	//Connect to MongoDB
	this.connect = function(cb) {
			db.once('open', cb);
	};
	
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
	
	return this;
};