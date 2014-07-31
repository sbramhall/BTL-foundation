/**
 * Created by sbramhall on 7/20/14.
 */
var btlJsApp = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    initialize: function() {
        var self = this;
        try{
            this.homeTpl = Handlebars.compile($("#main-tpl").html());
        }
        catch (err) {
            console.log("handlebar compile failed")
        }
        self.renderHomeView();

//        self.showAlert('BTL Initialized', 'Info');

    },

    renderHomeView: function() {
        var self = this;
        self.getData();
        self.getTemplate(
            'js/templates/main.handlebars',
            function(template) {
                $('#main-content').html(template);
                self.getTemplate(
                    'js/templates/menuTree.handlebars',
                    function(template) {
                        $( '#menuTree').html(template);
                        self.getTemplate(
                            'js/templates/weeklyShow.handlebars',
                            function(template) {
                                $('#btlShow').html(template);
                                $(document).foundation();
                                /*this needs to be in the callback because of ajax async behavior */
                            })  ;
                    });
            });
    } ,

    getTemplate: function (path, callback) {
        var source;
        var template;

        $.ajax({
            url: path,
            cache: true,
            success: function(data) {
                source    = data;
                template  = Handlebars.compile(source);

                //execute the callback if passed
                if (callback) callback(template);
            }
        });
    },

    getData: function () {
        var self = this;
        var xmlDoc;
        $.ajax({
            type: "GET",
            url: "data/oneShow.xml",
            dataType: "xml",
            success: function(data) {
                xmlDoc = $.parseXML(data);
                /* $xml = xmlDoc;*/
                var $test = $(data).find('lead-quote');
                self.showAlert($test.text(), 'Info');
                console.log($test.text());
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('status='+xhr.status+'\n'+thrownError);
            }
        })


    },
    parseXML: function (xml) {
        //find every Tutorial and print the author
        $(xml).find("lead-quote").each(function()
        {
            $("#quote").append($(this).attr("quote") + "<br />");
        }
        )
    }
};

