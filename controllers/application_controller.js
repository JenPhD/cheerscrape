//set up the router to redirect to homepage
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/trips');
});

module.exports = router;