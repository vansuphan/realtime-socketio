$(document).ready(function(){

    var htmlListUser = document.getElementById("list-user");
    var socket = io.connect('http://localhost:3000');

    $(".main").hide();

    $("#input-name-user").keyup(function (event) { 
        if(event.keyCode === 13){
            let name = $(this).val();
            socket.emit("Client-sent-username", name);
            $(".main").show();
            $(".login").hide();
        }
        
    });

    socket.on('even_user_online', function(arrClient){
        var stringUser = renderListUser(arrClient);
        htmlListUser.innerHTML = stringUser.join('');
        $(".count-user").html("Co " + arrClient.length + " user online");
    });
   
});
function renderListUser(arr){
    return arr.map(function(item){
        return "<li>"+ item +"</li>";
    });
}
