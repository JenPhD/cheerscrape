// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var TripSchema = new Schema({
    // title is required
    depcity: {
        type:String,
        required:true
    },
    // link is required
    destcity: {
        type:String,
        required:true
    },
    departdate: {
        type:Date,
        required:true
    },
    returndate: {
        type:Date,
        required:true
    },

    // this only saves one note's ObjectId. ref refers to the Note model.
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

// Create the WebVol model with the ArticleSchema
var Trip = mongoose.model('Trip', TripSchema);

// export the model
module.exports = Trip;