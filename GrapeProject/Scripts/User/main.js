//USER



var publish = function (message) {
    $("#chat")[0].value = $("#chat")[0].value + message.UserId + ": " + message.Text + "\n";
}

var connectToHub = function (UserName) {

    if (this.connection === null) {
        //var url = RequestSvc.getHost();

        //$.connection.hub.url = url + "/signalr";
        //connection = $.hubConnection(url);
        this.connection = $.hubConnection();
        this.proxy = connection.createHubProxy("chatHub");

        this.proxy.on("processMessage", function (message) {
            publish(message);
        });
        

        connection.qs = { "userId": UserName };
        connection.start().done(function () {
            proxy.invoke('join').done(function () {
                proxy.invoke('send', { userId: UserName, text: "Connected!" }).done(function () {
                    console.log('Success!');
                }).fail(function (error) {
                    console.log('Error: ' + error);
                });
            });
        });
    }
    else {
        return this.proxy;
    }
};

var testCall = function () {

    connectToHub("Anon");
    /*
    $.get(
        "/user",
        function (data) {
            console.log("works");
        }
    )*/
    
}

var sendMessage = function () {

    this.proxy.invoke('send', { userId: "Anon", text: $("#message")[0].value })
    /*
    $.get(
        "/user",
        function (data) {
            console.log("works");
        }
    )*/

}

window.onbeforeunload = function () {
    this.proxy.invoke('leave').done(function () { });
};

(function initCtrl() {

    this.connection = null;
    this.proxy = null;

    connectToHub("Anon")

})();