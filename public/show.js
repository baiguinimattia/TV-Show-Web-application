var serial = $(".hidden").text(); 
$("#addList").click(function() {    
    var url = "/" + serial;
    $.post(url , { addList : true , addLike : false } , function( data ){
            console.log(data);
    })
});
$("#addLike").click(function() {
    var url = "/" + serial;
    $.post(url , { addList : false , addLike : true } , function( data ){
            console.log(data);
    })
});
