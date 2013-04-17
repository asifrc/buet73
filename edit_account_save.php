<?php //Bismillah
include('conn.php');
/*
Saves account info provided via Ajax from edit_account.php
*/
function filt($x)
{
	$r = str_replace("\"", "\\\"", $x);
	$r = str_replace("<", "&lt;", $x);
	$r = str_replace(">", "&gt;", $r);
	return $r;
}
if(!$u)
{
	die("noUser");
}
if (!isset($_GET))
{
	die("noData");
}
$sql = "Update `users` Set ";

$p = array("FirstName", "LastName", "DisplayName", "Department", "Email");
$cma = "";
foreach ($p as $f)
{
	if (isset($_GET[$f]))
	{
		$sql .= $cma."`".$f."`=\"".filt($_GET[$f])."\"";
		$cma = ", ";
	}
}
$sql .= " Where `id`=".$uid;

//print_r($_GET); //Debug
//die($sql); //Debug

if (mysql_query($sql))
{
	echo "Success";
}
else
{
	echo "<strong>Save Failed:</strong><br>".mysql_error();
}
?>