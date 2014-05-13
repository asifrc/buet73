//Bismillah

// var casper = require('casper').create();

var BASE_URL = 'http://localhost:3000';

casper.test.begin('User Can Signup', function(test) {
  casper.start(BASE_URL);

  casper.then(function() {
    this.click("#btnSignup");
  })

  casper.then(function() {
    test.assertEquals(this.getCurrentUrl(), BASE_URL+"/signup");

    this.fill('form', {
      email: "buet73-test@asifchoudhury.com",
      password: "password1234",
      cpassword: "password1234",
      firstName: "Asif",
      lastName: "Choudhury",
      displayName: "Asif Choudhury",
      department: "Electrical Engineering",
      country: "United States"
    });

    this.click('.btn-success');
  });

  casper.then(function() {
    test.assertEquals(this.getCurrentUrl(), BASE_URL+"/");
    test.assertFalse(this.exists('a[href="/signin"]'));
  });

  casper.run(function() {
    test.done();
  });
});
