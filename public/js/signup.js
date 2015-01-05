//Bismillah

var signUp = function() {
  $('.form-group').removeClass('has-error');

  var fields = [
    'email',
    'password',
    'cpassword',
    'firstName',
    'lastName',
    'displayName',
    'department',
    'country'
  ];
  var user = {};
  var missing = [];
  fields.map(function(field) {
    user[field] = $("#"+field).val();
    if (user[field] === "" && field !== "cpassword") {
      missing.push(field);
    }
  });
  if (missing.length > 0) {
    $('#formError').text(ERRORS.signup[missing[0]]['missing']);
    $("#"+missing[0]).parent().addClass('has-error').focus();
    $("#"+missing[0]).focus();
    return false;
  }
  $.post('/auth/register', user, function(data) {
    if (data.error) {
    $('#formError').text(data.error);
      return false;
    }
    alert("Success!");
  });
};

$('#btnSignup').on('click', signUp);
