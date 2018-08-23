let listOfEpisodeArrays = new Array({ id : String , array : Array});
getList(function(data){
        loadList(data , function(){      
            hideLoader();
            $(".dropdown-item.season").click(function(){
                let sibling = $(this).parent().parent().siblings(".dropdown").children(".dropdown-menu");
                let url ="/season/" + $(this).attr("data-season-id");
                let id = $(this).closest(".card-body").children("a").attr("href").substring(1);
                let arrayEpisodes;
                for(let i=0; i < listOfEpisodeArrays.length ; i++){
                    console.log(typeof listOfEpisodeArrays[i].id);
                    if(listOfEpisodeArrays[i].id == id){
                        arrayEpisodes = listOfEpisodeArrays[i].array;
                        $.post(url , { idSerial : id, arrayEpisodes : arrayEpisodes } , function( data ){
                            sibling.text("");
                            sibling.append(data);                                
                        })
                    }
                }        
            });        
        });
});

function loadList(objects , callback){
    if(objects.length > 0){
        let number = 1;
        let stringToAppend = "";
        objects.forEach(function(element){
            let url = "/getSeriesAllById/" + element;
            $.get(url)
            .done(function(serial){
                if(serial.overview != "" && serial.overview != null){
                    if(serial.banner != ''){
    
                        var image = "https://www.thetvdb.com/banners/" + serial.banner;
                    }
                    else{
                        var image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnYYwEvCRhV5HQ0Be6g74VLIy6fEwLG7NscqPijOmQuQzKxpcN";
                    }
                        if ( number%2 == 1 && number == objects.length ){
                            stringToAppend += "<div class='row'><div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'><a href=/'" + serial.id + "'>" + serial.seriesName + "</a></h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/"+ serial.id + "' class='btn btn-primary'>Find out more</a><div class='ui right floated tiny horizontal statistic'><div class='value'>" + serial.siteRating + "</div><div class='label'><a href='https://www.imdb.com/title/" + serial.imdbId + "'>IMDB</a> Rating</div>" + appendDropdowns(serial) + "</div></div></div></div></div>" ;
                            needCallback(stringToAppend , function(){
                                callback();
                            })
                            stringToAppend = "";
                        }
                        else{
                            if ( number%2 != 1 ){
                                stringToAppend += "<div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'><a href=/'" + serial.id + "'>" + serial.seriesName + "</a></h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/"+ serial.id +"' class='btn btn-primary'>Find out more</a><div class='ui right floated tiny horizontal statistic'><div class='value'>" + serial.siteRating + "</div><div class='label'><a href='https://www.imdb.com/title/" + serial.imdbId + "'>IMDB</a> Rating</div>" + appendDropdowns(serial) + "</div></div></div></div>"
                                stringToAppend += "</div>"
                                if(number == objects.length){
                                    needCallback(stringToAppend , function(){
                                        callback();
                                    })
                                }
                                else{
                                    $(".home-content").append(stringToAppend);
                                }    
                                stringToAppend = "";
                            }
                            else{
                                if( number != 0 && number%2 == 1 ){
                                    stringToAppend += "<div class='row'><div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'><a href=/'" + serial.id + "'>" + serial.seriesName + "</a></h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/"+ serial.id + "' class='btn btn-primary'>Find out more</a><div class='ui right floated tiny horizontal statistic'><div class='value'>" + serial.siteRating + "</div><div class='label'><a href='https://www.imdb.com/title/" + serial.imdbId + "'>IMDB</a> Rating</div>" + appendDropdowns(serial) + "</div></div></div></div>"
                                }                                
                            }
                        }    
                        number++;
                }
            });
        });
    }
    else{
        hideLoader();
    }    
};

function getList(callback){
    let url = "/user/mylist";
    $.get(url)
    .done(function(data){
        callback(data.myList);
    });
};

function hideLoader(){
    $(".loader").removeClass("active");
    $(".loader").addClass("hidden");
    $(".home-content").removeClass("hidden");
};

function needCallback(string, callback){
    $(".home-content").append(string);
    callback();
};

function appendDropdowns(data){
    if ( data !== null && typeof data === "object"){
        let stringToAppend = "";
        let numberOfSeasons = getNumberOfSeasons(data.episodes);
        let arrayEpisodes = getArrayEpisodes(data.episodes , numberOfSeasons);
        listOfEpisodeArrays.push({ id : data.id  , array : arrayEpisodes});
        if(arrayEpisodes.length > 0 ){
            stringToAppend += "<div class='dropdown'><button class='btn btn-secondary btn-sm dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Seasons</button><div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>";
            for( let i = 0 ; i < arrayEpisodes.length ; i++){
                if(arrayEpisodes[i] > 0){
                    if(i == 0){
                        stringToAppend += "<a class='dropdown-item season' href='#' data-season-id='" + i + "'>" + "Special season" + "</a>";
                    }
                    else{
                        stringToAppend += "<a class='dropdown-item season' href='#' data-season-id='" + i + "'>" + "Season " + i + "</a>";
                    }
                }
            }
            stringToAppend += "</div></div>";
        }
        stringToAppend += "<div class='dropdown'><button class='btn btn-secondary btn-sm dropright dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Episodes</button><div class='dropdown-menu episodes' aria-labelledby='dropdownMenuButton'></div></div>"
        return stringToAppend ;
    }
};

function getNumberOfSeasons(data){
    let max = 0;
    data.forEach(function(episode){
            if(episode.airedSeason > max){
                max = episode.airedSeason;
            }
    });
    return max;
};

function getArrayEpisodes(data , numberOfSeasons){
    let i=0;
    let arrayEpisodes = new Array(numberOfSeasons + 1);
    arrayEpisodes.fill( 0 , 0 );
    while( i < data.length){
        arrayEpisodes[data[i].airedSeason] += 1;
        i++;
    };
    return arrayEpisodes;
};