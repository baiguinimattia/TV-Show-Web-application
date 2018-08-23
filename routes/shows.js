const express = require("express");
const router = express.Router();
const request = require("request");
const Show = require("../models/show"),
    middleware = require("../middleware/index.js");

//api
const TVDB = require('node-tvdb');

const tvdb = new TVDB('5YFSVMD76MRV5ZB7');


router.get("/search/:text" , function(req , res){
    const text = req.params.text;
    tvdb.getSeriesByName(text)
        .then(response => { 
            res.send(response);   
        })
        .catch(error => {                     
            console.log(res.body);
            console.log(error); 
        });
});
    
router.get("/search/id/:text" , function( req , res){
        const text = req.params.text;
        tvdb.getSeriesById(text)
        .then(response => { 
            res.send(response);        
        })
        .catch(error => {                     
            console.log(res.body);
            console.log(error); 
        });
    
});

router.get("/user/mylist" , middleware.isLoggedIn , function(req , res){
    let list = [];
    User.find( { _id : req.user._id} , function(error , foundUser){
        if(error){
            console.log(error);
        }
        else{
            if(foundUser.length > 0){
                foundUser[0].myList.forEach(function(element){
                    list.push(element.idSerial);
                })
                res.send({ myList : list });
            }
        }
    })
});
    
router.get("/mylist" , middleware.isLoggedIn , function ( req , res) {
    res.render("mylist");
});

router.post("/season/:id" , function(req , res){
        let id = req.params.id;
        let arrayEpisodes = req.body.arrayEpisodes;
        let idSerial = req.body.idSerial;
        console.log(req.body);
        res.send(appendDropdown(idSerial , id , arrayEpisodes[id]));
});

    
router.get("/idSerial/:id/season/:season/episode/:episode" , function(req , res){
    User.find({ _id : req.user._id } , function(error , foundUser){
        if(error){
            console.log(error);
        }
        else{
            if(foundUser.length > 0){
                foundUser[0].myList.forEach(function(serial){
                    if(serial.idSerial === req.params.id){
                        serial.currentSeason = req.params.season;
                        serial.currentEpisode = req.params.episode;
                        updateUser(foundUser[0]);
                        req.flash("success" , "The data has been succesfully updated.");
                        res.redirect("/myList");
                    }
                })
            }
        }
    });
});


//getEpisodeBySeriesId
router.get("/getSeriesAllById/:id" , function(req , res){
    let id = req.params.id;
    tvdb.getSeriesAllById(id)
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            console.log(error);
        });
});

router.get("/actors/:id" , function(req , res){
    let id = req.params.id;
    tvdb.getActors(id)
    .then(response => {
        res.send(response);
    })
    .catch(error => {
        console.log(error);
    });

});
 
router.get("/popular" , function(req , res){
    let apiKey = "ea292d4cc2f43826307ecabbdcd5e198";
    let url = "https://api.themoviedb.org/3/tv/popular?api_key=" + apiKey + "&language=en-US&page=1";
    request(url , function( error , response , body){
        if(error){
            console.log(error);
        }
        else{
            console.log("statusCode " + response.statusCode );
            res.send(body);
        }
    })
});



router.get("/:id" , middleware.isLoggedIn , function( req , res){
    let id = req.params.id;
    tvdb.getSeriesById(id)
    .then(response => { 
        getImages(id , function(image){
            getLikes(id , function(likes){
                User.find({ _id : req.user._id } , function( error , foundUser){
                    if(foundUser.length > 0){
                        checkLists(foundUser[0] , id , function(data){
                            let ifLike = false;
                            let ifList = false;
                            foundUser[0].likes.forEach(function(element){
                                if(element.idSerial == id){
                                    ifLike = true;
                                }
                            })
                            foundUser[0].myList.forEach(function(element){
                                if(element.idSerial == id){
                                            ifList = true;
                                }
                            })
                            res.render("show" , { serial : response , image : image , likes : likes , ifLike : ifLike , ifList : ifList}); 
                        })
                    }
                })
            })
        });
    })
    .catch(error => {           
        if(error.response.status == 404){
            console.log(error.response.status + "   " + error.response.statusText + "   " + error.response.url);
        }   
        else{
            console.log(error); 
        }       
    });
});


