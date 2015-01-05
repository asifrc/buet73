//Bismillah
(function() {
  var app = angular.module('directory', []);

  app.controller('directoryController', ['$http', function($http) {
    var self = this;

    self.me = me;
    self.members = [];

    $http.get('/api/users/').success(function(data) {
      self.members = data.data.users;
    });

    self.profilePic = function(member) {
      var noPic = {
        "url": "/images/pic.gif",
        "thumb": "/images/thumbnail/pic.gif"
      };
      return (member.profilePic) ? member.profilePic : noPic;
    };
  }]);
})();

