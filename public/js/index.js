var socket = io();

socket.on('connect',()=>{
    console.log("connected to server");

    socket.on('newMessage',(message)=>{
        console.log('new message',message);
    })

    socket.emit('createMessage',{
        to: 'Name',
        text: 'Your text here',
        createdAt: new Date().getTime,
    })
})

socket.on('disconnect',()=>{
    console.log('server disconnected');
})