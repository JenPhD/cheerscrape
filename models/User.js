// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var UserSchema = new Schema({
    // name is required
    name: {
        type:String,
        required:true
    },
    // email is required
    email: {
        type:String,
        required:true
    },
    // pwdhash is required
    pwdhash: {
        type:String,
        required:true
    },
    // this only saves one trip's ObjectId. ref refers to the Trip model.
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }
});

// Create the WebVol model with the ArticleSchema
var User = mongoose.model('User', UserSchema);

// export the model
module.exports = User;