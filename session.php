<?php //Bismillah

session_start();
if (isset($_GET['n']))
{
	$_SESSION[$_GET['n']] = $_GET['v'];
	echo $_GET['n']."=".$_GET['v'];
	print_r($_SESSION);
}
else
{
	session_destroy();
	echo "Session Destroyed";
}
/*
$file_path = "graphic";
echo substr($file_path, strrpos($file_path, "."));*/
?>
