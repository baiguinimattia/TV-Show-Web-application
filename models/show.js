var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose");

var ShowSchema  = new mongoose.Schema({
    originalId : String,
    users : [{
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        ifLiked : Boolean,
        ifList : Boolean
    }]
    
});

ShowSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Show" , ShowSchema);
