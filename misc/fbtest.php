<?php //Bismillah
//Test if fb token carries over
//FB Init
require_once("../facebook.php");

$config = array();
$config[‘appId’] = '313639928748177';
$config[‘secret’] = 'c332c6990dfdf697fee8c36b4be11456';
$config[‘fileUpload’] = false; // optional

$fb = new Facebook($config);

session_start();
if(!isset($_SESSION['fbtoken']))
{
	die("no token");
}
$fb->setAccessToken($_SESSION['fbtoken']);
$fbuser = $fb->getUser();

if ($fbuser)
{

	try {
		$fbu = $fb->api('/me', 'GET');
		echo "Facebook User is ".$fbu['name']."<br>";
	} catch(FacebookApiException $e) {
		echo "fbfail01";
	}
}
else
{
	echo "fbuser failed. ";
}