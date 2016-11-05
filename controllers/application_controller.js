//set up the router to redirect to homepage
var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/trips');
});

module.exports = router;