$(document).ready(function(){

    var htmlListUser = document.getElementById("list-user");
    var socket = io.connect('http://localhost:3000');
    var __account = localStorage.getItem("__account");
    $(".main").hide();
    if(__account){
        socket.emit("have a account in browser", __account);
        console.log("have a account in browser");
        $(".login").hide();
        $(".main").show();
        socket.name = __account.name;
        socket.id = __account.id;
    }
   
//  input Login
    $("#input-name-user").keyup(function (event) { 
        if(event.keyCode === 13){
            let name = $(this).val();
            socket.emit("Client-sent-username", name);
            socket.name = name;
            $(".main").show();
            $(".login").hide();
        }
        
    });

    socket.on('even_user_online', function(arrClient){
        var stringUser = renderListUser(arrClient);
        htmlListUser.innerHTML = stringUser.join('');
        $(".count-user").html("Co " + arrClient.length + " user online");
    });

    socket.on("server-sent-account", function(account){
        socket.id = account.id;
        localStorage.setItem("__account", JSON.stringify(account));
    });

    //  input message
    $("#input-message").keyup(function(event){
        if(event.keyCode === 13){
            let message = {
                "id": socket.id,
                "name": socket.name,
                "message" : $(this).val().trim()
            }
            socket.emit("Client-sent-message-to-server", message);
        }
    });
   socket.on("Server-sent-message-to-client", function(data){
    if(data.id !== socket.id) {
        console.log(data.name);
        let message = `<div class="flexbox">
                <div class="message">
                    <div class="message-name">${data.name}</div>
                    <div class="message-content">${data.message}</div>
                </div>
            </div>`
        $(".form-chat").append(message);
    } else {
        console.log(data.name);
        let message = `<div class="flexbox-reverse">
                <div class="message-rep">
                    <div class="message-name">${data.name}</div>
                    <div class="message-content">${data.message}</div>
                </div>
        </div>`
        $(".form-chat").append(message);
    }
   });
});
function renderListUser(arr){
    return arr.map(function(item){
        return "<li>"+ item +"</li>";
    });
}
