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
    renderPage: function (serverPath, showDate) {
        $ = jQuery;
        var self = this;
        var pageShowDate = {
            showDate: showDate
        };
        var dataValues = {
            credit: '',
            quote: '',
            citation: '',
            ledeImageUrl: '',
            fullShowMp3: ''
        };
        var menuValues = {
            menuPath: 'http://btlonline.org'
        };
        $.when(self.getUrlDate(serverPath, pageShowDate))
            .done(function () {
                console.log("show date passed in =" + showDate + "; local pageShowDate property =" + pageShowDate.showDate);
                $.when(
                    self.getData("data/btl-" + pageShowDate.showDate + ".xml"),
                    self.getResourceDeferred('js/templates/main.handlebars'),
                    self.getResourceDeferred('js/templates/menuTree.handlebars'),
                    self.getResourceDeferred('js/templates/weeklyShow.handlebars'),
                    self.getShowData(pageShowDate.showDate)
                ).done(function (oneShowData, mainSource, menuSource, weeklyShowSource, showData) {
                        /* first build up the dataValues object with all properties */
                        dataValues.quote = $(oneShowData).find('lead-quote').text();
                        dataValues.citation = $(oneShowData).find('citation').text();
                        dataValues.credit = $(oneShowData).find('credit').text();
                        dataValues.ledeImageUrl = 'i/' + pageShowDate.showDate + '-lede.jpg';
                        /*console.log('renderPage values for dataValues is '+ JSON.stringify(dataValues));*/

                        /* compile the HandleBars templates */
                        var mainTemplate = Handlebars.compile(mainSource[0]);
                        var menuTemplate = Handlebars.compile(menuSource[0]);
                        var weeklyTemplate = Handlebars.compile(weeklyShowSource[0]);

                        /* apply templates to index.html */
                        $('#main-content').html(mainTemplate);
                        $('#menuTree').html(menuTemplate(menuValues));
                        $('#btlShow').html(weeklyTemplate(dataValues));
                        $(document).foundation();
                    }
                )
            })
            .fail(function () {
            alert("The urlDate function failed - this should never happen.");
        })
    },
    getShowData: function (currentShow) {
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


        console.log('currentShow is ' + currentShow);

        a = $.when(self.getResourceDeferred(serverPath + 'html/' + currentShow + 'l.html')
                .done(function (result) {
                    ledeHtml = result;
                    // console.log("got ledeHtml: " + ledeHtml)
                })
                .fail(function (result, errorType) {
                    ledeHtml = 'failed';
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
                .fail(function (ledeXml, errorType) {
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
                .fail(function (segAresult, errorType) {
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
                })
                .fail(function (segBresult, errorType) {
                    segBresult = 'failed';
                    console.error("error retrieving " + this.url + "Error type: " + errorType);
                    segXmlBText = segBresult.responseText;
                })
                .always(function () {
                    dd.resolve();
                })
        );
        e = $.when(self.getResourceDeferred(serverPath + 'xml/' + currentShow + 'c.xml')
                .done(function (segCresult) {
                    segXmlC = segCresult;
                })
                .fail(function (segCresult, errorType) {
                    segXmlC = 'failed';
                    console.error("error retrieving " + this.url + "Error type: " + errorType);
                    segXmlCText = segCresult.responseText;
                })
                .always(function () {
                    de.resolve();
                })
        );
        return $.when(da, db, dc, dd, de).done(
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
        ;


    },

  /*  renderPage_old: function (showDate) {
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
                *//* first build up the dataValues object with all properties *//*
                dataValues.quote = $(oneShowData).find('lead-quote').text();
                dataValues.citation = $(oneShowData).find('citation').text();
                dataValues.credit = $(oneShowData).find('credit').text();
                dataValues.ledeImageUrl = 'i/' + showDate + '-lede.jpg';
                *//*console.log('renderPage values for dataValues is '+ JSON.stringify(dataValues));*//*

                *//* compile the HandleBars templates *//*
                var menuTemplate = Handlebars.compile(menuSource[0]);
                var mainTemplate = Handlebars.compile(mainSource[0]);
                var weeklyTemplate = Handlebars.compile(weeklyShowSource[0]);

                *//* apply templates to index.html *//*
                $('#main-content').html(mainTemplate);
                $('#menuTree').html(menuTemplate);
                $('#btlShow').html(weeklyTemplate(dataValues));
                $(document).foundation();
            }
        )
    },*/

    /* helper for retrieving templates */
    getResourceDeferred: function (path) {
        /* the code below returns a promise object that is accessed in the .when statement */
        console.log("getResourceDeferred fetching " + path);
        return $.ajax({
            url: path,
            cache: true
        })
    },
    getUrlDate: function (serverPath, showDateObj) {
        var self = this;
        /*
         1. declare a local deferred object that will be returned as a promise
         2. if no date is passed in then create a promise based on retrieving the idx file
         and return that.  It will be resolved after the ajax call succeeds or fails
         3. otherwise just resolve the promise immediately
         */
        var currentShow = $.Deferred();
        if (showDateObj.showDate === undefined) {
            console.log("getUrlDate fetching " + serverPath + '/btlidx.txt');
            getIdx = $.when(
                (self.getResourceDeferred(serverPath + '/btlidx.txt'))
                    .done(function (result) {
                        var doc = $.parseHTML(result);
                        var content = ($(doc).filter("meta")).attr("content");
                        var url = content.split('url=')[1];
                        showDateObj.showDate = url.split("/")[2].split("-")[0];

                        //showDate = url.split("/")[2].split("-")[0];
                        console.log('getUrlDate returning date=' + showDateObj.showDate);
                    })
                    .fail(function () {
                        alert("unable to find current show.");
                        console.log("getUrlDate: error getting idx file from server " + serverPath);
                    })
                    .always(function () {
                        currentShow.resolve();
                    }
                )
            );
        }
        else currentShow.resolve();
        return $.when(currentShow);
    },

    /* helper for getting data values */
    getData: function (url) {
        console.log("getData fetching " + url);
        return $.ajax({
            type: "GET",
            dataType: "xml",
            url: url
        })
    }
};

