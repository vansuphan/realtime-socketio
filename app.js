var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static("./"));

server.listen(3000, ()=> {
    console.log("Start Server port 3000")
});
// WARNING: app.listen(3000) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
// emit : giu su kien
// on lang nghe su kien
// socket => client

var arrClient =[];

io.on('connection', function (socket) {
    console.log('Co 1 Client connect', socket.id);
    arrClient.push(socket.id);
    let serverArrayUser = io.emit('user_online', arrClient);
    serverArrayUser();
    console.log(arrClient);

    socket.on('disconnect', function(){
        let idRemove = arrClient.findIndex(function(item){
            return item == socket.id;
        });
        arrClient.splice(idRemove,1);
        serverArrayUser();
        console.log("User", socket.id , " Da thoat ");
    });
    
});