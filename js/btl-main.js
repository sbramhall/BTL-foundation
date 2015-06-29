/**
 * Created by sbramhall on 7/20/14.
 */
var btlRoot = "http://btlonline.org";

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

    /**
     * call helpers to retrieve page parts and data and render the page
     */
    renderPage: function (passedShowDate) {
        $ = jQuery;

        var self = this;
        var pageShowDate = {
            showDate: '',
            showYear: ''
        };
        var dataValues = {
            creditText: '',
            ledeImageUrl: '',
            ledeHtml: '',
            fullShowMp3: '',
            segAHeadline: '', segAguestName: '', segAguestTitle: '', segAinterviewer: '',
            segAimageAltText: '', segAimageSrc: '', segAmp3Url: '', segAstoryText: '',
            segBHeadline: '', segBguestName: '', segBguestTitle: '', segBinterviewer: '',
            segBimageAltText: '', segBimageSrc: '', segBmp3Url: '', segBstoryText: '',
            segCHeadline: '', segCguestName: '', segCguestTitle: '', segCinterviewer: '',
            segCimageAltText: '', segCimageSrc: '', segCmp3Url: '', segCstoryText: '',
            menuPath: btlRoot,
            menuDate: pageShowDate.showDate,
            menuYear: pageShowDate.showYear
        };
        var menuValues = {
            menuPath: btlRoot,
            menuDate: pageShowDate.showDate,
            menuYear: pageShowDate.showYear
        };
        if (passedShowDate === undefined)
            console.log("Oops - no showdate");
        else {
            pageShowDate.showYear = '20' + passedShowDate.substr(0, 2);
            pageShowDate.showDate = passedShowDate;
        }
        console.log("showdate =" + passedShowDate );

        $.when(
            self.getResourceDeferred('js/templates/main.handlebars'),
            self.getResourceDeferred('js/templates/menuTree.handlebars'),
            self.getResourceDeferred('js/templates/weeklyShow.handlebars'),
            self.getShowData(pageShowDate, dataValues)
            )
            .done(function (mainSource, menuSource, weeklyShowSource) {
                /* first build up the dataValues object with all properties */

                dataValues.fullShowMp3 = btlRoot + "/" + pageShowDate.showYear + "/mp3/" +
                pageShowDate.showDate + "-btlv64.mp3";

                dataValues.menuDate = pageShowDate.showDate;
                dataValues.menuYear = pageShowDate.showYear;

                /* compile the HandleBars templates */
                var mainTemplate = Handlebars.compile(mainSource[0]);
                var menuTemplate = Handlebars.compile(menuSource[0]);
                var weeklyTemplate = Handlebars.compile(weeklyShowSource[0]);

                /* apply templates to index.html */
                $('#main-content').html(mainTemplate(dataValues));
                $('#menuTree').html(menuTemplate(dataValues));
                $('#btlShow').html(weeklyTemplate(dataValues));
                $(document).foundation();
            }
        )
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
        var urlPrefix = dataValues.segAimageSrc = btlRoot + "/" + pageShowDate.showYear;

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
                    $.each(paraNodes, function (index, node) {
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
                    $.each(paraNodes, function (index, node) {
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
                    $.each(paraNodes, function (index, node) {
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
    }

};

