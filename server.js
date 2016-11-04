//Dependencies for express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Dependencies for scraper:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/awesamsara');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
    console.log('Mongoose connection successful.');
});

// And we bring in our models/collections
var Note = require('./models/Note.js');
var WebVol = require('./models/WebVol.js');
var Trip = require('./models/Trip.js');
var User = require('./models/User.js');

// first, tell the console what server2.js is doing
console.log("\n******************************************\n" +
    "Grabbing every web developer opportunity\n" +
    "from the Volunteer Match website:" +
    "\n******************************************\n")

// Now, make a request call for the "web developer" search on Volunteer Match.
request('http://www.volunteermatch.org/search/virtual?k=web+developer&searchOpps=&v=true&s=1&o=recency&l=Apopka%2C+FL%2C+USA&r=virtual&sk=&specialGroupsData.groupSize=&na=&partner=&usafc=#k=web+developer&v=true&s=1&o=recency&l=Apopka%2C+FL%2C+USA&r=virtual&sk=&specialGroupsData.groupSize=&na=&partner=&usafc=',
    function (error, response, html) {

    // Load the html into cheerio and save it to a var.
    // '$' becomes a shorthand for cheerio's selector commands,
    //  much like jQuery's '$'.
    var $ = cheerio.load(html);

    // an empty array to save the data that we'll scrape
    var result = [];

    // With cheerio, find each title of the volunteer opportunity
        //Not the read_more link which shares the psr_link class
    // (i: iterator. element: the current element)
    $('a.psr_link:not(.read_more)').each(function(i, element) {

        // save the text of the element (this) in a "title" variable
        var title = $(this).text();

        // In the currently selected element,
        // look at the href attribute value for the link
        // then save the values for any "href" attributes
        //concatenate with main weblink
        var link = 'www.volunteermatch.org' + $(this).attr('href');

        // save these results in an object that we'll push
        // into the result array we defined earlier
        result.push({
            title: title,
            link: link
        });
    });

    // log the result once cheerio analyzes each of its selected elements
    console.log(result);
});

// listen on port 3000
app.listen(3000, function() {
    console.log('App running on port 3000!');
});
