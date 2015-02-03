<!-- $Id: js-setup.php,v 1.1 2015/01/22 18:35:34 btlswp10 Exp btlswp10 $ -->
<?
print<<<END1
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<title>Mobile friendly BTL | Welcome</title>
	<link href='http://fonts.googleapis.com/css?family=Alegreya+Sans'
	 rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/foundation.css"/>
	<link rel="stylesheet" href="css/app.css"/>
	<script src="js/vendor/modernizr.js"></script>
	<script src="phonegap.js"></script>
	<script src="js/vendor/handlebars-v1.3.0.js"></script>
	<script src="js/vendor/jquery.js"></script>
	<script src="js/foundation.min.js"></script>
	<script src="js/vendor/jquery.expander.js"></script>
	<script src="js/btl-main.js"></script>
</head>
<body>

<div id="main-content">
	<!--empty div for page content from main template -->
</div>

<script>
	btlJsApp.renderPage('$showdate');
</script>
END1;
?>
