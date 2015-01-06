//Bismillah

$('#btnSignin').on('click', signin);
$('#email, #password').on('keydown', function(e) {
  if (e.keyCode === 13) {
    signin();
  }
});
