const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;
const staticPublicPath = path.join(__dirname, "../public");
const Filter = require("bad-words");
const { getMessages, getLocation } = require("./utils/messages");
const { addUser,getUser,getUsersInRoom,removeUser } = require("./utils/users");
app.use(express.static(staticPublicPath));
let count = 0;
io.on("connection", (socket) => {
  let message = "welcome";
 
  socket.on('join',(options,callback)=>{//option={userName,room}
      
     const {error,user}= addUser({id:socket.id,...options})//...options=userName,room
     if(error){
        return callback(error)//error
     }
     console.log(user)
      socket.join(user.room);
      socket.emit("message", getMessages({message,userName:"Admin"}));//when user joins that time we need to show welcome message from Admin
      message=`${user.userName} has joined`
      socket.broadcast.to(user.room).emit("message", getMessages({message,userName:"Admin"})); //the broad cast always emit to every user exept the broadcasted one.
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
      // console.log("connection established");
      callback()//success
  })
  socket.on("formdata", (message, callback) => {
    const filter = new Filter();
    const {room,userName}=getUser(socket.id)
    if (filter.isProfane(message)) {
      return callback("the message contains profanity.!!!!");
    }
    io.to(room).emit("message", getMessages({message,userName}));
    callback();
  });
  socket.on("sendLocation", (coords, callback) => {
    if (!coords) {
      return callback("facing some error to share the location");
    }
    const {room,userName}=getUser(socket.id)
    io.to(room).emit("locationMessage", getLocation({coords,userName}));
    callback();
  });
//   socket.emit("countUpdated", count);
//   socket.on("increment", () => {
//     count++;
//     io.emit("countUpdated", count);
//   });
  
  socket.on("disconnect", () => {
    const user= removeUser(socket.id)
      if(user){(
          io.to(user.room).emit('message',getMessages({message:`${user.userName} has left`,userName:"Admin"})))
          io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
          })
      }
    io.emit("exit");
  });
});

server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
