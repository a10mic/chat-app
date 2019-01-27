const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);
io.on('connection',(socket)=>{
    console.log("new user connected!!");

    socket.emit('newMessage',{
        from: 'Name',
        text: 'text here',
        createdAt: new Date().getTime,
    })

    socket.on('createMessage',(message)=>{
        console.log('created new message',message);
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected!!');
    })
})


server.listen(3000,() => {
    console.log('server is up at port:3000');
})