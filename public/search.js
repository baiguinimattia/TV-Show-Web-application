
// var content = [{}];

//get request for search page
$( "#search" ).click(function() {
    //remove previous search results
    $("#results").text("");

    var search = $( "input[name='text']" ).val();
    var url = "/search/" + search;
    $.get(url)
    .done(function(data){
        if ( data !== null && typeof data === 'object'){
            // $("#searchResult").text(data[0]);
            var stringToAppend = "";
            var number = 1;
            var numberOfResults = data.length + 1;
            data.forEach(function(serial){
                    var urlTest = "/show/" + serial.id;
                    content.push({title : serial.seriesName , url : urlTest }); 
                    if(serial.overview != "" && serial.overview != null){
                        if(serial.banner != ''){

                            var image = "https://www.thetvdb.com/banners/" + serial.banner;
                        }
                        else{
                            var image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnYYwEvCRhV5HQ0Be6g74VLIy6fEwLG7NscqPijOmQuQzKxpcN";
                        }

                            if ( number%2 != 0 && number == numberOfResults ){
                                stringToAppend += "<div class='row'><div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + serial.seriesName + "</h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/show/"+ serial.id + "' class='btn btn-primary'>Go somewhere</a></div></div></div></div>" ;
                                $("#results").append(stringToAppend);
                                stringToAppend = "";
                            }
                            else{
                                if ( number%2 != 1 ){
                                    stringToAppend += "<div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + serial.seriesName + "</h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/show/"+ serial.id +"' class='btn btn-primary'>Go somewhere</a></div></div></div>"
                                    stringToAppend += "</div>"
                                    $("#results").append(stringToAppend);
                                    stringToAppend = "";
                                }
                                else{
                                    if( number != 0 && number%2 == 1 ){
                                        stringToAppend += "<div class='row'><div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + serial.seriesName + "</h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/show/"+ serial.id + "' class='btn btn-primary'>Go somewhere</a></div></div></div>"

                                    }                                
                                }
                            }    
                            number++;
                    }
                    else
                    {
                        numberOfResults--;
                    }    

            })
        }
        console.log(content);
    });
});

$("#searchId").click(function(){
    var search = $( "input[name='textid']" ).val();

    var url = "/search/id/" + search;
    $.get(url)
    .done(function(data){
        $("#idSearch").text("https://www.thetvdb.com/banners/" + data);
        $("#img").attr("src","https://www.thetvdb.com/banners/" + data);
    })
});



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
                        var url = "/show/" + serial.id;
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


// $("a .result").click( function(){
//     var url = $(this).href;
//     console.log(url);
//     $.get(url)
//     .done(function(data){
//         console.log("a mers");
//     })
// });

// $(".ui.search").bind('input', function(){
//     $(".results").text("");
//             //setting focus
//             focus = true;
//             //adding loading animation
//             $(".ui.search").addClass("loading");

//             var search = $( "input[class='prompt']" ).val();
//             var url = "/search/" + search;
//             $.get(url)
//             .done(function(data){
//                 console.log(data.length);
//                 if ( data !== null && typeof data === "object"){
//                     data.forEach(function(serial){
//                         var stringToAppend = "";
//                         var url = "/shows/" + serial.id;
//                         stringToAppend += "<a class='result' href='" + url + "'><div class='content'><div class='title'>" + serial.seriesName +"</div></div></a>";
//                         $(".results").append(stringToAppend);
//                         stringToAppend = "";
//                     })
                    
//                 }
//                 $(".ui.search").removeClass("loading");
//                 checkForFocus();
//             });
//   });

// $(".prompt").keypress(function(e){
//         if ( e.which == 13){
//             $(".results").text("");
//             //setting focus
//             focus = true;
//             //adding loading animation
//             $(".ui.search").addClass("loading");

//             var search = $( "input[class='prompt']" ).val();
//             var url = "/search/" + search;
//             $.get(url)
//             .done(function(data){
//                 console.log(data.length);
//                 if ( data !== null && typeof data === "object"){
//                     data.forEach(function(serial){
//                         var stringToAppend = "";
//                         var url = "/shows/" + serial.id;
//                         stringToAppend += "<a class='result' href='" + url + "'><div class='content'><div class='title'>" + serial.seriesName +"</div></div></a>";
//                         $(".results").append(stringToAppend);
//                         stringToAppend = "";
//                     })
                    
//                 }
//                 $(".ui.search").removeClass("loading");
//                 checkForFocus();
//             });

//         }
// });

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
