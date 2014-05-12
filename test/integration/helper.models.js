// Bismillah

/**
* Helper module for Model tests
*/


var db = require('../../models/db');
var respond = db.respond;

var User = require('../../models/User');
var Post = require('../../models/Post');

var strToTitle = function(str) {
	return str.toLowerCase().replace(/(?:^.)|(?:\s.)/g, function(letter) { return letter.toUpperCase(); });
};


var userValues = {
	fbid: 15000000000,
	firstName: [
		"James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas"
	],
	lastName: [
		"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore"
	],
	department: [
		"Architecture",
		"Civil Engineering",
		"Chemical Engineering",
		"Electrical Engineering",
		"Mechanical Engineering",
		"Metallurgical Engineering",
		"Naval Architecture"
	],
	country: [
		'United States', "Australia", "Bangladesh", "China", "India", "United Kingdom"
	]
};

/**
* User Utilities
*/
var validUser = function() {
	var vals = userValues;
	vals.firstName.push(vals.firstName.shift());
	vals.lastName.push(vals.lastName.shift());
	return {
		fbid: (vals.fbid++).toString(),
		firstName: vals.firstName[0],
		lastName: vals.lastName[0],
		displayName: vals.firstName[0]+" "+vals.lastName[0],
		department:  vals.department[Math.floor(Math.random()*vals.department.length)],
		email: vals.firstName[0]+vals.lastName[0]+"@asifchoudhury.com",
		password: "password",
		country: vals.country[Math.floor(Math.random()*vals.country.length)]
	};
};

var emptyDb = function(cb) {
	var query = {"query": "MATCH (n)-[r]-() DELETE n,r"};
	db.neo(query, cb, function(data, response) {
		query = {"query": "MATCH (n) DELETE n"};
		db.neo(query, cb, function(data, response) {
			cb();
		});
	});
};

var createUsers = function(userCount, tempUsers, done) {
	userCount = userCount || 1;
	tempUsers = tempUsers || [];
	var countDown = function(cb) {
		if (--userCount <= 0)
		{
			done();
		}
		else
		{
			cb(cb);
		}
	};
	var reg = function(cb) {
		var user = new User.Model(validUser());
		user.cpassword = "password";
		User.register(user, function(err, result) {
			if (err)
			{
				done(err);
			}
			else
			{
				tempUsers.push(result[0]);
				countDown(cb);
			}
		});
	};
	reg(reg);
};

/**
* Post Utilities
*/
var postnum = 0;
var samplePost = function(owner) {
	return new Post.Model("Post #"+(postnum++)+" - This is a test Post.", owner);
};

var createPublicNode = function(cb) {
	var cypher = "MERGE (a:Access { level: \"Public\" } ) RETURN a";
	db.neo({ query: cypher }, cb, function(err, res) {
		respond(cb, err, res);
	});
};


module.exports = {
	strToTitle: strToTitle,
	validUser: validUser,
	samplePost: samplePost,
	emptyDb: emptyDb,
	createUsers: createUsers,
	createPublicNode: createPublicNode
};
