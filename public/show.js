$("#addList").click(function() {
    var url = "/show/" + serial.id;
    $.post(url , function( data ){
            console.log(data);
    })
});