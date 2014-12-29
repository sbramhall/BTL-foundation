<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"
    "http://www.w3.org/TR/REC-html40/loose.dtd">
<!-- $Id: index.php,v 1.1 2014/12/07 18:20:30 btlswp10 Exp btlswp10 $ -->
<html>
<head>
    <title>redirect to appropriate page</title>
    <?php
    /**
     * Created by PhpStorm.
     * User: sbramhall
     * Date: 12/28/14
     * Time: 11:58 AM
     */

// These lines are mandatory.
require_once 'php/Mobile_Detect.php';
$detect = new Mobile_Detect;

    $showdate = "150102";

    $showpath = "20" . substr($showdate, 0, 2) . "/$showdate-btl.html";
    if (($pi = pathinfo(__FILE__, PATHINFO_FILENAME)) && $pi != "index")
        print "<meta http-equiv=\"refresh\" content=\"0; url=http://btlonline.org/$showpath\">\n";
    else {    # Here's where device detection is done.
        # If on a non-mobile device, do the same as above
        // Basic detection.
        $detect->isMobile();
        $detect->isTablet();
        if ($detect->isMobile() && !$detect->isTablet()) {
            print "<meta http-equiv=\"refresh\" content=\"0; url=index.html\">\n";
        }
        else
            print "<meta http-equiv=\"refresh\" content=\"0; url=http://btlonline.org/$showpath\">\n";
        // print "index device detection must be done on this page\n";

    }
    ?>
</head>
<body>
</body>
</html>
