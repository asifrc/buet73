// Bismillah

/**
* Post Model
*/

var User = require('./User');

var PostModel = function(content, owner) {
	var self = this;
	var _id = null;
	self.content = null;
	self.owner = null;
	
	// Assign properties from parameters
	if (typeof content !== "undefined")
	{
		this.content = content;
	}
	if (typeof owner !== "undefined")
	{
		if (owner.constructor === User.Model)
		{
			self.owner = owner;
		}
		else if (typeof owner === "string" || typeof owner === "number")
		{
			self.owner = new User.Model();
			self.owner.id(owner.toString());
		}
	}
	
	// Getter for _id
	self.id = function(id) {
		_id = (typeof id !== "undefined") ? id : _id;
		return _id;
	};
};
exports.Model = PostModel;