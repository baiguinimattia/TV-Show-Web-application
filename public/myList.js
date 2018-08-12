var info = $(".hidden").text();

var objects = JSON.stringify(info);
var serials = JSON.parse(objects);
var data = serials.split(",");

loadList(data);


function loadList(objects){
    var number = 1;
    var stringToAppend = "";
    objects.forEach(function(element){
        var url = "/search/id/" + element;
        console.log(url);
        $.get(url)
        .done(function(serial){
            // if ( data !== null && typeof data === "object"){
            //         if(number%3==0){
            //             stringToAppend += "<div class='row'>";
                        
            //         }
            //         if(data.banner != ''){

            //             var image = "https://www.thetvdb.com/banners/" + data.banner;
            //         }
            //         else{
            //             var image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnYYwEvCRhV5HQ0Be6g74VLIy6fEwLG7NscqPijOmQuQzKxpcN";
            //         }
            //         if(number%3==2){
            //             stringToAppend += "<div class='col-xs-12 col-sm-4'><a href='/" + element + "'><img src='" + image + "' class='img-responsive'></a><h3><a href='/" + element + "'>" + data.seriesName + "</h3><p>" + data.overview.substring(0,200) + "</p></div></div>";
            //             $(".home-content").append(stringToAppend);
            //             console.log(stringToAppend);
            //             stringToAppend = "";
            //         }
            //         else{
            //             stringToAppend += "<div class='col-xs-12 col-sm-4'><a href='/" + element + "'><img src='" + image + "' class='img-responsive'></a><h3><a href='/" + element + "'>" + data.seriesName + "</h3><p>" + data.overview.substring(0,200) + "</p></div>";
            //         }

            //         number++;
                
            // }

            if(serial.overview != "" && serial.overview != null){
                if(serial.banner != ''){

                    var image = "https://www.thetvdb.com/banners/" + serial.banner;
                }
                else{
                    var image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnYYwEvCRhV5HQ0Be6g74VLIy6fEwLG7NscqPijOmQuQzKxpcN";
                }

                    if ( number%2 == 1 && number == objects.length ){
                        stringToAppend += "<div class='row'><div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + serial.seriesName + "</h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/"+ serial.id + "' class='btn btn-primary'>Go somewhere</a></div></div></div></div>" ;
                        $("#results").append(stringToAppend);
                        stringToAppend = "";
                    }
                    else{
                        if ( number%2 != 1 ){
                            stringToAppend += "<div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + serial.seriesName + "</h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/"+ serial.id +"' class='btn btn-primary'>Go somewhere</a></div></div></div>"
                            stringToAppend += "</div>"
                            $(".home-content").append(stringToAppend);
                            stringToAppend = "";
                        }
                        else{
                            if( number != 0 && number%2 == 1 ){
                                stringToAppend += "<div class='row'><div class='col-sm-6'><div class='card'><img class='card-img-top' src='" + image + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + serial.seriesName + "</h5><p class='card-text'>" + serial.overview.substring(0,50) + '...' + "</p><a href='/"+ serial.id + "' class='btn btn-primary'>Go somewhere</a></div></div></div>"

                            }                                
                        }
                    }    
                    number++;
            }

        });
    });

}