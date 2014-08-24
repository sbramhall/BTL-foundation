/**
 * Created by sbramhall on 7/20/14.
 */
var btlJsApp;
btlJsApp = {


    // TODO: figure out how to make $ look defined for jquery within this class
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    /**
     * call helpers to retrieve page parts and data and render the page
     */
    renderPage_saved: function (showDate) {
        var self = this;
        var dataValues = {
            credit: '',
            quote: '',
            citation: '',
            ledeImageUrl: '',
            fullShowMp3: ''
        };
        $.when(
            self.getData("data/btl-" + showDate + ".xml"),
            self.getResourceDeferred('js/templates/main.handlebars'),
            self.getResourceDeferred('js/templates/menuTree.handlebars'),
            self.getResourceDeferred('js/templates/weeklyShow.handlebars')
        ).done(function (oneShowData, mainSource, menuSource, weeklyShowSource) {
                /* first build up the dataValues object with all properties */
                dataValues.quote = $(oneShowData).find('lead-quote').text();
                dataValues.citation = $(oneShowData).find('citation').text();
                dataValues.credit = $(oneShowData).find('credit').text();
                dataValues.ledeImageUrl = 'i/' + showDate + '-lede.jpg';
                /*console.log('renderPage values for dataValues is '+ JSON.stringify(dataValues));*/

                /* compile the HandleBars templates */
                var menuTemplate = Handlebars.compile(menuSource[0]);
                var mainTemplate = Handlebars.compile(mainSource[0]);
                var weeklyTemplate = Handlebars.compile(weeklyShowSource[0]);

                /* apply templates to index.html */
                $('#main-content').html(mainTemplate);
                $('#menuTree').html(menuTemplate);
                $('#btlShow').html(weeklyTemplate(dataValues));
                $(document).foundation();
            }
        )
    },
    fullPage: function () {
        var self = this;
        var serverPath = 'http://susan.btlonline.org/';
        var ledeHtml = '';
        var ledeXml = '';
        var segXmlA, segXmlAText = '';
        var segXmlB, segXmlBText = '';
        var segXmlC, segXmlCText = '';
        /*
        Custom deferred objects allow the function to wait for all to finish
        whether successfully or by failing
         */
        var da = $.Deferred();
        var db = $.Deferred();
        var dc = $.Deferred();
        var dd = $.Deferred();
        var de = $.Deferred();

        var dataValues = {

        };
        $.when(
            self.getResourceDeferred(serverPath + 'btlidx.html')
        ).done(function (btlidx) {

            var doc = $.parseHTML(btlidx);
            var content = ($(doc).filter("meta")).attr("content");
            var url = content.split('url=')[1];
            var currentShow = url.split("/")[2].split("-")[0];


            console.log('currentShow is ' + currentShow);

            a = $.when(self.getResourceDeferred(serverPath + 'html/' + currentShow + 'l.html')
                    .done(function (result) {
                        ledeHtml = result;
                        // console.log("got ledeHtml: " + ledeHtml)
                    })
                    .fail(function (result, errorType, errorDetail) {
                        ledeHtml = 'failed';
                        alert("error retrieving " + this.url + "Error type: " + errorType);
                        console.error("error retrieving " + this.url + "Error type: " + errorType);
                    })
                    .always(function () {
                        da.resolve();
                    })
            )
            ;
            b = $.when(self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'l.xml')
                    .done(function (ledeXmlresult) {
                        ledeXml = ledeXmlresult;
                        //console.log("got ledeXml: "+ledeXml);
                    })
                    .fail(function (ledeXml, errorType, errorDetail) {
                        ledeXml = 'failed';
                        console.error("error retrieving " + this.url + "Error type: " + errorType);
                    })
                    .always(function () {
                        db.resolve();
                    })
            );

            c = $.when(self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'a.xml')
                    .done(function (segAresult) {
                        segXmlA = segAresult;
                        //console.log("got segXmlA: " + segXmlA);
                    })
                    .fail(function (segAresult, errorType, errorDetail) {
                        segXmlA = 'failed';
                        console.error("error retrieving " + this.url + "Error type: " + errorType);
                        segXmlAText = segAresult.responseText;
                    })
                    .always(function () {
                        // resolve the deferred promise that the cumulative when is waiting on
                        dc.resolve();
                    })
            );
            d = $.when(self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'b.xml')
                    .done(function (segBresult) {
                        segXmlB = segBresult;
                        //console.log("got segXmlB: " + segXmlB);
                    })
                    .fail(function (segBresult, errorType, errorDetail) {
                        segBresult = 'failed';
                        console.error("error retrieving " + this.url + "Error type: " + errorType);
                        segXmlBText = segBresult.responseText;
                    })
                    .always(function () {
                        dd.resolve();
                    })
            );
            e = $.when(self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'c.xml')
                    .done(function (segCresult) {segXmlC = segCresult; })
                    .fail(function (segCresult, errorType, errorDetail) {
                        segXmlC = 'failed';
                        console.error("error retrieving " + this.url + "Error type: " + errorType);
                        segXmlCText = segCresult.responseText;
                        segCresult.resolve();
                    })
                    .always(function () {
                        de.resolve();
                    })
            );
            $.when(da, db, dc, dd, de).done(
                function () {
                    console.log("done with ajax requests.  ready to create page");
                    console.log("ledeHtml  state=" + a.state());
                    console.log("ledeXml  state=" + b.state());
                    console.log("segXmlA state=" + c.state());
                    console.log("segXmlB  state=" + d.state());
                    console.log("segXmlC state=" + e.state());
                    /*can process the data now.  phew!*/
                }
            );
        })
        ;


        return;
        /*
         Now fetch the lede elements and add to templates
         */
        function gotit(result) {
            myLede = ledel;
            console.log('good and ledel is ' + myLede);
        };
        function oops(result, errorType, errorDetail) {
            console.log('bad');
        };
        /*            $.when(
         ledel = self.getResourceDeferred(serverPath + 'html/' + currentShow + 'l.html'),
         self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'l.xml'),
         self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'a.xml' ),
         self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'b.xml' ),
         self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'c.xml' )
         ).done (gotit (ledeHtml,ledeXml,segA,segB,segC))
         .fail(oops(result ,errorType,errorDetail))*/

        /*                (gotit (ledeHtml,ledeXml,segA,segB,segC) {

         console.log('ledeHtml.isResolved: '+ ledeHtml.isResolved());
         console.log('ledeXml: ' + ledeXml );
         */
        /*    if (segA=== undefined)
         console.log('no got segA')*/
        /*;
         console.log('segA: ' + segA );
         console.log('segB: ' + segB );
         console.log('segC: ' + segC );
         }),
         (function (result ,errorType,errorDetail){
         //   var  defobj $.deferred;
         console.error("error retrieving "+this.url + "Error type: " +errorType );

         })*/
    },


    renderPage: function (showDate) {
        var self = this;
        var dataValues = {
            credit: '',
            quote: '',
            citation: '',
            ledeImageUrl: '',
            fullShowMp3: ''
        };
        $.when(
            self.getData("data/btl-" + showDate + ".xml"),
            self.getResourceDeferred('js/templates/main.handlebars'),
            self.getResourceDeferred('js/templates/menuTree.handlebars'),
            self.getResourceDeferred('js/templates/weeklyShow.handlebars')
        ).done(function (oneShowData, mainSource, menuSource, weeklyShowSource) {
                /* first build up the dataValues object with all properties */
                dataValues.quote = $(oneShowData).find('lead-quote').text();
                dataValues.citation = $(oneShowData).find('citation').text();
                dataValues.credit = $(oneShowData).find('credit').text();
                dataValues.ledeImageUrl = 'i/' + showDate + '-lede.jpg';
                /*console.log('renderPage values for dataValues is '+ JSON.stringify(dataValues));*/

                /* compile the HandleBars templates */
                var menuTemplate = Handlebars.compile(menuSource[0]);
                var mainTemplate = Handlebars.compile(mainSource[0]);
                var weeklyTemplate = Handlebars.compile(weeklyShowSource[0]);

                /* apply templates to index.html */
                $('#main-content').html(mainTemplate);
                $('#menuTree').html(menuTemplate);
                $('#btlShow').html(weeklyTemplate(dataValues));
                $(document).foundation();
            }
        )
    },
    /* helper for retrieving templates */
    getResourceDeferred: function (path) {
        /* the code below returns a promise object that is accessed in the .when statement */
        return $.ajax({
            url: path,
            cache: true
        })
    },
    getUrlDate: function (pUrl) {
        $.ajax({

            url: pUrl,
            success: function (result, status, xhr) {
                // console.log(xhr.getResponseHeader('Location'));
                var doc = $.parseHTML(result);
                var content = ($(doc).filter("meta")).attr("content");
                var url = content.split('url=')[1];
                var urlPrefix = url.split("/")[2].split("-")[0];
                console.log('urlPrefix is ' + urlPrefix);
                return url.split("/")[2].split("-")[0];

            }
        });
    },

    testGetXml: function (pUrl) {
        /*    var self = this;
         var output = '';
         $.when(
         self.getData("http://susan.btlonline.org/xml/btlidx.html")).done(
         function () {
         console.log('location was ');
         }*/

        $.ajax({

            url: pUrl,
            success: function (result, status, xhr) {
                console.log(xhr.getResponseHeader('Location'));
                var doc = $.parseHTML(result);
                var content = ($(doc).filter("meta")).attr("content");
                var url = content.split('url=')[1];
                var urlPrefix = url.split("/")[2].split("-")[0];
                //var path = url.substr(0, url.indexOf(urlPrefix));
                console.log('urlPrefix is ' + urlPrefix);
                return url.split("/")[2].split("-")[0];

            }

        });

    },

    /* helper for getting data values */
    getData: function (url) {
        return $.ajax({
            type: "GET",
            dataType: "xml",
            url: url
        })
    }
};

