<?php //Bismillah
/*
Login Form to be BOTH phpINCLUDEd and AJAXed
*/
?>
                            <div><input id="lboxemail" class="uiw lboxinput" type="text" placeholder="Email Address"></div>
                            <div><input id="lboxpw" class="uiw lboxinput" type="password" placeholder="Password"></div>
                            <div class="fll"><button id="btnlogin" class="jqbtn">Login</button></div>
                            <div class="lboxforgot"><a href="forgot.php">Forgot Password</a></div>
                            <div style="padding-left: 50px;">
                                <div class="lboxfb">
                                <?php 
                                /*
                                    <div style="display: none;" class="fb-login-button" data-show-faces="true" data-scope="email" data-size="large" data-width="300" data-max-rows="2" data-height="50px">Log In with Facebook</div>
                                */
                                include('loginbox_fbbtn.php');
                                ?>
                                </div>
                                <div><button class="jqbtn lboxsup"><strong>Sign Up with Email</strong></button></div>
                            </div>
                            <span id="fbstats"></span>