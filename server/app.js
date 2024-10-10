const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

// Listen for incoming socket connections
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle when a user joins a room
  socket.on('joinRoom', ({ room, name }) => {
    socket.join(room); 
    console.log(`User ${name} joined room: ${room}`);

    // Notify others in the room that a new user has joined
    socket.to(room).emit('chat', { message: `${name} has joined the room` });
  });

  // Listen for "chat" event from the client
  socket.on('chat', ({ room, name, message }) => {
    io.to(room).emit('chat', { name, message });
  });
  
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
