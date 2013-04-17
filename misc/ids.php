<? //Bismillah
$a = $_GET["a"];
$b = $_GET["b"];
if ($a==""||$b=="")
{
	die("Please enter parameters a and b.");
}
?>
<head>
<title>Names and Photos</title>
<style type="text/css">
iframe
{
	width: 200px;
	height: 100px;
}
img
{
	height: 100px;
}
</style>
<script type="text/javascript">
	function g(x)
	{
	    return document.getElementById(x);
	}
	function d(x)
	{
/*	    if (!g("i"+x).complete)
	    {
	        g("t"+x).style.display = "none";
	    }
*/
        g("t"+x).style.display = "none";

	}
</script>
</head>
<body>
<table>
<?
for ($i=$a; $i<$b; $i++)
{
	?>
	<tr id="t<? echo $i; ?>">
	    <td><iframe src="https://piperline.hamline.edu/pls/prod/hamutil.P_Profile?pidm=<? echo $i; ?>"></iframe></td>
	    <td><img src="https://piperline.hamline.edu/pls/prod/hamutil.P_IDPhotoData?pidm=<? echo $i; ?>" id="i<? echo $i; ?>" onerror="d(<? echo $i; ?>);"></td>
	</tr>
	<?
}
?>
</table>
</body>
