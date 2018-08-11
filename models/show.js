var mongoose = require("mongoose")

var ShowSchema  = new mongoose.Schema({
    originalId : String,
    numberOfLikes : { type: Number, default: 0 },
    numberOfLists : { type: Number, default: 0 }
});

module.exports = mongoose.model("Show" , ShowSchema);
