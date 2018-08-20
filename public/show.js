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
            let numberOfSeasons = getNumberOfSeasons(data.episodes);
            let arrayEpisodes = getArrayEpisodes(data.episodes , numberOfSeasons);
            console.log(arrayEpisodes);
            appendSeasons(arrayEpisodes);
        }
});
getActors(serial);


function appendSeasons(data){
    let stringToAppend = "";
    if(data[0] != 0){
        stringToAppend += "<li class='list-group-item'><span class='badge'>" + data[0] + "</span><h4 class='list-group-item-heading'><a href='/main'>Specials</a></li>";
    }
    for(let i = 1 ; i < data.length ; i++){
        if(data[i] != 0){
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

function getActors(id){
    let url = "/actors/" + serial;
    $.get(url)
    .done(function(actorsData){
            // console.log("number of seasons" + episodes[episodes.length - 1].airedSeason);
            if ( actorsData !== null && typeof actorsData === "object"){
                let stringToAppend = "";                
                actorsData.forEach(function(element){
                    if(element.sortOrder == 1 || element.sortOrder == 2 || element.sortOrder == 0){
                        console.log(element);
                        stringToAppend += "<div class='col-xs-6 col-sm-4 col-md-3 actors'><div class='thumbnail'><h3>"+ element.name +"<br><small>as " + element.role + "</small></h3><img class='img-responsive' src='https://www.thetvdb.com/banners/" + element.image + "'></div></div>"
                    }

                });
                $(".row.actors").append(stringToAppend);
            }
    });
}

