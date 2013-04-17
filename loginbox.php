<?php //Bismillah
//Show Loginbox if not logged in
if (!$uid)
{
?>
<!-- Login Box -->
        	<div class="lbox uiw">       
                <div class="ui-widget">
                    <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix" unselectable="on" style="padding: 5px; margin: 2px;">
                        <span class="ui-dialog-title" id="lboxtitle" unselectable="on">Login</span>
                    </div>
                    <div class="lboxinner">
                    	<div id="posLbox" class="ui-widget">
                            <div class="ui-state-highlight ui-corner-all">
                                <span class="ui-icon ui-icon-info" style="float: left; margin-right: 10px;"></span>
                                <span id="posLboxmsg" class="blktxt"></span>
                            </div>
                        </div>
                        <div id="errLbox" class="ui-widget">
                            <div class="ui-state-error ui-corner-all">
                                <span class="ui-icon ui-icon-alert" style="float: left; margin-right: 10px;;"></span>
                                <span id="errLboxmsg" class="blktxt"></span>
                            </div>
                        </div>
                        <div class="lboxlbox">
							<div><input id="lboxemail" class="uiw lboxinput lboxlitx" type="text" placeholder="Email Address"></div>
                            <div><input id="lboxpw" class="uiw lboxinput lboxlitx" type="password" placeholder="Password"></div>
                            <div class="fll"><button id="btnlogin" class="jqbtn">Login</button></div>
                            <div class="lboxforgot"><a href="forgot.php">Forgot Password</a></div>
                            <div style="padding-left: 50px;">
                                <div class="lboxfb">
                                	<?php
										include('loginbox_fbbtn.php');
                                	?>
                                </div>
                                <div><button class="jqbtn lboxsup" id="btnsuwe"><strong>Sign Up with Email</strong></button></div>
                            </div>
                            <span id="fbstats"></span>
						</div>
                        <div class="lboxrbox">
                        	<fieldset style="border: 0px;">
                                <div><input id="lboxremail" class="uiw lboxinput" type="text" placeholder="Email Address"></div>
                                <div><input id="lboxrpw" class="uiw lboxinput" type="password" placeholder="Create Password"></div>
                                <div><input id="lboxrcpw" class="uiw lboxinput" type="password" placeholder="Confirm Password"></div>
                            </fieldset>
                            <fieldset style="border: 0px;">
                                <div><input id="lboxrfn" class="uiw lboxinput" type="text" placeholder="First Name"></div>
                                <div><input id="lboxrln" class="uiw lboxinput" type="text" placeholder="Last Name"></div>
                                <div><input id="lboxrdn" class="uiw lboxinput" type="text" placeholder="Display Name"></div>
							</fieldset>
                            <fieldset style="border: 0px;">
                                <div>
									<select id="lboxrdept" class="uiw lboxinput">
										<option selected>-- Choose Department --</option>
										<?php
										//Department Dropdown
										$dep[0] = "Architecture";
										$dep[1] = "Civil Engineering";
										$dep[2] = "Chemical Engineering";
										$dep[3] = "Electrical Engineering";
										$dep[4] = "Mechanical Engineering";
										$dep[5] = "Metallurgical Engineering";
										$dep[6] = "Naval Architecture";
										foreach ($dep as $d)
										{
											echo "\t\t<option>".$d."</option>\n";
										}
										?>
									</select>
</div>
                                <div>
                                	<select class="uiw lboxinput" id="lboxrcountry">
                                    	<option selected>-- Choose Country --</option>
										<?php
                                        //Country dropdown
                                        include("inc_countries.php");
                                        foreach ($country_list as $c)
                                        {
                                            echo "\t\t<option>".$c."</option>\n";
                                        }
                                        echo "</select>";
                                        ?>
                                    </select>
								</div>
                                <input id="lboxrfbid" type="hidden">
                            </fieldset>
                            <div style="padding-left: 50px;"><button class="jqbtn lboxsup" id="btnsup"><strong>Sign Up</strong></button></div>
                            <div><p align="center"><a id="btncanreg" href="#" style="padding-right: 40px;">Cancel</a></p></div>
						</div>
                    </div>
				</div>
			</div>
<script type="text/javascript">
$( function() {
	//Hide Message Containers
	$('#posLbox').hide();
	$('#errLbox').hide();
	//Hide Regbox
	$('.lboxrbox').hide();
	
	//Submit Login on enterpress
	$('.lboxlitx').keypress(function(e) {
			if(e.which == 13)
			{
				$('#btnlogin').click();
			}
		});
	
	//Autoload Display Name if blank
	$('#lboxrln').blur(function() {
			if ($('#lboxrdn').val()=="")
			{
				$('#lboxrdn').val($('#lboxrfn').val()+" "+$('#lboxrln').val());
			}
		});
	
	//Login Button Click
	$('#btnlogin').click(function() {
		$('#posLbox').hide();
		$('#errLbox').hide();
		$.post("loginbox_lrequest.php", {
				"Email": $('#lboxemail').val(),
				"Password": $('#lboxpw').val()
			}, function(data) {
				if (data!="Success")
				{
					$('#errLboxmsg').html(data);
					$('#errLbox').show('shake');
				}
				else
				{
					window.location.href = "edit.php";
				}
			});
		});
	
	//Login with Facebook Button Click	
	$('#fbbtn01').click(function() {
			FB.login(function(response) {
					if (response.authResponse)
					{
     					var access_token =   FB.getAuthResponse()['accessToken'];
						FB.api('/me', function(data) {
								$.get('loginbox_fbrequest.php', { "fbid": data.id, "token": access_token }, function(rstat) {
										switch(rstat)
										{
											case "LoggedIn":
											{
												window.location.href = "edit.php";
												break;
											}
											case "NeedReg":
											{
												FB.api('/me', function(fbu) {
														//Hide err containers
														$('#posLbox').hide();
														$('#errLbox').hide();
														//Prefill Form
														$('#lboxremail').val(fbu.email);
														$('#lboxrfn').val(fbu.first_name);
														$('#lboxrln').val(fbu.last_name);
														$('#lboxrdn').val(fbu.name);
														$('#lboxrfbid').val(fbu.id);
														$('#lboxtitle').html("Register");
														$('.lboxlbox').slideUp(400, function() {
																$('.lboxrbox').slideDown(400, function() {$('#lboxrpw').focus();});
															});
													});
												break;
											}
											default:
											{
												$('#errLboxmsg').html(rstat);
												$('#errLbox').show('shake');
											}
										}
									});
							});
					}
				}, {scope: 'email'});
		});
	
	//Sign Up with Email Click
	$('#btnsuwe').click(function() {
			$('#posLbox').hide();
			$('#errLbox').hide();
			$('#lboxtitle').html("Register");
			$('.lboxlbox').slideUp(400, function() {
					$('.lboxrbox').slideDown();
				});
		});
	//Sign Up Click: Attempt to register new user
	$('#btnsup').click(function() {
			var frmval = true;
			//On validation error, display error message
			valerr = function(el, tx) {
				frmval = false;
				$('#errLboxmsg').html(tx);
				$('#errLbox').show('shake');
				$(el).focus();
			}
			//Check for blank fields
			var valem = ['email','pw','fn','ln','dn'];
			var valems = ["Email", "Password", "First Name", "Last Name", "Display Name"];
			var empstr = "";
			for (var i = 0; i < valem.length; i++)
			{
				if ($('#lboxr'+valem[i]).val()=="")
				{
					valerr('#lboxr'+valem[i], "The "+valems[i]+" field cannot be blank");
					return false;
				}
			}
			//Check for valid email
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			if (!emailReg.test($('#lboxremail').val()))
			{
				valerr('#lboxremail',"Please provide a valid email");
			}
			//Check for matching passwords
			if ($('#lboxrpw').val()!=$('#lboxrcpw').val())
			{
				valerr('#lboxrcpw', "Your passwords do not match");
			}
			//Check if a department department is selected
			if ($('#lboxrdept').val()=="-- Choose Department --")
			{
				valerr('#lboxrdept', "Please select your department at BUET");
			}	
			//Check if a country is selected
			if ($('#lboxrcountry').val()=="-- Choose Country --")
			{
				valerr('#lboxrcountry', "Please select your country of residence");
			}
			//Send form if client-side validation passes
			if (frmval)
			{
				$.post("loginbox_reg.php", {
					"Email": $('#lboxremail').val(),
					"Password": $('#lboxrpw').val(),
					"FirstName": $('#lboxrfn').val(),
					"LastName": $('#lboxrln').val(),
					"DisplayName": $('#lboxrdn').val(),
					"Department": $('#lboxrdept').val(),
					"Country": $('#lboxrcountry').val(),
					"fbid": $('#lboxrfbid').val()
					}, function(data) {
						if (data!="Success")
						{
							$('#errLboxmsg').html(data);
							$('#errLbox').show('shake');
						}
						else
						{
							window.location.href = "edit.php";
						}
					});
			}
		});
	//Cancel Registration
	$('#btncanreg').click(function() {
			$('#posLbox').hide();
			$('#errLbox').hide();
			$('#lboxtitle').html("Login");
			$('.lboxrbox').slideUp(400, function() {
					$('.lboxlbox').slideDown();
				});
			$('#lboxremail').val(fbu.email);
			$('#lboxrfn').val("");
			$('#lboxrln').val("");
			$('#lboxrdn').val("");
			$('#lboxrfbid').val("");
		});
});
</script>
<?php
}
?>