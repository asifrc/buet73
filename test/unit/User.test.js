//Bismillah

/**
 * Tests the User schema
 */

var should = require("should");
var assert = require("assert");
var mongoose = require('mongoose');

//Connect to MongoDB
var mongoUrl = "mongodb://localhost/buet73tests";
mongoose.connect(mongoUrl);
var db = mongoose.connection;

//Require User Module, passing mongoose
var user = require("../../models/User")(mongoose);

var reqFields = [
  'firstName',
  'lastName',
  'displayName',
  'department',
  'email',
  'password',
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
var allFields = reqFields.concat(optFields);



describe("MongoDB Connection", function() {
  it("should connect to mongo", function(done) {
    db.once('open', done);
  });
});

var newBob = function(reg) {
  var bob = {
    fbid: "1234",
    firstName: "Bob",
    lastName: "Anderson",
    displayName: "Bobby Anderson",
    department: "Electrical Engineering",
    email: "banderson@asifchoudhury.com",
    password: "unhashedpassword",
    phone: "1 123 1234",
    address: "2828 82nd St",
    city: "Rapid City",
    stateProv: "South Dakota",
    zip: "57702",
    country: "United States",
  };
  reg = (typeof reg === "undefined") ? false : reg;
  if (reg)
    {
      bob.cpassword = bob.password;
    }
    return bob;
};

var emptyDoc = function(cb) {
  user.model.remove({}, function(err) {
    if (typeof cb === "function") {
      cb(err);
    }
  });
};

describe("User Module", function() {
  describe("User Model", function() {

    before(function(done) {
      emptyDoc(done);
    });

    afterEach(function(done) {
      emptyDoc(done);
    });

    it("should create a User object", function() {
      var bob = newBob();
      bobby = new user.model(bob);
      bob.firstName.should.equal(bobby.firstName);

    });

    describe("Registration", function() {

      var bob;

      beforeEach(function() {
        bob = newBob(true);
      });

      it("should return the user when there are no errors", function(done) {
        user.register(bob, function(resp) {
          (resp.error === null).should.be.ok;
          (typeof resp.data.users.length).should.equal("number");
          resp.data.users.length.should.equal(1);
          resp.data.users[0].firstName.should.equal(bob.firstName);
          done();
        });
      });

      describe("Required Fields", function() {
        var fields = reqFields.filter(function(v) { return v !== "password"; });
        fields.map(function(field) {
          it("should save "+field, function(done) {
            bob[field] = "TestValue";
            user.register(bob, function(resp) {
              (resp.error === null).should.be.ok;
              var obj = {};
              obj[field] = "TestValue";
              user.model.count(obj, function(err, count) {
                count.should.equal(1);
                done();
              });
            });
          });
        });

        it("should save password", function(done) {
          var john = newBob();
          john.password = "TestPassword";
          john.cpassword = "TestPassword";
          user.register(john, function(resp) {
            (resp.error === null).should.be.ok;
            var encryptedPw = resp.data.users[0].password;
            user.comparePassword(john.password, encryptedPw, function(err, same) {
              same.should.be.ok;
              done();
            });
          });
        });
      });

      describe("Missing Required Field", function() {
        reqFields.map(function(field) {
          it("should return an error when "+field+" is missing", function(done) {
            delete bob[field];
            user.register(bob, function(resp) {
              resp.error.should.equal("Bad request: "+field+" field is missing");
              done();
            });
          });
        });
      });

      describe.skip("Empty String in Required Field", function() {
        reqFields.map(function(field) {
          it("should return an error when "+field+" is blank", function(done) {
            bob = newBob(true);
            bob[field] = "";
            user.register(bob, function(resp) {
            resp.error.should.equal("Bad request: "+field+" field is missing");
            done();
            });
          });
        });
      });

      describe("Optional Fields", function() {
        optFields.map(function(field) {
          it("should save "+field, function(done) {
            bob[field] = "TestValue";
            user.register(bob, function(resp) {
              (resp.error === null).should.be.ok;
              var obj = {};
              obj[field] = "TestValue";
              user.model.count(obj, function(err, count) {
                count.should.equal(1);
                done();
              });
            });
          });
        });
      });

      describe("Missing Optional Field", function() {
        reqFields.map(function(field) {
          it("should still save successfully when "+field+" is missing", function(done) {
            delete bob[field];
            user.register(bob, function(resp) {
              resp.error.should.equal("Bad request: "+field+" field is missing");
              done();
            });
          });
        });
      });

      describe("Password", function() {
        var bob;
        beforeEach(function() {
          bob = newBob(true);
        });

        it("should encrypt the password", function(done) {
          user.register(bob, function(resp) {
            resp.data.users[0].password.should.not.equal(bob.password);
            done();
          });
        });
        it("should return an error when confirmation field is missing", function(done) {
          delete bob.cpassword;
          user.register(bob, function(resp) {
            resp.error.should.equal("Password must be confirmed");
            done();
          });
        });
        it("should return an error on mismatch", function(done) {
          bob.cpassword = "mismatch";
          user.register(bob, function(resp) {
            resp.error.should.equal("Passwords do not match");
            done();
          });
        });
        it("should return an error when blank", function(done) {
          bob.password = "";
          bob.cpassword = "";
          user.register(bob, function(resp) {
            resp.error.should.equal("Password cannot be blank");
            done();
          });
        });
      });

      describe("No Callback", function() {
        it("should not throw any errors", function() {
          (user.register(bob) || true).should.be.ok;
        });
      });

    });

    describe("Find", function() {
      var bob;
      var james;

      before(function(done) {
        emptyDoc(done);
      });

      beforeEach(function(done) {
        bob = newBob(true);
        james = newBob(true);
        james.firstName = "James";
        user.register(bob, function(resp) {
          user.register(james, function(resp) {
            delete bob.cpassword;
            delete james.cpassword;
            done();
          });
        });
      });

      afterEach(function(done) {
        emptyDoc(done);
      });

      describe("No Criteria", function() {

        it("should not throw any errors when no parameters are passed", function() {
          (user.find(bob) || true).should.be.ok;
        });

        it("should return all users when empty object is passed", function(done) {
          user.find({}, function(resp) {
            (resp.error === null).should.be.ok;
            resp.data.users.length.should.equal(2);
            done();
          });
        });
      });

      describe("Single Criterion", function() {

        it("should return one user when sent one criterion matching one record", function(done) {
          user.find({ firstName: bob.firstName}, function(resp) {
            (resp.error === null).should.be.ok;
            resp.data.users.length.should.equal(1);
            resp.data.users[0].firstName.should.equal(bob.firstName);
            done();
          });
        });

        it("should two multiple users with one criterion matching two records", function(done) {
          user.find({ country: bob.country}, function(resp) {
            (resp.error === null).should.be.ok;
            resp.data.users.length.should.equal(2);
            resp.data.users[0].firstName.should.equal(bob.firstName);
            resp.data.users[1].firstName.should.equal(james.firstName);
            done();
          });
        });
      });

      describe("Multiple Criteria", function() {

        it("should return one user when sent criteria matching one record", function(done) {
          user.find({ firstName: bob.firstName, lastName: bob.lastName}, function(resp) {
            (resp.error === null).should.be.ok;
            resp.data.users.length.should.equal(1);
            resp.data.users[0].firstName.should.equal(bob.firstName);
            resp.data.users[0].lastName.should.equal(bob.lastName);
            done();
          });
        });

        it("should return two users with criteria matching two records", function(done) {
          user.find({ country: bob.country, zip: james.zip}, function(resp) {
            (resp.error === null).should.be.ok;
            resp.data.users.length.should.equal(2);
            resp.data.users[0].firstName.should.equal(bob.firstName);
            resp.data.users[1].firstName.should.equal(james.firstName);
            done();
          });
        });

        it("should return one user with a user passed as the criteria", function(done) {
          user.find(bob, function(resp) {
            (resp.error === null).should.be.ok;
            resp.data.users.length.should.equal(1);
            resp.data.users[0].firstName.should.equal(bob.firstName);
            done();
          });
        });
      });

    });

    describe("Update", function() {

      var bob;
      var john;

      before(function(done) {
        emptyDoc(done);
      });

      beforeEach(function(done) {
        bob = newBob();
        john = newBob();
        john.firstName = "John";
        john.lastName = "Doe";
        john.cpassword = john.password;
        user.register(bob, function(resp) {
          user.register(john, function(resp2) {
            delete john.cpassword;
            done();
          });
        });
      });

      //afterEach(emptyDoc);

      it("should return an error if userID property is missing", function(done) {
        user.update({}, function(resp) {
          resp.error.should.equal("Invalid format - userID is invalid");
          done();
        });
      });

      it("should return an error if userID is invalid", function(done) {
        user.update({ _id: "1234" }, function(resp) {
          resp.should.have.property("error");
          done();
        });
      });

      it("should return an error if userID not found", function(done) {
        user.update({ _id: "987654321" }, function(resp) {
          resp.error.should.equal("The user id return an invalid number of users(0)");
          done();
        });
      });

      it("should update the database with the user data passed", function(done) {
        user.find(john, function(findResp) {
          john._id = findResp.data.users[0].id;
          john.zip = "60601";
          john.city = "Chicago";
          john.stateProv = "Illinois";

          user.update(john, function(updateResp) {
            (updateResp.error === null).should.be.ok;

            var match = true;
            for (var field in john)
              {
                match = match && (updateResp.data.users[0][field]==john[field]);
              }
              match.should.be.ok;

              user.find({_id: john._id}, function(resp) {
                resp.data.users.length.should.equal(1);
                match = true;
                for (var field in john)
                  {
                    match = match && (resp.data.users[0][field]==john[field]);
                  }
                  match.should.be.ok;
                  done();
              });
          });
        });
      });

    });

    describe("Remove", function() {

      var bobby = newBob();
      var john = newBob();

      before(function(done) {
        emptyDoc(done);
      });

      beforeEach(function(done) {
        bobby = newBob(true);
        john = newBob(true);
        john.firstName = "John";
        john.lastName = "Doe";
        emptyDoc(function(err) {
          user.register(bobby, function(resp) {
            user.register(john, function(resp2) {
              delete bobby.cpassword;
              delete john.cpassword;
              done();
            });
          });
        });
      });

      it("should return an error if userID property is missing", function(done) {
        user.remove({}, function(resp) {
          resp.error.should.equal("Invalid format - userID is invalid");
          done();
        });
      });

      it("should return an error if userID is invalid", function(done) {
        user.remove({ _id: "1234" }, function(resp) {
          resp.should.have.property("error");
          done();
        });
      });

      it("should return an error if userID not found", function(done) {
        user.remove({ _id: "987654321" }, function(resp) {
          resp.error.should.equal("The user id return an invalid number of users(0)");
          done();
        });
      });

      it("should remove the user when valid userID is provided", function(done) {
        user.find(john, function(findResp) {
          john._id = findResp.data.users[0].id;

          user.remove({_id: john._id}, function(resp) {
            (resp.error === null).should.be.ok;
            user.model.count({}, function(err, count) {
              // Only Bob should be left
              count.should.equal(1);
              done();
            });
          });
        });
      });

      it("should remove the user when a user is provided", function(done) {
        user.find(john, function(findResp) {
          john._id = findResp.data.users[0].id;

          user.remove(john, function(resp) {
            (resp.error === null).should.be.ok;
            user.model.count({}, function(err, count) {
              // Only Bob should be left
              count.should.equal(1);
              done();
            });
          });
        });
      });

    });
  });

  describe("Authentication", function() {
    var bob;

    before(function(done) {
      bob = newBob(true);
      emptyDoc(function() {
        user.register(bob, function(resp) {
          delete bob.cpassword;
          done();
        });
      });
    });

    after(function(done) {
      emptyDoc(done);
    });

    it("should return the user if the email and password match", function(done) {
      var bobby = {
        email: bob.email,
        password: bob.password
      };
      user.authenticate(bobby, function(resp) {
        (resp.error === null).should.be.ok;
        resp.data.should.have.property('user');
        resp.data.user.firstName.should.equal(bob.firstName);
        done();
      });
    });

    it("should return an error if the user is not found", function(done) {
      var bobby = {
        email: "fakeEmail@email.com",
        password: bob.password
      };
      user.authenticate(bobby, function(resp) {
        resp.should.have.property('error');
        resp.error.should.equal("The email provided is not registered.");
        done();
      });
    });

    it("should return an error when the password is incorrect", function(done) {
      var bobby = {
        email: bob.email,
        password: "WrongPassword"
      };
      user.authenticate(bobby, function(resp) {
        resp.should.have.property('error');
        resp.error.should.equal("The password provided is incorrect.");
        done();
      });
    });
  });
});
