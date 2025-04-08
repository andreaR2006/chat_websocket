const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/utilisateur');
require('./database');

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

    // Envoie de l'historique des messages à chaque nouveau client
    Message.find({}, (err, messages) => {
        if (err) {
            console.log('Error fetching messages from the database:', err);
        } else {
            // Envoie des anciens messages au client
            socket.emit('chat-history', messages);
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ Disconnected: ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        // Sauvegarder le message dans la base de données
        const newMessage = new Message({
            name: data.name,
            message: data.message,
            dateTime: data.dateTime
        });

        newMessage.save()
            .then(() => {
                // Envoyer le message à tous les autres clients connectés
                io.emit('chat-message', data);
            })
            .catch(err => {
                console.log('Error saving message:', err);
            });
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
});

server.listen(PORT, () => {
    console.log(`💬 Server listening on http://localhost:${PORT}`);
});
