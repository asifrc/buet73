//Bismillah

/*
 * USER MODEL
 * ----------
 * Contains User schema for Mongoose,
 * CRUD interface to mongoDB,
 * and router interface to Express
 *
 * Instantiated with a constructor,
 *  - takes mongoose connection as parameter
*/
module.exports = function(db) {
	this.dbb = db;
	this.connect = function(me) {
		return function(cb) {
			me.dbb.once('open', cb);
		}
	}(this);
	return this;
};