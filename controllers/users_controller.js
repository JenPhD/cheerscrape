//require bcrypt for authentication/hashing and salting of passwords
var bcrypt = require('bcryptjs');
var models = require('../models');
var express = require('express');
var router  = express.Router();

//this is the users_controller.js file
//Get, renders sign up for new users
router.get('/new', function(req,res) {
    res.render('users/new');
});

//Get, renders sign in for users with account
router.get('/sign-in', function(req,res) {
    res.render('users/sign_in');
});

//Get, redirects to home on sign-out
router.get('/sign-out', function(req,res) {
    req.session.destroy(function(err) {
        res.redirect('/')
    })
});


// login for users with account, matches with email and redirects to
//sign-in
router.post('/login', function(req, res) {
    db.User.find(
        { email: req.body.email }
    ).then(function(user) {

        if (user == null){
            res.redirect('/users/sign-in')
        }
        // Use bcrypt to compare the user's password input
        bcrypt.compare(req.body.password, user.pwdhash, function(err, result) {
            // if the result is true (and thus pass and hash match)
            if (result == true){
                // save the user's information to req.session
                //enter the user's session by setting properties to req.
                //save the logged-in status to the session
                req.session.logged_in = true;
                // the username to the session
                req.session.name = user.name;
                // and the user's email.
                req.session.email = user.email;
                //redirect to index
                res.redirect('/');
            }
            // if the result is anything but true (password invalid)
            else{
                // redirect user to sign in
                res.redirect('/users/sign-in')
            }
        })
    })
});

// register and create a user, matching with email
router.post('/create', function(req,res) {
    db.User.find(
        { email: req.body.email }
    ).then(function(users) {

        if (users.length > 0){
            console.log(users);
            res.send("We already have an email or username for this account");
        } else {
            // Using bcrypt, generate a 10-round salt,
            // then use that salt to hash the user's password.
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {

                    // Using the User model, create a new user,
                    // storing the email they sent and the hash you just made
                    db.User.insert(
                        {
                            name: req.body.name,
                            email: req.body.email,
                            pwdhash: hash
                        }
                    )
                    // In a .then promise connected to that create method,
                    // save the user's information to req.session
                        .then(function(user){
                            //enter the user's session by setting properties to req.
                            //save the logged in status to the session
                            req.session.logged_in = true;
                            //the username to the session
                            req.session.name = user.name;
                            // and the user's email.
                            req.session.email = user.email;
                            // redirect to home on login
                            res.redirect('/')
                        })
                })
            })
        }
    })
});

module.exports = router;
