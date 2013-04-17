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
				$.get("ids4_ajax.php", { "a": $('#pid').val() }, function (data) {
						$(data).prependTo($('#resp'));
						$('#curr').html($('#pid').val());
						$('#pid').val(parseInt($('#pid').val())+1);
						$('#next').click();
					});
			});
		$('#pid').keypress(function(e) {
			if(e.which == 13)
			{
				$('#next').click();
			}
		});
	});
</script>
<span id="curr">800000</span><input type="text" id="pid" value="800000"><button id="next">Start</button>
<div id="resp">
</div>
</body>
