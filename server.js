const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const app = express();
const { ExpressPeerServer } = require("peer"); // it  generate random id for each  peerjs  connector from client
const bodyParser = require('body-parser');
const server=http.createServer(app)  // create server
const io=socketio(server).sockets

app.use(bodyParser.json());
const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  generateClientId: customGenerationFunction,
});

app.use("/mypeer", peerServer);

io.on('connection',(socket)=>{
  console.log("Hello connected")

  socket.on("join-room",({roomID,userId})=>{
    console.log("Room join")
    console.log('userid',userId)
    socket.join(roomID);
     socket.to(roomID).emit("user-connected",userId)

     //extra example
   //  socket.broadcast.emit("user-connected",userId)
  });
  socket.on("leave-room",({id,roomID})=>{
    console.log("Room leave")
    console.log('userid',id)
    socket.leave(roomID);

    socket.to(roomID).emit("user-disconnected",id)
    //  socket.broadcast.emit("user-disconnected",id)

    // socket.emit("user-connected",userId)
  });
    // console.log("Socket connected")

})



peerServer.on("error",(error)=>{
  console.log('error',error)
})
peerServer.on('connection', (client) => { 
  console.log("Server: Peer connected with ID:", client.id);
  // if (is_fishy(client)) {
  //   client.close();
  // }

});
const port =process.env.PORT|| 5000;
server.listen(port,()=>{
    console.log(`server is  running on port ${port}`)
})