//Bismillah

// var casper = require('casper').create();

casper.test.begin('Bismillah Test', function(test) {
  casper.start('http://localhost:3000/');

  casper.then(function() {
    test.assertTitle("Class of '73", "Has the right title");
  })

  casper.run(function() {
    test.done();
  });
});
