var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema  = new mongoose.Schema({
    username: String,
    password : String,
    likes : [{
        idSerial : String
    }],
    myList : [{
        idSerial : String
    }]

    // shows : [{
    //     idSerial : String
    // }]

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , UserSchema);
