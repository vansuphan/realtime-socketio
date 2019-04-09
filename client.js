$(document).ready(function(){
    var htmlListUser = document.getElementById("list-user");
    var socket = io.connect('http://localhost:3000');
    socket.on('even_user_online', function(arrClient){
        var stringUser = renderListUser(arrClient);
        htmlListUser.innerHTML = stringUser.join('');
        console.log(htmlListUser);
        //$(".list-user").html(renderListUser(arrClient));
    });

});
function renderListUser(arr){
    return arr.map(function(item){
        return "<li>"+ item +"</li>";
    });
}
