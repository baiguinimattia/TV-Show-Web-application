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

//routes paths
var userRoutes = require("./routes/index");
    showRoutes = require("./routes/shows");

mongoose.connect("mongodb://localhost:27017/licenta" , {useNewUrlParser : true});
app.set("view engine" , "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json())

//error messages
app.use(flash());

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

//using routes
app.use(userRoutes);
app.use(showRoutes);

app.get("/*" , function(req , res){
    res.send("Error 404");
});

app.listen( 3000 , function(){
    console.log("Server Running!");
});