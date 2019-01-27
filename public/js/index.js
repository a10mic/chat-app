var socket = io();

socket.on('connect',()=>{
    console.log("connected to server");
})

socket.on('newMessage',(message)=>{
    console.log('new message',message);

    var ul = document.getElementById("messages");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`${message.from}: ${message.text}`));
    ul.appendChild(li);
})

socket.on('newLocationMessage',(message)=>{

    var a = document.createElement("a");
    var ul = document.getElementById("messages");
    var li = document.createElement("li");

    a.textContent = "My location";
    a.setAttribute('target', "blank");
    a.setAttribute('href', `${message.url}`);
    li.appendChild(document.createTextNode(`${message.from}:`));
    li.appendChild(a);
    ul.appendChild(li);
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
    
});

var locationButton = document.getElementById('send-location');

locationButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    function success(position){
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    };

    function error(){
        alert('Location access denied');
    };

    navigator.geolocation.getCurrentPosition(success,error);
});


