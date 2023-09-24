const express = require('express');
const http = require('http')
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');


const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
    })

    socket.on('send_message', (data) => {
        // console.log(data)
        socket.to(data.room).emit('received_message', data)
    })
});


server.listen(process.env.PORT || 3031, () => {
    console.log(`server is running`);
});
