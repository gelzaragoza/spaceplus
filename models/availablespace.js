var mongoose   = require('mongoose');

var SpaceSchema = new mongoose.Schema({
    name:         String,
    location:     String,
    image:        String,
    kitchen:      String,
    bedroom:      String,
    bathroom:     String,
    sqrfootage:   String,
    description:  String,
    rate:         String
});

module.exports = mongoose.model("Space", SpaceSchema);