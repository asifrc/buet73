// Bismillah

/**
* Post Model
*/

var db = require('./db');
var respond = db.respond;

var User = require('./User');

/**
* Class: Post object
*/
var PostModel = function(content, owner) {
	var self = this;
	var _id = null;
	self.content = null;
	self.owner = null;
	self.access = "Private";
	
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

/**
* Parse a query response into a populated Post object
*/
var parsePosts = function(result) {
	var posts = [];
	for (var i=0; i<result.data.length; i++)
	{
		var post = new PostModel();
		post.id(result.data[i][1]);
		post.content = result.data[i][0].data.content;
		post.owner = new User.Model(result.data[i][2].data);
		post.access = result.data[i][0].data.access;
		posts.push(post);
	}
	return posts;
};

/**
* Create a Post
*/
var create = function(post, cb) {
	var err = null;
	
	// Validation
	if (post.constructor !== PostModel)
	{
		err = "Post Creation Error: not a post object";
		return respond(cb, err);
	}
	if (post.content === null)
	{
		err = "Post Creation Error: content missing";
		return respond(cb, err);
	}
	
	if (post.owner === null)
	{
		err = "Post Creation Error: owner missing";
		return respond(cb, err);
	}
	else
	{
		if (post.owner.constructor !== User.Model)
		{
			err = "Post Creation Error: owner not a user object";
			return respond(cb, err);
		}
	}
	if (post.owner.id() === null)
	{
		err = "Post Creation Error: owner id missing";
		return respond(cb, err);
	}
	
	var ts = new Date().getTime();
	
	var props = {
		content: post.content,
		oid: post.owner.id(),
		access: post.access,
		ts: ts
	};
	
	// Build Cyhper Query
	var matches = [];
	var cypher = "";
	matches.push("MATCH (o:User) WHERE id(o)="+post.owner.id()+" ");
	cypher += "CREATE (p:Post { props } ) ";
	cypher += "CREATE (o)-[:Posted { ts: "+ts+" } ]->(p) ";
	if (post.access === "Public")
	{
		matches.push("MATCH (a:Access) WHERE a.level=\"Public\" ");
		cypher += "CREATE UNIQUE (a)-[:CanSee{ ts: "+ts+" } ]->(p) ";
	}
	// TODO: Match & Create CanSee relationships with tagged users
	cypher += "Return p,id(p),o";
	var query = {
		"query": matches.join("")+cypher,
		"params": {
			"props": props
		}
	};
	db.neo(query, cb, function(err, res) {
		var posts = parsePosts(res);
		return respond(cb, err, posts);
	});
	
};
exports.create = create;