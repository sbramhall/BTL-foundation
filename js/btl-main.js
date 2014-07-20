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

        this.homeTpl = Handlebars.compile($("#main-tpl").html());
        self.renderHomeView();
        self.showAlert('BTL Initialized', 'Info');

    },
    renderHomeView: function() {
        /* TODO find a better way to generate html */
        $('body').html(this.homeTpl());
    }
};

app.initialize();
