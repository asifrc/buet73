<?php //Bismillah
//Does the user need to be logged in to see this page? (Will replace content with *_nologin.php if logged out)
$need_login = true;
include('conn.php');
?>
<head>
<title>Class of '73</title>
<link href="styles/global.css" rel="stylesheet" type="text/css">
<link href="styles/jqueryui.css" rel="stylesheet" type="text/css">
<style type="text/css">
.dvuser
{
	margin: 15px;
	padding: 10px;
}
.dvuser:hover
{
	cursor: pointer;
	border: 1px solid #aaaaaa;
}
.dvuser *
{
	vertical-align: top;
}
.dvuserdn
{
	font-weight: bold;
	font-size: 14pt;
}
</style>
<script type="text/javascript" src="scripts/global.js"></script>
<script type="text/javascript" src="scripts/jquery.js"></script>
<script type="text/javascript" src="scripts/jqueryui.js"></script>
<script type="text/javascript">
</script>
</head>
<body>
<?php
include('head.php');
?>
        <div id="content">
<?php
include('loginbox.php');
?>
		<h1 align="center">Alumni Directory</h1>
<?php
if ($uid)
{

$sql = "Select * From `users` Order By `LastName` Asc;";
if ($db = myq($sql))
{
	while ($rs = mysql_fetch_array($db))
	{
		//Define Image
		$imgurl = "pics/profile/no/thumbnail/pic";
		if ($rs['profpic']!="")
		{
			$imgurl = "pics/profile/".$rs['id']."/thumbnail/".$rs['profpic'];
		}
		echo "<div class=\"ui-widget dvuser\" onclick=\"window.location.href='profile.php?id=".$rs['id']."';\">\n";
		echo "\t<table><tr><td><img src=\"".$imgurl."\" width='50px'></td><td><div><span class=\"dvuserdn\">".$rs['DisplayName']."</span><br>".$rs['Country']."</div></td></tr></table>\n";
		echo "</div>";
	}
}
else
{
	echo "No Users";
}

}
else
{
	echo "Register or Log in to view the Alumni Directory.";	
}
?>
        </div>
<?php
include('foot.php');
?>
</body>