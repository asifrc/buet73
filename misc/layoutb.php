<?php //Bismillah
?>
<head>
<title>Class of '73</title>
<style type="text/css">
#content *
{
	/*color: #910101;	*/
	font-family: Georgia, "Times New Roman", Times, serif;
}
body
{
	background: #95A9B8 url(images/bg-gradient.png) 0 0 repeat-x;
}
h1, h2, h3
{
	color: #660000;
}
p
{
	color: #000000;
	text-indent: 1cm;
}
#d1
{
	width: 900px;
	background-color: #FFFFFF;
}
#imgheader
{
	text-align: right;
	padding: 0px;
	height: 97px;
	background-image: url('images/local/header013.png');
	background-position: "right top";
	background-repeat: no-repeat;
	margin: 0px;
}
#mainframe
{
	padding: 0px;
	height: 800px;
	border: 0px solid #00FF00;
}
#sidepanel
{
	width: 186px;
	height: 100%;
	background-color: #910101;
	background-image: url(images/local/sidepanelbg002.png);
	background-position: right;
	background-repeat: repeat-y;;
	float: left;
	border: 0px solid #000000;
	padding: 10px;
	padding-top: 0px;
	padding-bottom: 0px;
}
#content
{
	padding-left: 15px;
	padding-right: 15px;
	width: 664px;
	height: 100%;
	text-align: left;
	float: right;
	overflow: auto;

}
#footer
{
	background-color: #910101;
	color: #660000;
	text-align: center;
	padding: 5px;
}
.slinks
{
	display: block;
	color: #FFFFFF;
	text-decoration: none;
	height: 24px;
	width: 120px;
	padding-top: 5px;
	padding-bottom: 5px;
	text-align: center;
	font-family: Georgia, "Times New Roman", Times, serif;
}
.slinks:hover
{
	background-image: url('../images/linkbutton.png');
}
</style>
<script type="text/javascript">
	function g(x)
	{
		return document.getElementById(x);
	}
</script>
</head>
<body>
<div align="center" width="100%" style="border: 0px solid #000000;">
<div id="d1">
	<div id="imgheader"></div>
    <div id="mainframe" align="left">
        <div id="sidepanel" align="center">
        	<br>
        	<a class="slinks" href="#">Home</a><br>
            <a class="slinks" href="#">Bulletin</a><br>
            <a class="slinks" href="#">Events</a><br>
            <a class="slinks" href="#">About</a><br>
        </div>

	</div>
<?php
/*
    <div id="footer">Developed By Asif R. Choudhury
    </div>
*/
?>
</div>
</div>
</body>