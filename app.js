var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var axios = require('axios');

app.use(express.static("./"));

var port = process.env.PORT || 3000;
server.listen(port, ()=> {
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
    let serverArrayUser = function(){
        io.emit('even_user_online', arrClient);
    }
    serverArrayUser();

    socket.on('disconnect', function(){
        let idRemove = arrClient.findIndex(function(item){
            return item == socket.id;
        });
        arrClient.splice(idRemove,1);
        console.log("User", socket.id , " Da thoat ");
        serverArrayUser();
    });
    socket.on("Client-sent-username-to-server", function(userName){
        socket.name = userName;
        arrClient.push(socket.name);
        serverArrayUser();
        console.log(arrClient);
        socket.emit("server-sent-account-to-client", {"id":socket.id,"name": socket.name});

    });
    socket.on("have a account in browser", function (data) { 
        var __account = JSON.parse(data);
        socket.id = __account.id;
        socket.name = __account.name;
        arrClient.push(socket.name);
        //console.log(arrClient);
        serverArrayUser();
     });
     socket.on("Client-sent-message-to-server", function(data){
         socket.broadcast.emit("Server-sent-message-to-client", data);
         axios("http://sandbox.api.simsimi.com/request.p?key=4436e004-9236-4162-8936-d9904bdfbdf5&lc=en&ft=1.0&text="+data.message)
         .then(respons => {
            socket.broadcast.emit("Server-sent-message-to-client", {
                "id" : "suphan",
                "name" : "Anh Su dep trai",
                "message" : respons.data.response
            });
            //console.log(respons.data.response);
            return respons.data.response;
         })
         .catch(err =>{
             return err;
         });
         
     });
});