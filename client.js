$(document).ready(function(){
    var socket = io.connect('http://localhost:3000');
    socket.on('user_online', function(arrClient){
        console.log("Server emit to client", arrClient);
    });
})