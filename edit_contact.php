<?php //Bismillah
include('conn.php');
/*
Edit Contact Info
*/
$sql = "Select * From `users` Where `id`=".$uid;
if (!$db = myq($sql))
{
	die("The query returned 0 records");
}
$rs = mysql_fetch_array($db);

echo "<table>\n";

include("inc_countries.php");

echo "<tr><td>Country</td>\n";
echo "\t<td><select name=\"slCountry\">\n";
foreach ($country_list as $c)
{
	echo "\t\t<option";
	if ($c==$rs["Country"])
	{
		echo " selected";
	}
	echo ">".$c."</option>\n";
}
echo "\t</select></td></tr>\n";


function ifl($fl, $rrs)
{
	return "<input type=\"text\" value=\"".$rrs[$fl]."\" id=\"tx".str_replace(" ", "_", $fl)."\" class=\"frmsett\">";
}

echo "<tr><td class=\"tdl\">Address</td><td class=\"tdr\">".ifl("Address", $rs)."</td></tr>\n";
echo "<tr><td class=\"tdl\">City</td><td class=\"tdr\">".ifl("City", $rs)."</td></tr>\n";
echo "<tr><td class=\"tdl\">State/Province</td><td class=\"tdr\">";
if ($rs["Country"]=="United States")
{
	echo "<select name=\"slState\">\n";
	foreach ($state_list as $st)
	{
		echo "\t<option";
		if ($st==$rs["StateProv"])
		{
			echo " selected";
		}
		echo ">".$st."</option>\n";
	}
	echo "</select></td></tr>\n";
}
else
{
	echo ifl("StateProv", $rs);
}
echo "</td></tr>\n";

echo "<tr><td class=\"tdl\">Zip/Postal Code</td><td class=\"tdr\">".ifl("Zip", $rs)."</td></tr>\n";



echo "</table>";

?>