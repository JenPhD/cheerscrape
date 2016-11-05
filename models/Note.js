// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the Note schema
var NoteSchema = new Schema({
    //save one email's ObjectId
    email: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // just a string
    title: {
        type:String,
        required: "Title of note required"
    },
    // just a string
    body: {
        type:String
    },
    gitrepo: {
        type:String
    },
    noteDate: {
        type:Date,
        default: Date.now
    }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes.
// These ids are referred to in the Article model.

// create the Note model with the NoteSchema
var Note = mongoose.model('Note', NoteSchema);

// export the Note model
module.exports = Note;
