var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose");

var ShowSchema  = new mongoose.Schema({
    originalId : String,
    numberOfLikes : { type: Number, default: 0 },
    numberOfLists : { type: Number, default: 0 }
});

ShowSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Show" , ShowSchema);
