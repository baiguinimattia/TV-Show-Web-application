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



app.get("/show/:id" , isLoggedIn , function( req , res){
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
                    res.render("show" , { show : response , images : responseImage });      
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


app.post("/show/:id" , isLoggedIn , function( req , res){
    var originalId = req.params.id;
    var ifLiked = false;
    var ifList = true;
    var user = {
        id : req.user._id,
        ifLiked : ifLiked,
        ifList : ifList
    }
    var newShow = new Show({ originalId : originalId , ifLiked , ifList});
    newShow.users.push(user);
    Show.create(function(error , show){
        if( error){
            console.log(error);
        }
        else{
            console.log(show);
            show.save();
            req.flash("success" , "The show was succesfully created.");
        }
    });
    
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

