//Bismillah
(function() {
  var app = angular.module('directory', []);

  app.controller('directoryController', ['$http', function($http) {
    var self = this;

    self.members = [];

    $http.get('/api/users/').success(function(data) {
      self.members = data.data.users;
    });
  }]);
})();

