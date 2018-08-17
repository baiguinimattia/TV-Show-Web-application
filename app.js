var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport");
    localStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    User           = require("./models/user");
    Show           = require("./models/show");

//api
const TVDB = require('node-tvdb');
const tvdb = new TVDB('5YFSVMD76MRV5ZB7');

mongoose.connect("mongodb://localhost:27017/licenta" , {useNewUrlParser : true});
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));

app.use(bodyParser.json())

//error messages
app.use(flash());

//configure passport

app.use(require("express-session")({
    secret: "This is ok",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req , res , next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/" , function( req , res){
        res.render("landing");
});

app.get("/main" , function(req , res){
        res.render("main" , { currentUser : req.user});
});



//authentication routes
//register
app.get("/register" , function( req , res){
    res.render("register");
});

app.post("/register" , function( req , res){
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , function( error , user){
        if(error){
            req.flash("error" , error.message);
            res.redirect("back");
        }
        passport.authenticate("local")( req , res , function(){
            req.flash("success" , "You have registered succesfully!");
            res.redirect("/main");
        })
    });
});

//login
app.get("/login"  , function( req , res){
    res.render("login");
});

app.post("/login" , passport.authenticate("local" , {successRedirect : "/main" , failureRedirect : "/login" , failureFlash: true , successFlash: 'Welcome!'  }), function(req , res ){});

app.get("/logout" , isLoggedIn , function(req , res){
    req.logout();
    req.flash("error" , "Logged you out!");
    res.redirect("/main");
})

// app.get("/search" , isLoggedIn ,  function( req , res){
//         res.render("navbartest");
// });

app.get("/search/:text" , function(req , res){
    var text = req.params.text;
    tvdb.getSeriesByName(text)
                .then(response => { 
                    res.send(response);
                    
                })
                .catch(error => {                     
                    console.log(res.body);
                    console.log(error); 
                });

});

app.get("/search/id/:text" , function( req , res){
    var text = req.params.text;
    tvdb.getSeriesById(text)
    .then(response => { 
        res.send(response);        
    })
    .catch(error => {                     
        console.log(res.body);
        console.log(error); 
    });

});

app.get("/mylist" , isLoggedIn , function ( req , res) {
    var list = [];
    console.log(req.user._id);
    User.find( { _id : req.user._id} , function(error , foundUser){
        if(error){
            console.log(error);
        }
        else{
            if(foundUser.length > 0){
                foundUser[0].myList.forEach(function(element){
                    list.push(element.idSerial);
                    console.log(element.idSerial);
                })
                res.render("mylist" , { myList : list });
            }
        }
    })

});

app.post("/season/:id" , function(req , res){
    let id = req.params.id;
    let arrayEpisodes = req.body.arrayEpisodes;
    res.send(appendDropdown(arrayEpisodes[id]));
});

function appendDropdown(numberOfEpisodes){
    let stringToAppend = "";
    if(numberOfEpisodes > 0 ){
        stringToAppend += "<div class='dropdown'><button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Seasons</button><div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>";
        for( let i = 1 ; i <= numberOfEpisodes; i++){
                    stringToAppend += "<a class='dropdown-item' href='/episode/" + i + "'>" + "Episode " + i + "</a>";
        }
        stringToAppend += "</div></div>";
    }
    return stringToAppend;
}

//getEpisodeBySeriesId
app.get("/getSeriesAllById/:id" , function(req , res){
    var id = req.params.id;
    tvdb.getSeriesAllById(id)
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/:id" , isLoggedIn , function( req , res){
    var id = req.params.id;
    tvdb.getSeriesById(id)
    .then(response => { 
                getImages(id , function(image){
                    console.log("callback getImages");
                    getLikes(id , function(likes){
                    console.log("se intra in getLikes " + likes);
                        User.find({_id : req.user._id} , function(error , foundUser){
                            if(foundUser.length > 0){
                                console.log("am gasit user");

                                checkLists(foundUser[0] , id , function(data){
                                    console.log("se intra in checkLists");
                                    var ifLike = false;
                                    var ifList = false;
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
                                    // console.log("se transmit datele");
                                    // console.log("image " + image + " likes " + likes + " ifLike " + ifLike + " ifList " + ifList);
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

app.post("/:id" , isLoggedIn , function( req , res){
    var originalId = req.params.id;
    var addList = req.body.addList;
    var addLike = req.body.addLike;
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
                                            console.log("am adaugat serialul curent in lista user'ului");
                                            console.log("incrementam numarul de liste al serialului curent");
                                            data[0].numberOfLists += 1;
                                            updateShow(data[0]);
                                        }
                                    }
                                    if(addLike == "true"){
                                            if(search.addLike && search.positionInLike != -1){
                                                foundUser[0].likes.splice(search.positionInLike, 1);
                                                console.log("element gasit + apasat = stergere");
                                                updateUser(foundUser[0]);
                                                console.log("decrementam numarul de like");
                                                data[0].numberOfLikes -= 1;
                                                updateShow(data[0]);
                                            }
                                            else{
                                                    var serial = { idSerial : originalId};
                                                    foundUser[0].likes.push(serial);
                                                    console.log("am adaugat serialul curent in lista de like a user'ului");
                                                    updateUser(foundUser[0]);
                                                    console.log("incrementam numarul de likes al serialului curent");
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
                console.log("vine original id la creare " + originalId);
                if(addList == "true"){
                    var newShow = new Show({ originalId : originalId , numberOfLikes : 0 , numberOfLists : 1});
                }
                else{
                    var newShow = new Show({ originalId : originalId , numberOfLikes : 1 , numberOfLists : 0});
                }
                console.log("new");
                console.log(newShow);
                Show.create(newShow , function(error , newSerial){
                    if( error){
                        console.log(error);
                    }
                    else{
                        console.log(newSerial);
                        newSerial.save();
                        console.log("cautam user'ul curent si adaugam serialul dupa crearea acestuia");
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
    })
}
        
function getImages(id , callback){
    tvdb.getSeriesImages(id , "fanart")
                .then(responseImage => { 
                    callback(responseImage[0]);   
                })
                .catch(error => {                     
                    console.log(error);
                });
}

function updateUser(user){
    User.findByIdAndUpdate( user._id , user , function( error , updatedUser){
        if ( error){
                console.log(error);
        }
        else{
                console.log("user updated");
       }
    });
}

function updateShow(show){
    Show.findByIdAndUpdate( show._id , show , function( error , updatedShow){
        if ( error){
                console.log(error);
        }
        else{
                console.log("show updated");
       }
    });
}

function checkLists(user , originalId , callback){
    var addList = false;
    var positionInList = -1;
    var addLike = false;
    var positionInLike = -1;
    for(var i=0; i < user.myList.length ; i++ ){
        if(user.myList[i].idSerial == originalId){
            addList = true;
            positionInList = i;
        }
    }
    for(var i=0; i < user.likes.length ; i++ ){
        if(user.likes[i].idSerial == originalId){
            addLike = true;
            positionInLike = i;
        }
    }
    var object = { addList : addList , positionInList : positionInList , addLike : addLike , positionInLike : positionInLike };
    callback(object);
}    

function isLoggedIn( req , res , next){
    // console.log(req);
    if( req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You need to be logged in to do that.");
    res.redirect("/login");
};

app.listen( 3000 , function(){
    console.log("Server Running!");
});