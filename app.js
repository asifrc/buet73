//Bismillah
/**
 * Module dependencies.
 */

var express = require('express'),
	//user = require('./routes/user'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose');

//Connect to MongoDB
// var mongoUrl = "mongodb://localhost/buet73";
// mongoose.connect(mongoUrl);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function cb() {
//   console.log("Connected to MongoDB at "+mongoUrl); //DEV
// });

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/**
 * Routes
 */

//Index
app.get('/', function(req, res) {
	res.render('index');
});
app.get('/signup', function(req, res) {
	res.render('signup');
});
app.get('/signin', function(req, res) {
	res.render('signin');
});

//DEV ROUTES
app.get('/dev/dbtest', function(req, res) {
	res.send("DB Test :)");
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Bismillah");
	console.log('Express server listening on port ' + app.get('port'));
});


module.exports = app;
