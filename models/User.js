// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var UserSchema = new Schema({
    // name is required
    name: {
        type:String,
        trim: true,
        required:"Username is required"
    },
    // email is required
    email: {
        type:String,
        unique:true,
        required: "Email is required",
        match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
    },
    // pwdhash is required
    pwdhash: {
        type:String,
        required: "Password is required"
    },
    // this only saves one trip's ObjectId. ref refers to the Trip model.
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }
});

// Create the User model with the UserSchema
var User = mongoose.model('User', UserSchema);

// export the model
module.exports = User;