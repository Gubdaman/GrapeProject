//EMPLOYEE

(function initCtrl() {

    this.connection = null;
    this.proxy = null;
    this.connectedRooms = [];
    this.availableRooms = [];

    

})();

var publish = function (message) {
    $("#chat")[0].value = $("#chat")[0].value + message + "\n";
}
var manageRoomList = function (data) {
    if (data.isAdd) {
        this.availableRooms.push(data.Name);
    }
    else {
        var index = this.availableRooms.indexOf(data.Name);
        if (index !== -1) this.availableRooms.splice(index, 1);
    }
    $("#idList")[0].value = [];
    this.availableRooms.forEach(function (element) {
        $("#idList")[0].value = $("#idList")[0].value + element + "\n";
    });
}

var getAvailableRooms = function () {
    $.get(
        "/user/GetUnansweredRooms",
        function (data) {
            this.availableRooms = data;
            $("#idList")[0].value = [];
            this.availableRooms.forEach(function (element) {
                    $("#idList")[0].value = $("#idList")[0].value + element + "\n";
            });
        }
    )
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
        this.proxy.on("manageRooms", function (message) {
            manageRoomList(message)
        });

        connection.qs = { "userId": UserName };
        connection.start().done(function () {
            proxy.invoke('joinRoom', "ba36ef78-156f-4bb2-8974-23b5a24e0d72").done(function () {
                proxy.invoke('joinRoomInfo').done(function () {
                    proxy.invoke('sendToRoom', {
                        userId: UserName, text: "Connected!", roomName: "ba36ef78-156f-4bb2-8974-23b5a24e0d72"
                    }).done(function () {
                        console.log('Success!');
                    }).fail(function (error) {
                        console.log('Error: ' + error);
                    });
                });
                
            });
        });
    }
    else {
        return this.proxy;
    }
};

var testCall = function () {

    connectToHub("TestUser");
    getAvailableRooms();
    /*
    $.get(
        "/user",
        function (data) {
            console.log("works");
        }
    )*/

}

var sendMessage = function () {

    this.proxy.invoke('sendToRoom', { userId: "TestUser", text: $("#message")[0].value, roomName: "ba36ef78-156f-4bb2-8974-23b5a24e0d72" });

}

window.onbeforeunload = function () {
    this.connectedRooms.forEach(function (element) {
        this.proxy.invoke(element).done(function () { });
    });
    this.proxy.invoke('leaveRoomInfo');
};

