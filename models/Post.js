// Bismillah

/**
* Post Model
*/

var User = require('./User');

var PostModel = function(content, owner) {
	var self = this;
	self.content = null;
	self.owner = null;
	
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
};
exports.Model = PostModel;