//Bismillah

var signin = function() {
  var userData = {
    email: $('#email').val(),
    password: $('#password').val()
  };
  $.post('/api/users/login', userData, function(data) {
    if (data.error) {
      $('#pError').text(data.error);
    }
    else {
      window.location.href = "/";
    }
  });
};

$('#btnSignin').on('click', signin);
$('#email, #password').on('keydown', function(e) {
  if (e.keyCode === 13) {
    signin();
  }
});
