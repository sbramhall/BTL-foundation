/**
 * Created by sbramhall on 7/20/14.
 */
var btlJsApp = {


    // TODO: figure out how to make $ look defined for jquery within this class
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    initialize: function() {
        var self = this;
        // self.renderHomeView();
        self.renderPage();
    },
    /**
     * call helpers to retrieve page parts and data and render the page
     */
    renderPage: function() {
        var self = this;
        var dataValues = {
            quote:'',
            citation:''
        };
        $.when (
            self.getData("data/oneShow.xml"),
            self.getTemplateDeferred('js/templates/main.handlebars'),
            self.getTemplateDeferred('js/templates/menuTree.handlebars'),
            self.getTemplateDeferred('js/templates/weeklyShow.handlebars')
        ).done(function(oneShowData, mainSource, menuSource, weeklyShowSource) {
                /* first build up the dataValues object with all properties */
                dataValues.quote = $(oneShowData).find('lead-quote').text();
                dataValues.citation = $(oneShowData).find('citation').text();
                //console.log('renderPage values for dataValues is '+ JSON.stringify(dataValues));

                /* compile the HandleBars templates */
                var menuTemplate    = Handlebars.compile(menuSource[0]);
                var mainTemplate    = Handlebars.compile(mainSource[0]);
                var weeklyTemplate  = Handlebars.compile(weeklyShowSource[0]);

                /* apply templates to index.html */
                $('#main-content').html(mainTemplate);
                $('#menuTree').html(menuTemplate);
                $('#btlShow').html(weeklyTemplate(dataValues));
            $(document).foundation();
            }

        )
    },

    /* helper for retrieving templates */
    getTemplateDeferred: function (path) {
        /* the code below returns a promise object that is accessed in the .when statement */
        return $.ajax({
            url: path,
            cache: true
            })
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

