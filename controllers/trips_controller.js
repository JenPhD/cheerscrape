var Trip = require('../models/Trip');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/27107/awesamsara');
var db = mongoose.connection;

//this is the trips_controller.js file
// =================================================================
// Routes
// =================================================================
//Redirecting user on click until saving info from API
//Get, renders volunteer opportunities
router.get('/volunteer', function(req,res) {
    res.render('trips/volunteer', {
    });
});

//Get, renders flights
router.get('/flights', function(req,res) {
    res.render('trips/flights');
});

//Get, renders hotels
router.get('/hotels', function(req,res) {
    res.render('trips/hotels');
});


//Use the Trip model to find the trip search terms for the trip saved by a user.
//Where the id is the user id of the logged in user
//This will show the trip search terms for the trip.
router.get('/', function (req, res) {
    Trip.find(
        {'_id': req.params.id}
        //then...
    ).then(function(trips) {
        //grab the user info from our req.
        //This info gets saved to req via the users-controller.js file
        res.render('index', {
            name: req.session.name,
            email: req.session.email,
            logged_in: req.session.logged_in,
            depcity: req.session.depcity,
            destcity: req.session.destcity,
            departdate: req.session.departdate,
            returndate: req.session.returndate,
            numvol: req.session.numvol,
            itinerary: req.session.itinerary,
            trips: trips
        })
    })
});



//=================================================================================================
//Use the Trip model to create and a trip based on what's
//passed in req.body (depcity, destcity, departdate, returndate, numvol)
router.post('/create', function (req, res) {
    var newTrip = new Trip({
        depcity: req.body.usersOrigin,
        destcity: req.body.usersDestination,
        departdate: req.body.departingDate,
        returndate: req.body.returningDate,
        numvol: req.body.volunteers,
        intinerary: req.body.itinerary,
        '_id': req.params._id
    });
        newTrip.save(function(err) {
            res.redirect('/');
        })
});

// Use the Trip model to update itinerary to move to itinerary column
// using the id of the trip (as passed in the url)
router.put('/update/:id', function (req, res) {
    Trip.update(
        { '_id' : req.params.id },
        { $set: {itinerary: req.body.itinerary}}
    )
    // connect it to this .then.
        .then(function (result) {
            res.redirect('/trips');
        })
});

//Use the Trip model to delete a trip
//based on the id passed in the url
router.delete('/delete/:id', function(req,res) {
    Trip.remove(
        { '_id': req.params.id }
    )
    // connect it to this .then.
        .then(function() {
            res.redirect('/');
        })
});

module.exports = router;
