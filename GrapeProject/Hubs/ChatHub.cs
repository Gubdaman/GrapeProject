using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace GrapeProject.Hubs
{
    public class ChatHub : Hub
    {
        public class RoomState
        {
            public int Count { get; set; }
            public bool Answered { get; set; }
        }
        public class RoomData
        {
            public string Name { get; set; }
            public bool isAdd { get; set; }
        }


        public class Message
        {
            public string UserId { get; set; }
            public string Text { get; set; }
            public string RoomName { get; set; }
        }


        public static Dictionary<string, RoomState> rooms = new Dictionary<string, RoomState>();

        public Task JoinRoom(string roomName)
        {
            if(!rooms.ContainsKey(roomName))
            {
                rooms[roomName] = new RoomState()
                {
                    Answered = false,
                    Count = 1
                };
                SendRoomUpdate(new RoomData()
                {
                    isAdd = true,
                    Name = roomName
                });
            }
            else
            {
                rooms[roomName].Count++;
            }
            return Groups.Add(Context.ConnectionId, roomName);
        }

        public Task Join()
        {
            return JoinRoom(Context.ConnectionId);
        }

        public Task LeaveRoom(string roomName)
        {
            rooms[roomName].Count--;
            if(rooms[roomName].Count == 0)
            {
                rooms.Remove(roomName);
                SendRoomUpdate(new RoomData()
                {
                    Name = roomName,
                    isAdd = false
                });
            }
            return Groups.Remove(Context.ConnectionId, roomName);
        }

        public Task JoinRoomInfo()
        {
            return Groups.Add(Context.ConnectionId, "RoomInfo");
        }

        public Task LeaveRoomInfo()
        {
            return Groups.Remove(Context.ConnectionId, "RoomInfo");
        }

        public Task Leave()
        {
            return LeaveRoom(Context.ConnectionId);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }

        public void SendRoomUpdate(RoomData data)
        {
            Clients.Group("RoomInfo").ManageRooms(data);
        }
        
        public void SendToRoom(Message msg)
        {
            if(!rooms[msg.RoomName].Answered)
            {
                rooms[msg.RoomName].Answered = true;
                SendRoomUpdate(new RoomData()
                {
                    isAdd = false,
                    Name = msg.RoomName
                });
            }
            
            Clients.Group(msg.RoomName).ProcessMessage(msg);
        }

        public void Send(Message msg)
        {
            Clients.Group(Context.ConnectionId).ProcessMessage(msg);
        }
    }
}