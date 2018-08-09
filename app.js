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



mongoose.connect("mongodb://localhost:27017/licentaDB" , {useNewUrlParser : true});
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

app.post("/login" , passport.authenticate("local" , {successRedirect : "/main" , failureRedirect : "/login" , failureFlash: true , successFlash: 'Welcome!'  }), function(req , res ){
    
});

app.get("/logout" , isLoggedIn , function(req , res){
    req.logout();
    req.flash("error" , "Logged you out!");
    res.redirect("/main");
})

// app.get("https://api.thetvdb.com/search/series/:name" , function(req , res){


app.get("/search" , isLoggedIn ,  function( req , res){
        res.render("search");
});


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
    tvdb.getSeriesPosters(text)
    .then(response => { 
        console.log(response);
        // res.send(response[0].fileName);  
        res.send(response);        

    })
    .catch(error => {                     
        console.log(res.body);
        console.log(error); 
    });

});



app.get("/:id" , isLoggedIn , function( req , res){
    var id = req.params.id
    // console.log(id);
    tvdb.getSeriesById(id)
    .then(response => { 
                console.log("vine serial pentru show");
                // console.log(response);
                tvdb.getSeriesImages(id , "fanart")
                .then(responseImage => { 
                    console.log("vine response de la searchPosters");
                    // console.log(responseImage[0]);
                    // res.send(response[0].fileName);  
                    res.render("serial" , { show : response , images : responseImage });      
                })
                .catch(error => {                     
                    console.log(error);
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
        


app.get("/mylist" , function ( req , res) {
    res.render("mylist");
});


app.post("/:id" , isLoggedIn , function( req , res){
    var originalId = req.params.id;
    var ifLiked = false;
    var ifList = true;
    var user = {
        id : req.user._id,
        ifLiked : ifLiked,
        ifList : ifList
    }
    Show.find({originalId : "274431"} , function(error , data){
        if( error){
            console.log(error);
        }
        else{
            if(data.length > 0 ){
                console.log("gasit");
                console.log(data[0].users);
                var exists = false;
                data[0].users.forEach(function(user){
                        if (user._id.equals(req.user._id)){
                            console.log("am gasit user'ul curent in serial")
                            exists = true;
                        }
                });
                if(!exists){
                    console.log("nu exista user in serial si se adauga")
                    data[0].users.push(req.user._id);

                    console.log("se salveaza serialul adaugand user'ul curent");
                    data[0].save(function(error , updatedShow){
                        if( error ) {
                            console.log(error);
                        }
                        else{
                            console.log(updatedShow);
                        }
                       
                    });

                    console.log("adaugam serialul la user curent");

                    User.find( { _id : req.user._id} , function( error , foundUser){
                        if( error){
                            console.log(error);
                        }
                        else{
                            if(foundUser.length > 0 ){
                                console.log("user gasit pentru a se adauga serialul");
                                foundUser[0].shows.push({ idSerial : originalId } );
                            }
                        }
                    })
                }                
            }
            else{
                var newShow = new Show({ originalId : originalId , ifLiked , ifList});
                newShow.users.push(user);
                console.log("new");
                console.log(newShow);
                Show.create(newShow , function(error , newSerial){
                    if( error){
                        console.log(error);
                        req.flash("error" , "The show was not created.");
                        // res.render("search");
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
                                    foundUser[0].shows.push( { idSerial : originalId } );
                                    console.log("aratam array de seriale" + foundUser[0].shows);
                                    foundUser[0].save(function (error , updatedUser) {
                                        if( error){
                                            console.log(error);
                                        }
                                        else{
                                            console.log("updated user with serial");
                                        }
                                    });
                                }
                            }
                        })



                        req.flash("success" , "The show was succesfully created.");
                        // res.redirect("back");
                    }
                });
            }

            
        }
    })



    
});



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

