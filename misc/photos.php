<?php //Bismillah
/*
display all my photos
*/
include("../conn.php");

function prin($arr)
{
	
	echo "<pre>";
	print_r($arr);
	echo "</pre>";
}
?>
<head>
<title>Photos Misc</title>
<style type="text/css">
.album
{
	display: block;
	float: left;
	width: 150px;
	height: 150px;
	padding: 5px;
	border: 1px solid #CCC;
	margin: 10px;
}
.cap
{
	display: none;
}
#franz
{
	display: block;
	float: left;
	width: 300px;
}
.pbox
{
	display: block;
	float: left;
	width: 1400px;
}
</style>
<script type="text/javascript" src="../scripts/jquery.js"></script>
<script type="text/javascript" src="https://raw.github.com/awbush/jquery-fastLiveFilter/master/jquery.fastLiveFilter.js"></script>
</head>
<body>
<script type="text/javascript">
$(function() {
		$('#fsrch').fastLiveFilter('.flist', {
					callback: function(total) {
							$('#res').html("<i>"+total+" results</i>");
						}
				}
			);
	});
</script>
<?
echo "<h3>Session</h3>";
//prin($_SESSION);

//FB Init
require_once("../facebook.php");

$config = array();
$config[‘appId’] = '313639928748177';
$config[‘secret’] = 'c332c6990dfdf697fee8c36b4be11456';
$config[‘fileUpload’] = false; // optional

$fb = new Facebook($config);

if(isset($_SESSION['fbtoken']))
{
	$fb->setAccessToken($_SESSION['fbtoken']);
	//echo "Session Set.<br>";
}
$fbuser = $fb->getUser();

//prin($fbuser);

if ($fbuser)
{

	try {
		$fbu = $fb->api('/me', 'GET');
		//echo "Facebook User is ".$fbu['name']."<br>";
	} catch(FacebookApiException $e) {
		echo "<strong>Error #001:</strong><br>Unable to connect to Facebook.<br>".$e;
	}
}
else
{
	echo "<strong>Error #002:</strong><br>Unable to connect to Facebook. Please log in using your Email and Password.";
}

$id = "me()";
//Display User's Friends
$fql = "{\"q1\":\"SELECT uid2 FROM friend WHERE uid1=".$id."\",";
$fql .= "\"q2\":\"SELECT name, uid FROM user WHERE uid in (SELECT uid2 FROM #q1) ORDER BY last_name ASC\"}";
$fqlurl = "https://graph.facebook.com/fql?q=".urlencode($fql)."&access_token=".$_SESSION['fbtoken'];
//echo "<br><i>".$fqlurl."</i><br>";
$fqr = file_get_contents($fqlurl);
$fq = json_decode($fqr, true);
$p = $fq['data'][1]['fql_result_set'];
echo "<div id=\"franz\"><input type=\"text\" id=\"fsrch\"><ul class=\"flist\"><span id=\"res\"></span>\n";
foreach ($p as $k)
{
	echo "<li><a href=\"photos.php?id=".$k['uid']."\">".$k['name']."</a></li>\n";
}
echo "</ul></div>\n";
//Photo stuff

//Determine the user whose photos to display
if (isset($_GET['id']))
{
	if ($_GET['id']!="")
	{
		$id = $_GET['id'];
	}
}

//$fqlo = "http://graph.facebook.com/fql?q=%7B%22q1%22%3A%22SELECT+object_id+FROM+photo_tag+WHERE+subject=me()%22,%22q2%22%3A%22SELECT+images+FROM+photo+WHERE+object_id+in+(SELECT+object_id+FROM+%23q1)%22%7D&access_token=AAAEdQPyKWJEBAKMxuK7GJTQdap5qpAqsC5ypgyAoea7Uc4iNUwtrL7vMoERZBfrRjRMUsdTvwjC4OepPg3Xtg6Dajvbc4mAIqh6nKLu06LuLgTdRl";
$fsql = "{\"q1\":\"SELECT object_id FROM photo_tag WHERE subject=".$id."\",";
$fsql .= "\"q2\":\"SELECT src, created, caption FROM photo WHERE object_id in (SELECT object_id FROM #q1)\"}";
$ub = "https://graph.facebook.com/fql?q=";
$fqlurl = "https://graph.facebook.com/fql?q=".urlencode($fsql)."&access_token=".$_SESSION['fbtoken'];
echo "<br><i>".$ub.urlencode($fsql)."&access_token=".$_SESSION['fbtoken']."</i><br>";
$fqr = file_get_contents($ub.urlencode($fsql)."&access_token=".$_SESSION['fbtoken']);
$fq = json_decode($fqr, true);
prin($fq);
echo "<div class=\"pbox\">\n";

$p = $fq['data'][1]['fql_result_set'];
foreach ($p as $k)
{
	echo "<div class=\"album\">";
	echo "\t<div class=\"atitle\">\n";
	echo "\t\t".date("n/j/Y",$k['created'])."</div>";
	echo "<div class=\"imgbox\"><img class=\"img\" src=\"".$k['src']."\"></div>\n";
	echo "<div class=\"cap\">".$k['caption']."</div>\n";
	echo "</div>";
}

echo "</div>";
/*
//Attempt 1
echo "test: ";
$pd = $fb->api("/me/albums");
$p = $pd['data'];

foreach ($p as $k)
{
	echo "<div class=\"album\">";
	echo "\t<div class=\"atitle\">\n\t\t<h3>Album ID: ".$k['id']."</h3>\n";
	echo "\t\tBy ".$k['from']['name']."</div>";
	echo "<div class=\"imgbox\"><img class=\"img\" width=\"200px\" src=\"".$k['images'][5]['source']."\"></div>\n";
	echo "</div>";
}
prin($p['data'][0]);
*/
?>