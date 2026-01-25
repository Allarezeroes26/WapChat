const { Server } = require("socket.io")
const http = require('http')
const express = require('express')

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

//store online 

function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {}; // { userId: socket.id }

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return;

  userSocketMap[userId] = socket.id;
  console.log("User connected:", userId, socket.id);

  // Emit updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId, socket.id);
    // Only remove if this socket ID matches (handles reconnects)
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});




module.exports = {io, app, server, getReceiverSocketId}