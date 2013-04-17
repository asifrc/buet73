<?php //Bismillah
include('conn.php');
/*
Respond to FB login

Responses:
LoggedIn: registered user is now logged in
NeedReg: FB user needs to register locally
[Error] = error to be displayed by errmsg

*/
//FB Init
require_once("facebook.php");

$config = array();
$config[‘appId’] = '313639928748177';
$config[‘secret’] = 'c332c6990dfdf697fee8c36b4be11456';
$config[‘fileUpload’] = false; // optional

$fb = new Facebook($config);

if(isset($_GET['token']))
{
	$fb->setAccessToken($_GET['token']);
}
$fbuser = $fb->getUser();

if ($fbuser)
{

	try {
		$fbu = $fb->api('/me', 'GET');
		//echo "Facebook User is ".$fbu['name']."<br>";
	} catch(FacebookApiException $e) {
		echo "<strong>Error:</strong><br>Unable to connect to Facebook. Please log in using your Email and Password.";
	}
}
else
{
	echo "<strong>Error:</strong><br>Unable to connect to Facebook. Please log in using your Email and Password.";
}
	

$sql = "Select * From `users` Where `fbid`=\"".$_GET['fbid']."\";";
$_SESSION['fbid'] = $_GET['fbid'];
$_SESSION['fbtoken'] = $_GET['token'];
if ($db = myq($sql))
{
	$rsu = mysql_fetch_array($db);
	$_SESSION['uid'] = $rsu['id'];
	die("LoggedIn");
}
else
{
	die("NeedReg");
}
?>