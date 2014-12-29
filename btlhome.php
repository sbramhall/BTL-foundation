<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"
	"http://www.w3.org/TR/REC-html40/loose.dtd">
<!-- $Id$ -->
<html>
<head>
<title>redirect to appropriate page</title>
<?
	$showdate = "150102";

	$showpath = "20" . substr($showdate, 0, 2) . "/$showdate-btl.html";
	if (($pi=pathinfo(__FILE__,PATHINFO_FILENAME)) && $pi != "index")
		print "<meta http-equiv=\"refresh\" content=\"0; url=http://btlonline.org/$showpath\">\n";
	else {	# Here's where device detection is done.
				# If on a non-mobile device, do the same as above
		print "btlhome device detection must be done on this page\n";
	}
?>
</head>
<body>
</body>
</html>
