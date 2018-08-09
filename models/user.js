var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema  = new mongoose.Schema({
    username: String,
    password : String,
    shows : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Show"
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , UserSchema);
