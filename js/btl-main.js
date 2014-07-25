/**
 * Created by sbramhall on 7/20/14.
 */
var app = {

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
        $(document).foundation();
        self.showAlert('BTL Initialized', 'Info');

    },
    renderHomeView: function() {

        $('#foo').html(this.homeTpl());
    }
};

