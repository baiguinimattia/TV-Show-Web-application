var focus = false;

$(".prompt").keypress(function(key){
    if ( key.which == 13){
        $(".results").text("");
            //setting focus
            focus = true;
            //adding loading animation
            $(".ui.search").addClass("loading");
            var search = $( "input[class='prompt']" ).val();
            var url = "/search/" + search;
            $.get(url)
            .done(function(data){
                console.log(data.length);
                if ( data !== null && typeof data === "object"){
                    data.forEach(function(serial){
                        var stringToAppend = "";
                        var url = "/" + serial.id;
                        stringToAppend += "<a class='result' href='" + url + "'><div class='content'><div class='title'>" + serial.seriesName +"</div></div></a>";
                        $(".results").append(stringToAppend);
                        stringToAppend = "";
                    })
                    
                }
                $(".ui.search").removeClass("loading");
                checkForFocus();
            });
    }
});


$(".ui.search").click(function(event ){
    event.stopPropagation();
    console.log("e ok");
    focus = true;
    checkForFocus();

});
$(".results").click(function(event ){
    event.stopPropagation();
    console.log("e ok din results");
    focus = true;
    checkForFocus();
});

$(window).click(function(){
    console.log("nu e ok");
    focus = false;
    checkForFocus();
});

function checkForFocus(){
    if(focus && $(".results").text()!= ""){
        $(".search").addClass("focus");
        $(".results").addClass("visible");
        $(".results").removeClass("hidden");
        $(".results").css("display" , "block");
    }
    else{
        $(".search").removeClass("focus");
        $(".results").addClass("hidden");
        $(".results").removeClass("visible")
        $(".results").css("display" , "none");
    }
}
