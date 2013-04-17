<?php //Bismillah
session_start();
session_destroy();
header("Location: http://".$_SERVER['HTTP_HOST']);
?>