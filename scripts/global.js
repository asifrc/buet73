//Bismillah
//GET shortener
function g(x)
{
	return document.getElementById(x);
}

//Facebook Login Status Variable
var fbl = "not checked";

//Check FB login
function fbLoginResponse()
{
	if (fbl!="connected")
	{
		$('#fbstat').html(fbl);
		if (fbl!="connected")
		{
			$(".fb-login-button").show();
		}
	}
}
function fbStatusCheck()
{
	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
		// connected
		fbl = "connected";
	  } else if (response.status === 'not_authorized') {
		// not_authorized
		fbl = "not authorized";
	  } else {
		// not_logged_in
		fbl = "not logged in";
	  }
	  
	});
	$('#fbstat').html(fbl);
}

//Manually makes a div have a border and rounded corners using jqueryui
function uiwidg(x)
{
	$(x).addClass('ui-widget',0);
	$(x).addClass('ui-widget-content',0);
	$(x).addClass('ui-corner-all',0);
}