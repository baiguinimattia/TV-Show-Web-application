//get request for search page
$( "#search" ).click(function() {
    //remove previous search results
    $("#results").text("");

    var search = $( "input[name='text']" ).val();
    var url = "/search/" + search;
    $.get(url)
    .done(function(data){
        console.log(data);
        if ( data !== null && typeof data === 'object'){
            // $("#searchResult").text(data[0]);
            var stringToAppend = "";
            var number = 1;
            var numberOfResults = data.length + 1;
            data.forEach(function(serial){
                    if(serial.overview != "" && serial.overview != null){
                        console.log(serial);
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
