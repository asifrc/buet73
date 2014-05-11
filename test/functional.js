//Bismillah

var phantomjs = require('phantom');

var should = require('should');

var page, exitPhantom;

describe("Functional", function() {
  this.timeout(10000);
  before(function(done) {
    phantomjs.create( function(phan) {
      phantom = phan;
      done();
    });
  });

  after(function() {
    phantom.exit();
  });

  beforeEach(function(done) {
    phantom.createPage(function(newPage) {
      page = newPage;
      page.open("http://localhost:3000", function(s) {
        if (s=="fail") {
          throw new Error("Could not connect to server. Make sure you've started the app.");
        }
        done();
      });
    });
  });

  afterEach(function() {
    page.close();
  });

  it("should display the homepage with a subbrand of 'Class of 1973'", function(done) {
    page.evaluate(function() {
      return document.getElementsByClassName('subbrand')[0].innerHTML;
    }, function(result) {
      result = result || "";
      result.should.equal("Class of 1973");
      done();
    });
  });

  it("should go to Sign Up page when clicking on the Signup button", function(done) {
    // page.set('onLoadFinished', function(success) {
    //   page.evaluate(function() {
    //     return document.getElementsByTagName('h1')[0].innerHTML;
    //   }, function(result){
    //     result = result || "";
    //     result.should.equal("Something");
    //     done();
    //   })
    // });
    page.evaluate(function() {
      document.getElementById('btnSignup').click();
    }, function(result) {
      page.evaluate(function() {
        return document.getElementsByTagName('h1')[0].innerHTML;
      }, function(result){
        result = result || "";
        result.should.equal("Something");
        done();
      });
    });
  });


});
