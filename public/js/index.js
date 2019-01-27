var socket = io();

socket.on('connect',()=>{
    console.log("connected to server");

    socket.on('newMessage',(message)=>{
        console.log('new message',message);

        var ul = document.getElementById("messages");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(`${message.from}: ${message.text}`));
        ul.appendChild(li);
    })
})

socket.on('disconnect',()=>{
    console.log('server disconnected');
});

document.getElementById('message-form').addEventListener("submit", (e)=>{
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'user',
        text: document.querySelector('[name="message"]').value
    })
    
})