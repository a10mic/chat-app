const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');


const port = process.env.PORT || 3000;

const {generateMessage} = require('./utils/message.js');
const {generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js')

const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));

var server = http.createServer(app);
var users = new Users();

var io = socketIO(server);
io.on('connection',(socket)=>{
    console.log("new user connected!!");
    
    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room name are required');
        }
        
        socket.join(params.room);
        users.removerUser(socket.id);
        users.addUser(socket.id, params.name,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));

        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));

        callback();
    })

    socket.on('createMessage',(message,callback)=>{ 
        //sends the created message to every user 
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
        }
        
        
        callback();
    })
    socket.on('disconnect',()=>{
        var user = users.removerUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
        }
    })

    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude))
        }
    })
})


server.listen(port,() => {
    console.log(`server is up at port:${port}`);
})