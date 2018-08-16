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
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(this).text("Like");
        console.log($(".value").text());
        var number = parseInt($(".value").text());
        $(".value").text(number-1);
    }
    else{
        $(this).addClass("active");
        $(this).text("Liked");
        var number = parseInt($(".value").text());
        $(".value").text(number+1);
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

let url = "/getSeriesAllById/" + serial;
$.get(url)
.done(function(data){
        // console.log("number of seasons" + episodes[episodes.length - 1].airedSeason);
        if ( data !== null && typeof data === "object"){
            console.log(data);
            let numberOfSeasons = getNumberOfSeasons(data.episodes);
            let arrayEpisodes = getArrayEpisodes(data.episodes , numberOfSeasons);
            console.log(arrayEpisodes);
            appendSeasons(arrayEpisodes);
        }
});


function appendSeasons(data){
    let stringToAppend = "";
    if(data[0] != 0){
        stringToAppend += "<li class='list-group-item'><span class='badge'>" + data[0] + "</span><h4 class='list-group-item-heading'><a href='/main'>Specials</a></li>";
    }
    for(let i = 1 ; i < data.length ; i++){
        if(data[0] != 0){
            stringToAppend += "<li class='list-group-item'><span class='badge'>" + data[i] + "</span><h4 class='list-group-item-heading'><a href='/main'>Season " + i + "</a></li>";
        }
    }
    $(".list-group.list-group-condensed").append(stringToAppend);
}

function getNumberOfSeasons(data){
    let max = 0;
    data.forEach(function(episode){
            if(episode.airedSeason > max){
                max = episode.airedSeason;
            }
    });
    return max;
}

function getArrayEpisodes(data , numberOfSeasons){
    let i=0;
    let arrayEpisodes = new Array(numberOfSeasons + 1);
    arrayEpisodes.fill( 0 , 0 );
    while( i < data.length){
        arrayEpisodes[data[i].airedSeason] += 1;
        i++;
    }
    return arrayEpisodes;
}

