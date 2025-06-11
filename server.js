require('dotenv').config();
const express = require('express');
const http = require('http'); // Required for socket
const socketIo = require('socket.io');
const routes = require('./routes');
const { connectToMongo } = require('./utils/mongoClient');

const app = express();
app.use(express.json());

connectToMongo();

// Wrap Express app with HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io available to other modules
app.set('io', io);

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
