//Bismillah

var mongoose = require('mongoose');
var CONFIG = require('../config');

//Connect to MongoDB
console.log(CONFIG.DB.URL);
mongoose.connect(CONFIG.DB.URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function cb() {
    console.log("Connected to MongoDB at "+CONFIG.DB.URL); //DEV
});

module.exports.mongoose = mongoose;
