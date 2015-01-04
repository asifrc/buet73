//Bismillah

/**
 * USER MODULE
 * ----------
 * Contains User schema for Mongoose,
 * CRUD interface to mongoDB,
 * and router interface to Express
 *
 * Instantiated with a constructor,
 *  - takes mongoose as parameter
 */

var bcrypt = require('bcrypt');
var autoIncrement = require('mongoose-auto-increment');

var ERRORS = require('../public/js/errors');

//JSON response object
var Resp = function(obj) {
  this.error = null;
  this.data = (typeof obj === "object") ? obj : null;
};

var respond = function(ret, cb) {
  if (typeof cb === "function") {
    cb(ret);
  }
  return ret;
};


//Export Constructor
module.exports = function(mongoose) {
  var self = this;

  /**
   * User Schema and Model
   */

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
  autoIncrement.initialize(mongoose);
  schema.plugin(autoIncrement.plugin, 'User');

  //User Model
  var User = mongoose.model('User', schema);

  //Export Model
  self.model = User;

  //Check password validity and confirmation
  var validatePassword = function(password, cpassword) {
    validations = [
      {
        msg: ERRORS.signup['password']['missing'],
        check: function(pw, cpw) { return (typeof pw !== "undefined"); }
      },
      {
        msg: ERRORS.signup['password']['unconfirmed'],
        check: function(pw, cpw) { return (typeof cpw !== "undefined"); }
      },
      {
        msg: ERRORS.signup['password']['mismatch'],
        check: function(pw, cpw) { return (pw==cpw); }
      },
      {
        msg: ERRORS.signup['password']['missing'],
        check: function(pw, cpw) { return (pw.length>0); }
      }
    ];
    var results = [];
    validations.map(function(validation) {
      if (!validation.check(password, cpassword)) {
        results.push(validation.msg);
      }
    });
    var error =  (results.length > 0) ? results[0] : null;
    return error;
  };

  //Password Encryption
  var encryptPassword = function(password, cb) {
    bcrypt.hash(password, 1, cb);
  };
  self.encryptPassword = encryptPassword;

  var comparePassword = function(password, encryptedPw, cb) {
    bcrypt.compare(password, encryptedPw, cb);
  };
  self.comparePassword = comparePassword;


  /**
   * Register User (Save to Database)
   */
  self.register = function(postData, cb) {
    //JSON response object
    var resp = new Resp();

    //Check for required fields

    var reqFields = [
      'email',
      'password',
      'firstName',
      'lastName',
      'displayName',
      'department',
      'country'
    ];
    var optFields = [
      'fbid',
      'phone',
      'address',
      'city',
      'stateProv',
      'zip'
    ];

    var userObj = {};
    //Add all required fields to userObj, return error if missing
    var isMissing = function(value) {
      if (typeof value === "undefined") {
        return true;
      }
      return (value === "");
    };
    for (var i=0; i<reqFields.length; i++) {
      var field = reqFields[i];
      if (isMissing(postData[field])) {
        resp.error = ERRORS.signup[field]['missing'];
        return respond(resp, cb);
      }
      userObj[field] = postData[field];
    }
    //Add all optional fields if they exist
    for (var j=0; j<reqFields.length; j++) {
      var optField = optFields[j];
      if (typeof postData[optField] !== "undefined") {
        userObj[optField] = postData[optField];
      }
    }

    //Check for matching passwords
    resp.error = validatePassword(userObj.password, postData.cpassword);
    if (resp.error) {
      return respond(resp, cb);
    }

    //Encrypt Password
    encryptPassword(userObj.password, function(err, encryptedPassword) {
      if (err) {
        resp.error = err;
        return respond(resp, cb);
      }

      userObj.password = encryptedPassword;

      //Create user object from model
      var user = new User(userObj);

      //Save to database
      user.save(function(err) {
        resp.error = err;
        //Return User Object
        resp = new Resp({ "users": [ user ] });
        return respond(resp, cb);
      });
    });
  };

  /**
   * Retrieve Users by Criteria
   */
  var findUser = function(criteria, cb) {
    var resp = new Resp({ users: [] });

    //Never search by password
    delete criteria.password;

    User.find(criteria, function(err, data) {
      resp = new Resp({ users: data });
      resp.error = err;
      return respond(resp,cb);
    });
  };
  self.find = findUser;

  /**
   * Find a Single User
   */
  var findById = function(criteria, cb, handler) {
    var resp = new Resp();
    if (typeof criteria._id !== "string") {
      resp.error = ERRORS.user['notFound'];
      return handler(resp);
    }
    findUser({_id: criteria._id}, function(response) {
      if (response.error) {
        return handler(response);
      }
      if (response.data.users.length != 1) {
        resp.error = ERRORS.user['notFound'];
        return handler(resp);
      }
      handler(response);
    });
  };

  /**
   * Update User by ID
   */
  self.update = function(criteria, cb) {
    var resp = new Resp();
    findById(criteria, cb, function(response) {
      if (response.error) {
        return respond(response, cb);
      }
      user = response.data.users[0];
      for (var field in criteria) {
        user[field] = criteria[field];
      }
      user.save(function(err, usr) {
        resp = new Resp({users: [usr] });
        resp.error = err;
        return respond(resp, cb);
      });
    });
  };

  /**
   * Remove User by ID
   */
  self.remove = function(criteria, cb) {
    var resp = new Resp();
    findById(criteria, cb, function(response) {
      if (response.error) {
        return respond(response, cb);
      }
      response.data.users[0].remove(function(err) {
        resp.error = err;
        return respond(resp, cb);
      });
    });
  };

  /**
   * Authenticate User
   */
  self.authenticate = function(user, cb) {
    var resp = new Resp();
    var criteria = {
      email: user.email
    };
    User.findOne(criteria, function(err, result) {
      if (err) {
        resp.error = err;
        return respond(resp, cb);
      }
      if (!result) {
        resp.error = ERRORS.auth['notFound'];
        return respond(resp, cb);
      }
      comparePassword(user.password, result.password, function(err, isMatch) {
        if (isMatch) {
          resp.data = { user: result };
        }
        else {
          resp.error = ERRORS.auth['wrongPassword'];
        }
        return respond(resp, cb);
      });
    });
  };
  return this;
};
