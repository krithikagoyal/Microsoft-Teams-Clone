require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

const socketToRoom = {};

function leaveRoom(socket, userId) {
    const roomID = socketToRoom[userId];
    let room = users[roomID];
    if (room) {
        room = room.filter(user => user.id !== userId);
        users[roomID] = room; 6
    }
    socket.broadcast.emit('user left', userId);
}

io.on('connection', socket => {
    socket.on("join room", payload => {
        if (users[payload.roomID]) {
            const length = users[payload.roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[payload.roomID].push({ id: socket.id, username: payload.myUsername });
        } else {
            users[payload.roomID] = [{ id: socket.id, username: payload.myUsername }];
        }
        socketToRoom[socket.id] = payload.roomID;
        const usersInThisRoom = users[payload.roomID].filter(user => user.id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, username: payload.username });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("disconnect", () => {
        leaveRoom(socket, socket.id);
    });

    socket.on("user clicked leave meeting", userId => {
        leaveRoom(socket, userId);
    });

    socket.on('send message', payload => {
        io.emit('receive message', { username: payload.username, message: payload.message });
    });

});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));
