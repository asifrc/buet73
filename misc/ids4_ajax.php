<? //Bismillah
$a = $_GET["a"];
if (!isset($_GET['a']))
{
	die("Please enter parameters a and b.");
}
if ($a=="")
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

echo "<p>".date("H:i:s");
$sqla = "Insert Into `hamd` (`pidm`,`name`) Values (\"";
$sqlc = "\");";
$f = file_get_contents("https://piperline.hamline.edu/pls/prod/hamutil.P_Profile?pidm=".$a);
$nam = gel($f, "<H1>", "</H1>", false, false);
if ($nam)
{
	mysql_query($sqla.$a."\", \"".$nam.$sqlc);
	echo ": ".$a." - ".$nam."<br>\n";
}
echo "</p>";
?>
