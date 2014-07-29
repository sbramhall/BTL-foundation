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
        self.getTemplate(
            'js/templates/main.handlebars',
            function(template) {
                $('#main-content').html(template);
                $(document).foundation(); /*this needs to be in the callback because of ajax async behavior */
            }
        );
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
    }
};

