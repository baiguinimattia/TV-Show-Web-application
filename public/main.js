$(Window).ready(function(){
    let apiKey = "ea292d4cc2f43826307ecabbdcd5e198";
    let url = "https://api.themoviedb.org/3/tv/popular?api_key=" + apiKey + "&language=en-US&page=1";
    $.getJSON(url)
    .done(function(data){
        if(data !== null && typeof data === "object"){                
            console.log(data.results);
            // let serials = JSON.stringify(data);
            // let finalData = JSON.parse(serials);
            // console.log(finalData);
        }
    })
});

// getRecommended();
function getRecommended(){
    let presentTime = $.now();
    let url = "/updated/" + presentTime;
    $.get(url)
    .done(function(data){
            if ( data !== null && typeof data === "object"){
                console.log(data);
            }
    });
}