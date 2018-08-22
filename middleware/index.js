var middlewareObj = {};
var User = require("../models/user"),
    Show = require("../models/show");


middlewareObj.isLoggedIn = function( req , res , next){
    if( req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;