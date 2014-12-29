//Bismillah

var signUp = function() {
  var fields = [
    'firstName',
    'lastName',
    'displayName',
    'email',
    'password',
    'cpassword',
    'department',
    'country'
  ];
  var user = {}
  fields.map(function(field) {
    user[field] = $("#"+field).val();
  });
  $.post('/api/users/', user, function(data) {
    if (data.error) {
      alert(data.error);
      return false;
    }
    alert("Success!");
  });
};

$('#btnSignup').on('click', signUp);
