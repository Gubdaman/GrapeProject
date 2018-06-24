//EMPLOYEE



var publish = function (message) {
    if (!this.ongoingChats.hasOwnProperty(message.RoomName)) {
        this.ongoingChats[message.RoomName] = "";
    }
    this.ongoingChats[message.RoomName] = this.ongoingChats[message.RoomName] + message.UserId + ": " + message.Text + "\n";
    updateChat();
}

var changeRoom = function () {
    this.currentChat = $("#roomSelect")[0].options[$("#roomSelect")[0].selectedIndex].text;
    updateChat();
}

var updateList = function () {
    $("#roomSelect")[0].options.length = 0;
    for (index in this.availableRooms) {
        $("#roomSelect")[0].options[$("#roomSelect")[0].options.length] = new Option(this.availableRooms[index], index);
    }
    
    for (index in this.connectedRooms) {
        $("#roomSelect")[0].options[$("#roomSelect")[0].options.length] = new Option(this.connectedRooms[index], index);
    }
    if (this.currentChat === "") { this.currentChat = $("#roomSelect")[0].options[0].text }
}

var updateChat = function () {
    $("#chat")[0].value = this.ongoingChats[this.currentChat];
}

var manageRoomList = function (data) {
    if (data.isAdd) {
        this.availableRooms.push(data.Name);
    }
    else {
        var index = this.availableRooms.indexOf(data.Name);
        if (index !== -1) this.availableRooms.splice(index, 1);
    }
    updateList();
}

var getAvailableRooms = function () {
    var that = this;
    $.get(
        "/user/GetUnansweredRooms",
        function (data) {
            that.availableRooms = data;
            updateList();
        }
    )
}


this.connectToHub = function (UserName) {

    if (this.connection === null) {
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
            proxy.invoke('joinRoomInfo').done(function () {
                
            });
        });
    }
    else {
        return this.proxy;
    }
};

var testCall = function () {

    
    /*
    $.get(
        "/user",
        function (data) {
            console.log("works");
        }
    )*/

}

var sendMessage = function () {

    var index = this.availableRooms.indexOf(this.currentChat);
    var that = this;
    if (index === -1) {
        this.proxy.invoke('joinRoom', this.currentChat).done(function () {
            that.proxy.invoke('sendToRoom', { UserId: "TestUser", Text: $("#message")[0].value, RoomName: that.currentChat });
        });
        this.connectedRooms.push(this.currentChat);
    }
    else {
        this.proxy.invoke('sendToRoom', { UserId: "TestUser", Text: $("#message")[0].value, RoomName: that.currentChat });
    }
    

}

window.onbeforeunload = function () {
    this.connectedRooms.forEach(function (element) {
        this.proxy.invoke(element).done(function () { });
    });
    this.proxy.invoke('leaveRoomInfo');
};

(function initCtrl() {

    this.connection = null;
    this.proxy = null;
    this.connectedRooms = [];
    this.availableRooms = [];

    this.ongoingChats = {};
    this.currentChat = "";

    getAvailableRooms();
    connectToHub("TestUser");


})();