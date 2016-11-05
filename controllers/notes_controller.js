var models = require('../models');
var express = require('express');
var router  = express.Router();

// Routes for Scraping
// ===========================================================

console.log("\n******************************************\n" +
    "Grabbing every web developer opportunity\n" +
    "from the Volunteer Match website:" +
    "\n******************************************\n");

//A GET request to scrape the volunteermatch website.
router.get('/scrape', function(req,res) {

    // Now, make a request call for the "web developer" search on Volunteer Match.
    request('http://www.volunteermatch.org/search/virtual?k=web+developer&searchOpps=&v=true&s=1&o=recency&l=Apopka%2C+FL%2C+USA&r=virtual&sk=&specialGroupsData.groupSize=&na=&partner=&usafc=#k=web+developer&v=true&s=1&o=recency&l=Apopka%2C+FL%2C+USA&r=virtual&sk=&specialGroupsData.groupSize=&na=&partner=&usafc=',
    function (error, response, html) {
        // Load the html into cheerio and save it to a var.
        // '$' becomes a shorthand for cheerio's selector commands,
        var $ = cheerio.load(html);

        // With cheerio, find each title of the volunteer opportunity
        //Not the read_more link which shares the psr_link class
        // (i: iterator. element: the current element)
        $('a.psr_link:not(.read_more)').each(function(i, element) {

            // an empty array to save the data that we'll scrape
            var result = [];

            // save the text of the element (this) in a "title" variable
            result.title = $(this).text();
            //then save the values for any "href" attributes
            //concatenate with main weblink and save as properties of the result object
            result.link = 'www.volunteermatch.org' + $(this).attr('href');

            // using our WebVol model, create a new entry.
            var entry = new WebVol (result);

            //now, save the entry to the db
            entry.save(function(err, doc) {
                // log any errors
                if (err) {
                    console.log(err);
                }
                // or log the doc
                else {
                    console.log(doc);
                }
            });
        });
        // tell the browser that we finished scraping the text.
        res.send("Scrape Complete");
    });
});

// this will get the webvols we scraped from the mongoDB
router.get('/voldev', function(req, res){
    // grab every doc in the Articles array
    VolDev.find({}, function(err, doc){
        // log any errors
        if (err){
            console.log(err);
        }
        // or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

// grab an article by it's ObjectId
router.get('/voldev/:id', function(req, res){
    // using the id passed in the id parameter,
    // prepare a query that finds the matching one in our db...
    WebVol.findOne({'_id': req.params.id})
    // and populate all of the notes associated with it.
        .populate('note')
        // now, execute our query
        .exec(function(err, doc){
            // log any errors
            if (err){
                console.log(err);
            }
            // otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/voldev/:id', function(req, res){
    // create a new note and pass the req.body to the entry.
    var newNote = new Note(req.body);

    // and save the new note in the db
    newNote.save(function(err, doc){
        // log any errors
        if(err){
            console.log(err);
        }
        // otherwise
        else {
            // using the WebVol id passed in the id parameter of our url,
            // prepare a query that finds the matching WebVol in our db
            // and update it to make it's lone note the one we just saved
            Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
            // execute the above query
                .exec(function(err, doc){
                    // log any errors
                    if (err){
                        console.log(err);
                    } else {
                        // or send the document to the browser
                        res.send(doc);
                    }
                });
        }
    });
});

module.exports = router;