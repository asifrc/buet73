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
#picbox
{
	width: 200px;
}
#profbox
{
	width: 450px;
}
#upperbox
{
	margin: 20px 0px 25px 0px;
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
$pid = $uid;
$rsu = $u;
if (isset($_GET['id']))
{
	if ($_GET['id']!="")
	{
		$sql = "Select * From `users` Where `id`=".$_GET['id'];
		if ($db = myq($sql))
		{
			$rsu = mysql_fetch_array($db);
			$pid = $rsu['id'];
		}
	}
}
?>
<script type="text/javascript">
	$(function() {
		$( "#profbox" ).tabs( "option", "heightStyle", "fill" );
		$('#profbox').css('border', '0px');
	});
</script>
        <div id="content">
        	<h2 align="center" style="marginal-bottom: 0px;"><?php echo $rsu['DisplayName']; ?></h2>
        	<div id="upperbox">
                <div id="picbox" class="fll">
				<?php
					$imgurl = "pics/profile/no/pic";
					if ($rsu['profpic']!="")
					{
						$imgurl = "pics/profile/".$rsu['id']."/".$rsu['profpic'];
					}
                    echo "<img src=\"".$imgurl."\" width=\"200px\">";
				?>
                </div>
                <div class="flr" style="height: 300px;">
                    <div id="profbox" class="jqtabs">
                        <ul>
                            <li><a href="#tbcontact">Contact Info</a></li>
                        </ul>
                        <div id="tbcontact">
<?php
//Contact Info
function disif($x,$y)
{
	if ($x!="")
	{
		return $y;
	}
	return "";
}
$atd = Array("Phone", "Address", "City", "StateProv", "Zip", "Country");
echo "<table>";
foreach($atd as $fl)
{
	echo disif($rsu[$fl], "<tr><td>".$fl."</td><td>".$rsu[$fl]."</td></tr>\n");
}
echo "</table>";
?>
		
                        </div>
						
                    </div>
                </div>	  
			</div>
        </div>
<?php
include('foot.php');
?>
</body>