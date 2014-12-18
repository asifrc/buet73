<?php //Bismillah
error_reporting(E_ALL);
echo "Bismillah";
mysql_connect('localhost', 'root', 'devpassword');
phpinfo();
if (!$conn) {
  echo "Couldn't connect";
}
echo "Connected to Database! :)";
phpinfo();
?>
