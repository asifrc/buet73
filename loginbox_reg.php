<?php //Bismillah
include('conn.php');
/*
Registers users from the signup form in loginbox.php
Recieves AJAX via POST
Return Values:
	Success: user was successfully registered
	[Error]: returns error to display in errmsg
*/


//Secure Field Array: ensures only listed fields are saved to db
$f = array('Email','Password','FirstName','LastName','DisplayName','Department','Country','fbid');

//Check for POST
if (!isset($_POST))
{
	die("<strong>Error:</strong>&nbsp;No data received");
}
$p = $_POST;
//Check for required/valid info
$fx = true;
foreach($f as $v)
{
	if (!isset($p[$v]))
	{
		$fx = false;
	}
}
if (!$fx)
{
	die("<strong>Error:</strong>&nbsp;Incomplete Data");
}
//Check to see if email is already taken
$sql = "Select Count(*) as `cnt` From `users` Where `Email`=\"".$p['Email']."\";";
$rsc = mysql_fetch_array(mysql_query($sql));
if ($rsc['cnt']!="0")
{
	die("<strong>Email Already Used:</strong><br>This email has already been registered");
}
//Check if FBID is already taken, Should never happen as a registered fb user shouldn't see the registration page
if ($p['fbid']!="")
{
	$sql = "Select Count(*) as `cnt` From `users` Where `fbid`=\"".$p['fbid']."\";";
	$rsc = mysql_fetch_array(mysql_query($sql));
	if ($rsc['cnt']!="0")
	{
		die("<strong>Facebook Already Used:</strong><br>Your Facebook account is already associated with an account");
	}
}
//Save to database
$sql = "Insert Into `users` (";
$sqln = "";
$sqlv = "";
$cma = "";
//Hash password
$p['Password'] = md5(strtolower($p['Password']));
//Loop through fields and add to sql query
foreach ($f as $k)
{
	$sqln .= $cma."`".$k."`";
	$sqlv .= $cma."\"".$p[$k]."\"";
	$cma = ", ";
}
$sql .= $sqln.") Values (".$sqlv.");";
if (!mysql_query($sql))
{
	die("<strong>Database Error:</strong><br>".mysql_error());
}
//Log New User In
$sql = "Select * From `users` Where `Email`=\"".$p['Email']."\";";
$rsu = mysql_fetch_array(mysql_query($sql));
$_SESSION['uid'] = $rsu['id'];
echo "Success";
?>