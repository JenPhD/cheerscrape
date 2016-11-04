// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var WebVolSchema = new Schema({
    // title is required
    title: {
        type:String,
        required:true
    },
    // link is required
    link: {
        type:String,
        required:true
    },
    // this only saves one note's ObjectId. ref refers to the Note model.
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

// Create the WebVol model with the ArticleSchema
var WebVol = mongoose.model('WebVol', WebVolSchema);

// export the model
module.exports = WebVol;
