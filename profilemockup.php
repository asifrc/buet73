<?php //Bismillah
include('conn.php');
?>
<head>
<title>Class of '73</title>
<link href="styles/global.css" rel="stylesheet" type="text/css">
<link href="styles/jqueryui.css" rel="stylesheet" type="text/css">
<style type="text/css">
/*
.ui-tabs { direction: rtl; }
.ui-tabs .ui-tabs-nav li.ui-tabs-selected,
.ui-tabs .ui-tabs-nav li.ui-state-default {float: right; }
.ui-tabs .ui-tabs-nav li a { float: right; }
*/
#picbox
{
	width: 200px;
}
#profbox
{
	width: 450px;
}
#upperbox
{
	margin: 20px 0px 25px 0px;
}
</style>
<script type="text/javascript" src="scripts/global.js"></script>
<script type="text/javascript" src="scripts/jquery.js"></script>
<script type="text/javascript" src="scripts/jqueryui.js"></script>
<script type="text/javascript">
</script>
</head>
<body>
<?php
include('head.php');
?>
<script type="text/javascript">
	$(function() {
		$( "#profbox" ).tabs( "option", "heightStyle", "fill" );
		$('#profbox').css('border', '0px');
	});
</script>
        <div id="content">
        	<h2 align="center" style="marginal-bottom: 0px;">Mahbubur Choudhury</h2>
        	<div id="upperbox">
                <div id="picbox" class="fll">
                    <img src="misc/abbu.jpg">
                </div>
                <div class="flr" style="height: 300px;">
                    <div id="profbox" class="jqtabs">
                        <ul>
                            <li><a href="#tbcontact">Contact Info</a></li>
                            <li><a href="#tbfamily">Family</a></li>
                            <li><a href="#tbcareer">Career</a></li>
                            <li><a href="#tbmemories">Memories</a></li>
                            <li><a href="#tbphotos">Photos</a></li>
                        </ul>
                        <div id="tbcontact">
                            Birthday
                            Address
                            City
                            Zip
                            State/Province
                            Country
                            
                            AssetTable
                            Home Phone
                            Cell Phone
                            
                            FromUser
                            Email
                            FBID
                        </div>
                        <div id="tbfamily">
                            AssetTable
                            Spouse
                            Children
                            Grandchildren
                            
                            MemberBio
                            
                            MemberRelStat
                            
                            
                            FamilyPhoto
                            
                            MemberPhoto                
                        </div>
                        <div id="tbcareer">
                            Description
                            
                            AssetTable
                            Position
                            Company
                            TimeSpan
                            OrderID
                        </div>
                        <div id="tbmemories">
                            Description                    
                            ShoutWhisper Table
                        </div>
                        <div id="tbphotos">
                            Photo Album System Goes Here
                        </div>
                    </div>
                </div>
			</div>
        </div>
<?php
include('foot.php');
?>
</body>