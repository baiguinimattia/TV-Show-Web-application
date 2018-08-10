$("#addList").click(function() {
    var serial = $(".hidden").text();    
    var url = "/" + serial;
    $.post(url , { add : true } , function( data ){
            console.log(data);
    })
});
