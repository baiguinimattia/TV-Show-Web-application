$("#addList").click(function() {
    var serial = $(".hidden").text();    
    var url = "/" + serial;
    $.post(url , function( data ){
            console.log(data);
    })
});
