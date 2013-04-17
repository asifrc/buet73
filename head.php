<div id="fb-root"></div>
<script>
//Facebook Init
  // Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '313639928748177', // App ID
      channelUrl : '//bute73.asifrc.com/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional init code here
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
	 	fbLoginResponse();
	  };

	// Load the SDK Asynchronously
	(function(d){
	 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement('script'); js.id = id; js.async = true;
	 js.src = "//connect.facebook.net/en_US/all.js";
	 ref.parentNode.insertBefore(js, ref);
	}(document));
</script>
<script type="text/javascript">
	$(function() {
		//Init jqui buttonss
		$('.jqbtn').button();
		//Init jqui tabs
		$('.jqtabs').tabs();
		//Manual Widgets
		uiwidg('.uiw');
	});
</script>
<div align="center" width="100%" style="border: 0px solid #000000;">
<div id="d1">
	<div id="imgheader"></div>
    <div id="mainframe" align="left">
        <div id="sidepanel" align="center">
        	<br>
        	<a class="slinks" href="/">Home</a><br>
            <a class="slinks" href="directory.php">Directory</a><br>
            <a class="slinks" href="map.php">Alumni Map</a><br>
			<?php
			if ($uid)
			{
				echo "<a class=\"slinks\" href=\"edit.php\">Settings</a><br>";
				echo "<a class=\"slinks\" href=\"logout.php\">Log Out</a><br>";
			}
			else
			{
				echo "<a class=\"slinks\" href=\"about.php\">About</a><br>";
			}
			?>
        </div>