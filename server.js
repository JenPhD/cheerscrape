// Dependencies for scraper:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html

// first, tell the console what server2.js is doing
console.log("\n******************************************\n" +
    "Grabbing every web developer opportunity\n" +
    "from the Volunteer Match website:" +
    "\n******************************************\n")

// Now, make a request call for the "web developer" search on Volunteer Match.
// Notice: the page's html gets saved as the callback's third arg
request('http://www.volunteermatch.org/search/virtual?k=web+developer&searchOpps=&v=true&s=1&o=recency&l=Apopka%2C+FL%2C+USA&r=virtual&sk=&specialGroupsData.groupSize=&na=&partner=&usafc=#k=web+developer&v=true&s=1&o=recency&l=Apopka%2C+FL%2C+USA&r=virtual&sk=&specialGroupsData.groupSize=&na=&partner=&usafc=',
    function (error, response, html) {

    // Load the html into cheerio and save it to a var.
    // '$' becomes a shorthand for cheerio's selector commands,
    //  much like jQuery's '$'.
    var $ = cheerio.load(html);

    // an empty array to save the data that we'll scrape
    var result = [];

    // With cheerio, find each h3 (the title of the volunteer opportunity
    // (i: iterator. element: the current element)
    $('a.psr_link:not(.read_more)').each(function(i, element){

            // save the text of the element (this) in a "title" variable
            var title = $(this).text();

            // In the currently selected element,
            // look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes
            // that the child elements may have
            var link = 'www.volunteermatch.org' + $(this).attr('href');

            // save these results in an object that we'll push
            // into the result array we defined earlier
            result.push({
                title:title,
                link:link
            });

        // $('a.psr_link').each(function(i, element){
        //
        //     // save the text of the element (this) in a "title" variable
        //     var title = $(this).text();
        //
        //     console.log(title);
        //
        //     // In the currently selected element,
        //     // look at its child elements (i.e., its a-tags),
        //     // then save the values for any "href" attributes
        //     // that the child elements may have
        //     var link = $(element).children().attr('href');
        //
        //     // save these results in an object that we'll push
        //     // into the result array we defined earlier
        //     result.push({
        //         title:title,
        //         link:link
        //     });
    });



    // log the result once cheerio analyzes each of its selected elements
    console.log(result);
});