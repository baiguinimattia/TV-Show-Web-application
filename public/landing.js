$(".btn").click(function(){
    alert("ttttt");
    $.get(url)
    .done(function(data){
        if ( data.case == true){
            console.log(data);
            window.location.replace(data);
        }
        else{
            console.log("A fost fals");
        }


    })
});