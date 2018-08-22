getRecommended();

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