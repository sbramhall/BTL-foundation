<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"
	"http://www.w3.org/TR/REC-html40/loose.dtd">
<!-- $Id: index.php,v 1.3 2015/01/22 18:35:03 btlswp10 Exp btlswp10 $ -->
<html>
<head>
<?
require_once 'php/showdate.php';
require_once 'php/Mobile_Detect.php';
$detect = new Mobile_Detect;
$showpath = "http://btlonline.org/20" . substr($showdate, 0, 2) . "/$showdate-btl.html";

// redirect to appropriate page
	//if ($detect->isMobile() && !$detect->isTablet())
	if ($detect->isMobile())
		require_once 'php/js-setup.php';
	else
		print<<<END2
	<meta http-equiv="refresh" content="0; url=$showpath">

END2;
?>
</head>
<body></body>
</html>
