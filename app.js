const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

io.on('connection', (socket) => {
    console.log(`🔌 New client: ${socket.id}`);
    socketsConnected.add(socket.id);
    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log(`❌ Disconnected: ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
});

server.listen(PORT, () => {
    console.log(`💬 Server listening on http://localhost:${PORT}`);
});
