<?php //Bismillah
?>
<!DOCTYPE html>
<html>
<head>
<title>Class of '73</title>
<link href="styles/global.css" rel="stylesheet" type="text/css">
<style type="text/css">
	#dvmap
	{
		height: 500px;
	}
</style>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaxjhAKVjV6_M25zz9qQTa6CYdiOe3b9I&sensor=false">
    </script>
<script type="text/javascript">
	var map;
	var lat;
	function g(x)
	{
		return document.getElementById(x);
	}
	function init()
	{
        var mapOptions = {
          center: new google.maps.LatLng(44.0579840, -103.2649430),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("dvmap"),
            mapOptions);
	}
	function addmarker(lat,lng,tip,txt)
	{
		var latlng = new google.maps.LatLng(lat,lng);
		var info = new google.maps.InfoWindow({
			content: txt
		});
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: tip
		});
		google.maps.event.addListener(marker, 'click', function() {
		  info.open(map,marker);
		});
	}
	function addthree()
	{
		h = "["+
"				{"+
"					'tip' : 'Tustin, CA',"+
"					'txt' : '1990-1997',"+
"					'lat' : 33.7330070,"+
"					'lng' : -117.81118980"+
"				},"+
"				{"+
"					'tip' : 'Rapid City, SD',"+
"					'txt' : '1997-2009',"+
"					'lat' : 44.0579840,"+
"					'lng' : -103.2649430"+
"				},"+
"				{"+
"					'tip' : 'St Paul, MN',"+
"					'txt' : '2008-2012',"+
"					'lat' : 44.9659360,"+
"					'lng' : -93.167570"+
"				},"+
"				{"+
"					'tip' : 'Pleasant Prairie, WI',"+
"					'txt' : '2009-2012',"+
"					'lat' : 42.55674090,"+
"					'lng' : -87.9066245"+
"				}"+
"			]";
		hh = eval(h)
		for (i=0; i<hh.length; i++)
		{
			addmarker(hh[i].lat, hh[i].lng, hh[i].tip, hh[i].txt);
		}
	}
			
	function ld()
	{
		var myLatlng = new google.maps.LatLng(44.0579840, -103.2649430);
		lat = myLatlng;
		var contentString = '<div id="ccontent">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h2 id="firstHeading" class="firstHeading">Uluru</h2>'+
			'<div id="bodyContent">'+
			'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
			'sandstone rock formation in the southern part of the '+
			'Northern Territory, central Australia. It lies 335 km (208 mi) '+
			'south west of the nearest large town, Alice Springs; 450 km '+
			'(280 mi) by road. Kata Tjuta and Uluru are the two major '+
			'features of the Uluru - Kata Tjuta National Park. Uluru is '+
			'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
			'Aboriginal people of the area. It has many springs, waterholes, '+
			'rock caves and ancient paintings. Uluru is listed as a World '+
			'Heritage Site.</p>'+
			'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
			'http://en.wikipedia.org/w/index.php?title=Uluru</a> (last visited June 22, 2009).</p>'+
			'</div>'+
			'</div>';
		
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title:"2526 Tomahawk Dr"
		});
		
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.open(map,marker);
		});
	}
</script>
</head>
<body onload="init();">
<?php
include('head.php');
?>
<div id="content">
	<div id="dvmap"></div>
    <button onclick="addthree();">Add Points</button>
</div>
<?php
include('foot.php');
?>
</body>
</html>