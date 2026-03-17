const socketIo = require("socket.io");
const User = require("../models/user.model");
const Captain = require("../models/captain.model");
const EventEmitter = require("events");

const rideEvents = new EventEmitter();
let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", (data) => {
      const { userId } = data;
      console.log(`User ${userId} joined room ${userId}`);
      socket.join(userId);
    });

    socket.on("ride-accepted", (data) => {
      const { rideId, captainId } = data;
      console.log(`Ride ${rideId} accepted by captain ${captainId}`);
      rideEvents.emit(`ride-accepted-${rideId}`, data);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  }
};

module.exports = { initializeSocket, sendMessageToSocketId, rideEvents };
