const express = require("express");

// we will use the passport strategies we defined in 
// passport.js file in config folder to signup and login 
// a user.
const passport = require('passport');
require('../config/passport')(passport);

// create user router
const userRouter = express.Router();


// connect to food controller -- we will use the food controller to update the
// favourites list. 
const foodController = require('../controllers/foodController.js')
// load/import the user controller
const userController = require("../controllers/userController.js");

// GET login form
// http:localhost:5000/user/
userRouter.get("/", (req, res) => {
    res.render('login');
});

// POST login form -- authenticate user
// http:localhost:5000/user/login
userRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/user/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));



// GET - show the signup form to the user
// http:localhost:5000/user/signup
userRouter.get("/signup", (req, res) => {
    res.render('signup');
});

// POST - user submits the signup form -- signup a new user
// http:localhost:5000/user/signup
userRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/user/signup/', // redirect to signup page
    failureFlash : true // allow flash messages
}));

// LOGOUT
userRouter.post('/logout', function(req, res) {
    // save the favourites
    foodController.saveFavourites(req,res,req.body.favs)
    req.logout();
    req.flash('');
    delete(req.session.email)
    res.redirect('/user/');
});

// export the router
module.exports = userRouter;
