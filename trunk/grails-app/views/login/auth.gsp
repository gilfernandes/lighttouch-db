<head>
<meta name='layout' content='main' />
<title><g:message code="springSecurity.login.title" /></title>
<style type='text/css' media='screen'>
#login {
	margin:15px 0px; padding:0px;
	text-align:center;
	position:absolute; top:50%;
	height:240px;
	margin-top:-120px; /* negative half of the height used to centre vertically */
	width: 100%;
}
#login .inner {
	background-color: #EEEEFF;
    background: #b8e1fc; /* Old browsers */
    background: #ebf1f6; /* Old browsers */
    background: -moz-linear-gradient(top, #ebf1f6 0%, #abd3ee 50%, #89c3eb 51%, #d5ebfb 100%); /* FF3.6+ */
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ebf1f6), color-stop(50%,#abd3ee), color-stop(51%,#89c3eb), color-stop(100%,#d5ebfb)); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(top, #ebf1f6 0%,#abd3ee 50%,#89c3eb 51%,#d5ebfb 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(top, #ebf1f6 0%,#abd3ee 50%,#89c3eb 51%,#d5ebfb 100%); /* Opera 11.10+ */
    background: -ms-linear-gradient(top, #ebf1f6 0%,#abd3ee 50%,#89c3eb 51%,#d5ebfb 100%); /* IE10+ */
    background: linear-gradient(top, #ebf1f6 0%,#abd3ee 50%,#89c3eb 51%,#d5ebfb 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ebf1f6', endColorstr='#d5ebfb',GradientType=0 ); /* IE6-9 */
    border-radius: 15px 15px 15px 15px;
    box-shadow: 2px 5px 8px #99BBDD;
    margin: 0 auto;
    padding: 10px;
    text-align: left;
    width: 260px;
}
#login .inner .fheader {
	padding:4px;margin:3px 0px 3px 0;color:#2e3741;font-size:14px;font-weight:bold;
}
#login .inner .cssform p {
	clear: left;
	padding: 5px 0 0px 0;
	padding-left: 105px;
	border-top: 1px dashed gray;
	margin: 2px 0 2px 0;
	height: 1%;
}

#login .inner .cssform input[type='text'] {
	width: 120px;
}

#login .inner .cssform input[type='submit'] {
	margin: 10px 0 0 0;
	padding: 5px 15px;
}

#login .inner .cssform input[type='submit']:hover {
	background-color: #3388ee;
	color: white;
}

#login .inner .cssform label {
	font-weight: bold;
	float: left;
	margin-left: -105px;
	width: 100px;
}
#login .inner .login_message {color:red;}
#login .inner .text_ {width:120px;}
#login .inner .chk {height:12px;}
</style>
</head>

<body>
	<div id='login'>
		<div class='inner'>
			<g:if test='${flash.message}'>
			<div class='login_message'>${flash.message}</div>
			</g:if>
			<div class='fheader'><g:message code="springSecurity.login.header" /></div>
			<form action='${postUrl}' method='POST' id='loginForm' class='cssform' autocomplete='off'>
				<p>
					<label for='username'><g:message code="springSecurity.login.username.label" /></label>
					<input type='text' class='text_' name='j_username' id='username' />
				</p>
				<p>
					<label for='password'><g:message code="springSecurity.login.password.label" /></label>
					<input type='password' class='text_' name='j_password' id='password' />
				</p>
				<p>
					<label for='remember_me'><g:message code="springSecurity.login.remember.me.label" /></label>
					<input type='checkbox' class='chk' name='${rememberMeParameter}' id='remember_me'
					<g:if test='${hasCookie}'>checked='checked'</g:if> />
				</p>
				<p>
					<input type='submit' value='${message(code: "springSecurity.login.button")}' />
				</p>
			</form>
		</div>
	</div>
<script type='text/javascript'>
<!--
(function(){
	document.forms['loginForm'].elements['j_username'].focus();
})();
// -->
</script>