router.post("/:id" , middleware.isLoggedIn , function( req , res){
    let originalId = req.params.id;
    let addList = req.body.addList;
    let addLike = req.body.addLike;
    Show.find({originalId : originalId } , function(error , data){
        if( error){
            console.log(error);
        }
        else{
            if(data.length > 0 ){
                console.log("gasit");
                User.find( { _id : req.user._id} , function( error , foundUser){
                    if(error){
                            console.log(error);
                    }
                    else{
                            if(foundUser.length > 0){
                                checkLists(foundUser[0] , originalId , function(search){
                                    console.log(search);
                                    if(addList == "true"){
                                        if(search.addList && search.positionInList != -1){
                                            foundUser[0].myList.splice(search.positionInList, 1);
                                            updateUser(foundUser[0]);
                                            console.log("element gasit + apasat = stergere");
                                            console.log("decrementam numarul de liste");
                                            data[0].numberOfLists -= 1;
                                            updateShow(data[0]);
                                        }
                                        else{
                                            var serial = { idSerial : originalId};
                                            foundUser[0].myList.push(serial);
                                            updateUser(foundUser[0]);
                                            data[0].numberOfLists += 1;
                                            updateShow(data[0]);
                                        }
                                    }
                                    if(addLike == "true"){
                                            if(search.addLike && search.positionInLike != -1){
                                                foundUser[0].likes.splice(search.positionInLike, 1);
                                                console.log("element gasit + apasat = stergere");
                                                updateUser(foundUser[0]);
                                                data[0].numberOfLikes -= 1;
                                                updateShow(data[0]);
                                            }
                                            else{
                                                    var serial = { idSerial : originalId};
                                                    foundUser[0].likes.push(serial);
                                                    console.log("am adaugat serialul curent in lista de like a user'ului");
                                                    updateUser(foundUser[0]);
                                                    data[0].numberOfLikes += 1;
                                                    updateShow(data[0]);
                                                }
                                    }
                                });
                                
                            }           
                    }
                });
            }
            else{
                if(addList == "true"){
                    var newShow = new Show({ originalId : originalId , numberOfLikes : 0 , numberOfLists : 1});
                }
                else{
                    var newShow = new Show({ originalId : originalId , numberOfLikes : 1 , numberOfLists : 0});
                }
                Show.create(newShow , function(error , newSerial){
                    if( error){
                        console.log(error);
                    }
                    else{
                        newSerial.save();
                        User.find({ _id : req.user._id} , function( error , foundUser){
                            if( error){
                                console.log(error);
                            }
                            else{
                                if(foundUser.length > 0){
                                    console.log(originalId);
                                    foundUser[0].myList.push( { idSerial : originalId } );
                                    updateUser(foundUser[0]);
                                }
                            }
                        })

                    
                    }
                });
            } 
        }
    })
});

router.get("/updated/:time" , function(req , res){
    let time = req.params.time;
    tvdb.getUpdates(time)
    .then(response => { 
        
    })
    .catch(error => { 
        
    });
});




function appendDropdown( idSerial , season , numberOfEpisodes){
    let stringToAppend = "";
    if(numberOfEpisodes > 0 ){
        for( let i = 1 ; i <= numberOfEpisodes; i++){
                    stringToAppend += "<a class='dropdown-item'  href='/idSerial/" + idSerial + "/season/" + season + "/episode/" + i + "'>" + "Episode " + i + "</a>";
        }
    }
    return stringToAppend;
};


function getLikes(id , callback){
    Show.find({originalId : id} , function(error , foundShow){
        if(error){
            console.log(error);
        }
        else{
            if(foundShow.length > 0){
                callback(foundShow[0].numberOfLikes);
            }
            else{
                callback(0);
            }
        }
    });
};
        
function getImages(id , callback){
    tvdb.getSeriesImages(id , "fanart")
                .then(responseImage => { 
                    callback(responseImage[0]);   
                })
                .catch(error => {                     
                    console.log(error);
                });
};


function updateUser(user){
    User.findByIdAndUpdate( user._id , user , function( error , updatedUser){
        if ( error){
                console.log(error);
        }
        else{
                console.log(updatedUser);
       }
    });
};

function updateShow(show){
    Show.findByIdAndUpdate( show._id , show , function( error , updatedShow){
        if ( error){
                console.log(error);
        }
        else{
                console.log("show updated");
       }
    });
};



function checkLists(user , originalId , callback){
    let addList = false;
    let positionInList = -1;
    let addLike = false;
    let positionInLike = -1;
    for(let i=0; i < user.myList.length ; i++ ){
        if(user.myList[i].idSerial == originalId){
            addList = true;
            positionInList = i;
        }
    }
    for(let i=0; i < user.likes.length ; i++ ){
        if(user.likes[i].idSerial == originalId){
            addLike = true;
            positionInLike = i;
        }
    }
    let object = { addList : addList , positionInList : positionInList , addLike : addLike , positionInLike : positionInLike };
    callback(object);
};   

module.exports = router;    