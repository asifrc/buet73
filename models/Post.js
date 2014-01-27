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
	self.tags = [];
	self.ts = null;
	
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
	var ids = [];
	
	var getPost = function(data) {
		var index = ids.indexOf(data[1]);
		if (index==-1)
		{
			ids.push(data[1]);
			var post = new PostModel();
			post.id(data[1]);
			post.content = data[0].data.content;
			post.content = data[0].data.ts;
			post.access = data[0].data.access;
			post.owner = new User.Model(data[2].data);
			post.owner.id(data[3]);
			len = posts.push(post);
			return posts[len-1];
		}
		else
		{
			return posts[index];
		}
	};
	
	for (var i=0; i<result.data.length; i++)
	{
		var post = getPost(result.data[i]);
		if (result.data[i].length === 6)
		{
			if (typeof result.data[i][4].data.level === "undefined")
			{
				var user = new User.Model(result.data[i][4].data, true);
				user.id(result.data[i][5]);
				post.tags.push(user);
			}
		}
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
	cypher += "CREATE UNIQUE (o)-[:Posted { ts: "+ts+" } ]->(p:Post { props } )";
	
	// TODO: Match & Create CanSee relationships with tagged users
	var tags = [];
	for (var i=0; i<post.tags.length; i++)
	{
		var id = null;
		if (post.tags[i].constructor === User.Model)
		{
			id = post.tags[i].id();
		}
		else if (typeof post.tags[i] === "number")
		{
			id = post.tags[i];
		}
		
		if (id)
		{
			tags.push("id(t)="+id);
		}
	}
	if (post.access === "Public")
	{
		tags.push("t.level=\"Public\"");
	}
	
	if (tags.length>0)
	{
		matches.push("MATCH (t) WHERE "+tags.join(" OR ")+" ");
		cypher += "<-[:CanSee { ts: "+ts+" } ]-(t) ";
	}
	
	cypher += " RETURN p,id(p),o,id(o)";
	cypher += (tags.length>0) ? ",t,id(t)" : "";
	
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