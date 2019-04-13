$(document).ready(function(){

    var htmlListUser = document.getElementById("list-user");
    var socket = io.connect('https://chat-realtime-v1.herokuapp.com');
    var __account = localStorage.getItem("__account");

    $(".main").hide();

    socket.on('even_user_online', function(arrClient){
        var stringUser = renderListUser(arrClient);
        htmlListUser.innerHTML = stringUser.join('');
        $(".count-user").html("Co " + arrClient.length + " user online");
    });

    if(__account){
        socket.emit("have a account in browser", __account);
        //console.log("have a account in browser");
        $(".login").hide();
        $(".main").show();
        socket.name = __account.name;
        socket.id = __account.id;
        
    }
   
//  input Login
    $("#input-name-user").keyup(function (event) { 
        if(event.keyCode === 13){
            let name = $(this).val();
            socket.emit("Client-sent-username-to-server", name);
            socket.name = name;
            $(".main").show();
            $(".login").hide();
        }
        
    });


    socket.on("server-sent-account-to-client", function(account){
        socket.name = account.name;
        localStorage.setItem("__account", JSON.stringify(account));
    });

    //  input message
    $("#input-message").keyup(function(event){
        if(event.keyCode === 13){
            var __account = JSON.parse(localStorage.getItem("__account"));
            let message = {
                "id": __account.id,
                "name": __account.name,
                "message" : $(this).val().trim()
            }
            socket.emit("Client-sent-message-to-server", message);
            $(this).val("");
        }
    });
    $("#button-sent-sms").click(function () { 
        var __account = JSON.parse(localStorage.getItem("__account"));
            let message = {
                "id": __account.id,
                "name": __account.name,
                "message" : $(this).val().trim()
            }
            socket.emit("Client-sent-message-to-server", message);
            $("#input-message").val("");
    });
   socket.on("Server-sent-message-to-client", function(data){
    var __account = JSON.parse(localStorage.getItem("__account"));
    if( data.name !== __account.name || __account == null) {
        //console.log(data.name);
        let message = `<div class="flexbox">
                <div class="message">
                    <div class="message-name">${data.name}</div>
                    <div class="message-content">${data.message}</div>
                </div>
            </div>`
        $(".form-chat").append(message);
        $(".form-chat").scrollTop($(".form-chat")[0].scrollHeight);
    }else {
        console.log(data.name);
        let message = `<div class="flexbox-reverse">
                <div class="message-rep">
                    <div class="message-name">${data.name}</div>
                    <div class="message-content">${data.message}</div>
                </div>
        </div>`
        $(".form-chat").append(message);
        $(".form-chat").scrollTop($(".form-chat")[0].scrollHeight);
    }
   });
});
function renderListUser(arr){
    return arr.map(function(item){
        return "<li>"+ item +"</li>";
    });
}
