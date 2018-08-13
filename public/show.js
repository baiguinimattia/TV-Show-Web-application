var serial = $(".hidden.serial").text(); 
$(".addList").click(function() {    
    var url = "/" + serial;
    $.post(url , { addList : true , addLike : false } , function( data ){
            // console.log(data);
    })
});
$(".addLike").click(function() {
    var url = "/" + serial;
    $.post(url , { addList : false , addLike : true } , function( data ){
            // console.log(data);
    })
});
if($(".hidden.list").text() == "true"){
    $(".toggle.addList").addClass("active");
    $(".toggle.addList").text("Added to my list");
}

if($(".hidden.like").text() == "true"){
    $(".toggle.addLike").addClass("active");
    $(".toggle.addLike").text("Liked");
}

$(".toggle.addLike").click(function(){
    var likes = $(".hidden.numberOfLikes").text();
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(this).text("Like");
    }
    else{
        $(this).addClass("active");
        $(this).text("Liked");
    }
})
$(".toggle.addList").click(function(){
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(this).text("Add to my list");
    }
    else{
        $(this).addClass("active");
        $(this).text("Added to my list");
    }
})