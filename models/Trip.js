// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var TripSchema = new Schema({
    // departure city
    depcity: {
        type:String,
        required:true
    },
    //destination city
    destcity: {
        type:String,
        required:true
    },
    //depart date
    departdate: {
        type:Date,
        required:true
    },
    //return date
    returndate: {
        type:Date,
        required:true
    },

    // this only saves one user's ObjectId. ref refers to the User model.
    email: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Create the Trip model with the TripSchema
var Trip = mongoose.model('Trip', TripSchema);

// export the model
module.exports = Trip;