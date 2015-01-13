/**
 * Created by sbramhall on 7/20/14.
 */
var btlRoot = "http://btlonline.org";
var btlShowDate = {
    showDate: '',
    showYear: ''
};
var btlJsApp;
btlJsApp = {


    // TODO: figure out how to make $ look defined for jquery within this class
    showAlert: function (message, title) {
        /*
        this function is not used at the moment
         */
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    getShowDate: function (){
        // currently not used
        $ = jQuery;
        $.when(self.getUrlDate(btlRoot, btlShowDate))
            .done(function () {
                console.log("pageShowDate property =" + btlShowDate.showDate);
            })
            .fail(function () {
                alert("The urlDate function failed - this should never happen.");
            })
    },

    /**
     * call helpers to retrieve page parts and data and render the page
     */
    renderPage: function (serverPath, showDate) {
        $ = jQuery;

        var self = this;
        var pageShowDate = {
            showDate: showDate,
            showYear: '2014'
        };
        var dataValues = {
            credit: '',
            ledeImageUrl: '',
            ledeHtml: '',
            fullShowMp3: '',
            segAHeadline: '', segAguestName: '', segAguestTitle: '', segAinterviewer: '',
            segAimageAltText: '', segAimageSrc: '', segAmp3Url: '', segAstoryText: '',
            segBHeadline: '', segBguestName: '', segBguestTitle: '', segBinterviewer: '',
             segBimageAltText: '', segBimageSrc: '',  segBmp3Url: '', segBstoryText: '',
            segCHeadline: '', segCguestName: '', segCguestTitle: '', segCinterviewer: '',
            segCimageAltText: '', segCimageSrc: '', segCmp3Url: '', segCstoryText: ''
        };
        var menuValues = {
            menuPath: btlRoot
        };
        $.when(self.getUrlDate(btlRoot, pageShowDate))
            .done(function () {
                console.log("show date passed in =" + showDate + "; local pageShowDate property =" + pageShowDate.showDate);
                $.when(
                    //self.getData("data/btl-" + pageShowDate.showDate + ".xml"),
                    self.getResourceDeferred('js/templates/main.handlebars'),
                    self.getResourceDeferred('js/templates/menuTree.handlebars'),
                    self.getResourceDeferred('js/templates/weeklyShow.handlebars'),
                    self.getShowData(pageShowDate, dataValues)
                ).done(function (//oneShowData,
                                 mainSource, menuSource, weeklyShowSource, showData) {
                        /* first build up the dataValues object with all properties */


                        dataValues.fullShowMp3 = btlRoot + "/" + pageShowDate.showYear + "/mp3/" +
                            pageShowDate.showDate + "-btlv64.mp3";

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
    getShowData: function (pageShowDate, dataValues) {
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

        console.log('currentShow is ' + pageShowDate.showDate);
        var urlPrefix = dataValues.segAimageSrc = btlRoot + "/" + pageShowDate.showYear ;

        var getLedeHtml = $.when(self.getResourceDeferred(serverPath + 'html/' + pageShowDate.showDate + 'l.html')
                .done(function (result) {
                    ledeHtml = result;
                    // console.log("got ledeHtml from result: " + ledeHtml);
                })
                .fail(function (result, errorType) {
                    ledeHtml = undefined;
                    console.error("error retrieving " + this.url + "Error type: " + errorType);
                })
                .always(function () {
                    da.resolve();
                })
        )
        ;
        var getLedeXml = $.when(self.getResourceDeferred(serverPath + 'xml/' + pageShowDate.showDate + 'l.xml')
                .done(function (ledeXmlresult) {
                    ledeXml = ledeXmlresult;
                    dataValues.ledeImageUrl = btlRoot + "/" + pageShowDate.showYear + "/i/" +
                        pageShowDate.showDate + "-lede." +
                        $(ledeXmlresult).find('image').children('type').text();
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

        getSegA = $.when(self.getResourceDeferred(serverPath + 'xml/' + pageShowDate.showDate + 'a.xml')
                .done(function (segAresult) {
                    /*
                    Set the data values to be used in the template substitution
                     */
                    dataValues.segAHeadline = $(segAresult).find('headline').text();

                    dataValues.segAimageAltText = $(segAresult).find('image').children('alt').text();
                    dataValues.segAimageSrc = urlPrefix + "/i/" +
                        pageShowDate.showDate + "a-" + dataValues.segAimageAltText + "." +
                        $(segAresult).find('image').children('type').text();

                    dataValues.segAguestName = $(segAresult).find('firstname').text() + ' ' +
                        $(segAresult).find('lastname').text();

                    dataValues.segAmp3Url = urlPrefix + '/mp3/' + pageShowDate.showDate + 'a-btl-' +
                        $(segAresult).find('lastname').text().toLowerCase() + '.mp3';

                    dataValues.segAinterviewer = $(segAresult).find('interviewer').text();
                    dataValues.segAguestTitle = $(segAresult).find('guest').children('title').text();

                    var paraNodes = $(segAresult).find('script').children('para');
                    $.each(paraNodes, function(index, node){
                       dataValues.segAstoryText = dataValues.segAstoryText + '<p>' + $(node).text() + '<p>';
                    });
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
        getSegB = $.when(self.getResourceDeferred(serverPath + 'xml/' + pageShowDate.showDate + 'b.xml')
                .done(function (segBresult) {
                    dataValues.segBHeadline = $(segBresult).find('headline').text();

                    dataValues.segBimageAltText = $(segBresult).find('image').children('alt').text();
                    dataValues.segBimageSrc = btlRoot + "/" + pageShowDate.showYear + "/i/" +
                        pageShowDate.showDate + "b-" + dataValues.segBimageAltText + "." +
                        $(segBresult).find('image').children('type').text();

                    dataValues.segBguestName = $(segBresult).find('firstname').text() + ' ' +
                        $(segBresult).find('lastname').text();

                    dataValues.segBmp3Url = urlPrefix + '/mp3/' + pageShowDate.showDate + 'b-btl-' +
                        $(segBresult).find('lastname').text().toLowerCase() + '.mp3';

                    dataValues.segBinterviewer = $(segBresult).find('interviewer').text();
                    dataValues.segBguestTitle = $(segBresult).find('guest').children('title').text();
                    var paraNodes = $(segBresult).find('script').children('para');
                    $.each(paraNodes, function(index, node){
                        dataValues.segBstoryText = dataValues.segBstoryText + '<p>' + $(node).text() + '<p>';
                    });

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
        getSegC = $.when(self.getResourceDeferred(serverPath + 'xml/' + pageShowDate.showDate + 'c.xml')
                .done(function (segCresult) {
                    dataValues.segCHeadline = $(segCresult).find('headline').text();

                    dataValues.segCimageAltText = $(segCresult).find('image').children('alt').text();
                    dataValues.segCimageSrc = btlRoot + "/" + pageShowDate.showYear + "/i/" +
                        pageShowDate.showDate + "c-" + dataValues.segCimageAltText + "." +
                        $(segCresult).find('image').children('type').text();

                    dataValues.segCguestName = $(segCresult).find('firstname').text() + ' ' +
                        $(segCresult).find('lastname').text();

                    dataValues.segCmp3Url = urlPrefix + '/mp3/' + pageShowDate.showDate + 'c-btl-' +
                        $(segCresult).find('lastname').text().toLowerCase() + '.mp3';

                    dataValues.segCinterviewer = $(segCresult).find('interviewer').text();
                    dataValues.segCguestTitle = $(segCresult).find('guest').children('title').text();
                    var paraNodes = $(segCresult).find('script').children('para');
                    $.each(paraNodes, function(index, node){
                        dataValues.segCstoryText = dataValues.segCstoryText + '<p>' + $(node).text() + '<p>';
                    });
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
                dataValues.ledeHtml = ledeHtml;

                console.log("ledeHtml  state=" + getLedeHtml.state());
                console.log("ledeXml  state=" + getLedeXml.state() + " not used");
                console.log("segXmlA state=" + getSegA.state());
                console.log("segXmlB  state=" + getSegB.state());
                console.log("segXmlC state=" + getSegC.state());
                /*can process the data now.  phew!*/

            }
        );



    },

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
        var currentShow = $.Deferred(), getIdx;
        if (showDateObj.showDate === undefined) {
            console.log("getUrlDate fetching " + serverPath + '/index.html');
            getIdx = $.when(
                (self.getResourceDeferred(serverPath + '/index.html'))
                    .done(function (result) {
                        var doc = $.parseHTML(result);
                        var content = ($(doc).filter("meta")).attr("content");
                        var url = content.split('url=')[1];
                        showDateObj.showYear = url.split("/")[1];
                        showDateObj.showDate = url.split("/")[2].split("-")[0];

                        //showDate = url.split("/")[2].split("-")[0];
                        console.log('getUrlDate returning date=' + JSON.stringify(showDateObj));
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

