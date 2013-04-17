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
	width: 400px;
	height: 200px;
}

</style>
<script type="text/javascript" src="../scripts/jquery.js"></script>
</head>
<body>
<script type="text/javascript">
$(function() {
		$('#next').click( function() {
				$('#ifr').attr('src', 'https://piperline.hamline.edu/pls/prod/hamutil.P_Profile?pidm='+$('#pid').val());
				$('#im').attr('src', 'https://piperline.hamline.edu/pls/prod/hamutil.P_IDPhotoData?pidm='+$('#pid').val());
				$('#curr').html($('#pid').val());
				$('#pid').val(parseInt($('#pid').val())+1);
			});
		$('#pid').keypress(function(e) {
			if(e.which == 13)
			{
				$('#next').click();
			}
		});
	});
</script>
<span id="curr">800000</span><input type="text" id="pid" value="800000"><button id="next">Next</button>
<img id="im">
<iframe id="ifr">

</iframe>
</table>
</body>
