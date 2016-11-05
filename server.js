//Dependencies for express
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var session = require('express-session');

// Dependencies for scraper:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html

//instantiate app
var app = express();

// Database configuration with mongoose
//var mongoDBURL = process.env.NODE_ENV === 'production' ? 'heroku:databaseurl' : 'mongodb://localhost/27017/awesamsara';
//MongoClient.connect(mongoDBURL, function(){});
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

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

//allow sessions and use cookie parser
var cookieParser = require('cookie-parser');
app.use(session({ secret: 'app', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}));
app.use(cookieParser());

// make public a static dir
app.use(express.static('public'));
//Configure public web folder
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//set up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//Configure body-parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set up console logger
var logger = require('morgan');
app.use(logger('dev'));

//Configure app routes
//override with POST having ?_method=DELETE
var methodOverride = require('method-override'); //for deletes in express
app.use(methodOverride('_method'));

// Our model controllers
var application_controller = require('./controllers/application_controller');
var trips_controller = require('./controllers/trips_controller.js');
var users_controller = require('./controllers/users_controller.js');
var notes_controller = require('./controllers/notes_controller.js');
app.use('/', application_controller);
app.use('/trips', trips_controller);
app.use('/users', users_controller);
app.use('/notes', notes_controller);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler -- development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//Error handler -- production handler not leaking stacktrace to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// our module gets exported as app.
module.exports = app;

//listener in bin/www



// listen on port 3000
// app.listen(3000, function() {
//     console.log('App running on port 3000!');
// });
