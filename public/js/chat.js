var socket = io();

socket.on('connect',()=>{
    var params = jQuery.deparam(window.location.search);

    socket.emit('join',params, (err)=>{
        if(err){
            alert(err);
            window.location.href = '/';
        } else{
            console.log("no error");
        }
    })
})

socket.on('newMessage',(message)=>{
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var ul = document.getElementById("messages");
    var template = document.getElementById("message-template").innerHTML;
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })
    var li = document.createElement("li");
    li.innerHTML = html;
    ul.appendChild(li);
})

socket.on('newLocationMessage',(message)=>{
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var ul = document.getElementById("messages");
    var template = document.getElementById("location-message-template").innerHTML;
    var html = Mustache.render(template,{
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })
    var li = document.createElement("li");
    li.innerHTML = html;
    ul.appendChild(li);

    // var a = document.createElement("a");
    // var ul = document.getElementById("messages");
    // var li = document.createElement("li");

    // a.textContent = "My location";
    // a.setAttribute('target', "blank");
    // a.setAttribute('href', `${message.url}`);
    // li.appendChild(document.createTextNode(`${message.from} ${formattedTime}:`));
    // li.appendChild(a);
    // ul.appendChild(li);
})

socket.on('disconnect',()=>{
    console.log('server disconnected');
});

socket.on('updateUserList', (users) => {
    var ul = jQuery('<ul></ul>');

    users.forEach((user) =>{
        ul.append(jQuery('<li></li>').text(user));
    })
    jQuery('#users').html(ul);
})
document.getElementById('message-form').addEventListener("submit", (e)=>{
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'user',
        text: document.querySelector('[name="message"]').value
    }, ()=>{
        document.querySelector('[name="message"]').value = ' ';
    });
    
});

var locationButton = document.getElementById('send-location');

locationButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.setAttribute('disabled','disabled');

    function success(position){
        locationButton.removeAttribute('disabled');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    };

    function error(){
        locationButton.removeAttribute('disabled');
        alert('Location access denied');
    };

    navigator.geolocation.getCurrentPosition(success,error);
});