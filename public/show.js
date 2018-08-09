$("#addList").click(function() {
    var url = "/274431"
    $.post(url , function( data ){
            console.log(data);
    })
});