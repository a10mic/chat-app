const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message.js');
const {generateLocationMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);
io.on('connection',(socket)=>{
    console.log("new user connected!!");

    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    //
    socket.broadcast.emit('newMessage',generateMessage('Admin','New user connected'));

    socket.on('createMessage',(message,callback)=>{
        console.log('created new message',message);
    
        //sends the created message to every user 
        io.emit('newMessage',generateMessage(message.from, message.text));
        
        callback();
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected!!');
    })

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude))
    })
})


server.listen(3000,() => {
    console.log('server is up at port:3000');
})