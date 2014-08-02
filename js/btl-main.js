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
/*        try{
            this.homeTpl = Handlebars.compile($("#main-tpl").html());
        }
        catch (err) {
            console.log("handlebar compile failed")
        }*/
        self.renderHomeView();
    },

    renderHomeView: function() {
        var self = this;
        self.getData();

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
        var dataValues = {
            quote:'',
            citation:''
        };
        $.ajax({
            type: "GET",
            url: "data/oneShow.xml",
            dataType: "xml",
            success: function(data) {
                var leadQuote = $(data).find('lead-quote');
                dataValues.quote = leadQuote.text();
                dataValues.citation = $(data).find('citation').text();
                console.log('getData values for handlebars template is '+ JSON.stringify(dataValues));
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
                                        $('#btlShow').html(template(dataValues));
                                        $(document).foundation();
                                    })  ;
                            });
                    });
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

