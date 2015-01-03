var ERRORS = new function() {
  var self = this;

  var isRequired = function(title) {
    return "Please provide your " + title + ".";
  };

  self.signup =  {
    'firstName': {
      'name': "First Name"
    },
    'lastName': {
      'name': "Last Name"
    },
    'displayName': {
      'name': "Display Name"
    },
    'department': {
      'name': "Department"
    },
    'email': {
      'name': "Email"
    },
    'password': {
      'name': "Password",
      'mismatch': "Passwords do not match",
      'unconfirmed': "Password must be confirmed"
    },
    'country': {
      'name': "Country"
    },
  }

  for (var field in self.signup) {
    self.signup[field].missing = isRequired(self.signup[field].name);
  };

  self.user = {
    'notFound': "The user was not found."
  }

  self.auth = {
    'notFound': "The email provided is not registered.",
    'wrongPassword': "The password provided is incorrect."
  };
};

if (module) {
  module.exports = ERRORS;
}
