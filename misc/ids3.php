<? //Bismillah
ob_end_flush();
 
function out($s)  {
	echo $s;
	@ob_flush();
}

$a = $_GET["a"];
$b = $_GET["b"];
if ($a==""||$b=="")
{
	die("Please enter parameters a and b.");
}
include('../conn.php');

/* Retrieves Element from IMDB
*/
function gel($filetxt, $searchterm, $endsearchterm, $incBterm = true, $incEterm = true)
{
	$s = strpos($filetxt, $searchterm);
	if (!$s)
	{
		return false;
	}
	$sp = 0;
	if (!$incBterm)
	{
	 	$sp = strlen($searchterm);
	}
	$s += $sp;	
	$l = strpos($filetxt, $endsearchterm, $s);
	if (!$l)
	{
		return false;
	}
	$lp = 0;
	if ($incEterm==true)
	{
		$lp = strlen($endsearchterm);
	}
	$l += $lp;
	$l = $l - $s;
	$el = substr($filetxt, $s, $l);
	return $el;
}
?>
<head>
<title>Names and Photos</title>
<style type="text/css">
iframe
{
	width: 400px;
	height: 200px;
}

</style>
<script type="text/javascript" src="../scripts/jquery.js"></script>
</head>
<body>
<?php
out("Start: ".date("H:i:s")."<br>\n");
$sqla = "Insert Into `hamd` (`pidm`,`name`) Values (\"";
$sqlc = "\");";
for ($i=$a; $i<=$b; $i++)
{
	$f = file_get_contents("https://piperline.hamline.edu/pls/prod/hamutil.P_Profile?pidm=".$i);
	$nam = gel($f, "<H1>", "</H1>", false, false);
	if ($nam)
	{
		mysql_query($sqla.$i."\", \"".$nam.$sqlc);
		out($i.": ".$nam."<br>\n");
	}
}
out("End: ".date("H:i:s")."<br>\n");
?>
</body>
