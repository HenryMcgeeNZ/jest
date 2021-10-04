/* Authentication related packages
--------------------------
npm install bcrypt
npm install bcrypt-nodejs
npm install body-parser ???
npm install jsonwebtoken
npm install express-session
npm install passport
npm install passport-jwt
npm install passport-local
npm install cookie-parser 
npm install connect-flash-plus [this is not really used in this app] 
npm install morgan [this is not really used in this app] 

*/



// Express stuff
const express = require('express')


// modules for authentication lectures
// make sure you enable CORS -- see Week 7 
// lectures for more information
const cors = require('cors');

// we will use passport.js, so include it
const passport = require('passport');

// we need to use session
const session      = require('express-session');

// we can pass messages between app and callbacks
// we will not use it for this app
const flash    = require('connect-flash-plus');

// for using JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// we use a few enviornment variables
const dotenv = require('dotenv').config()



// configure passport authenticator
require('./config/passport')(passport);

const app = express()

app.use(cors({
  credentials: true, // add Access-Control-Allow-Credentials to header
  origin: "http://localhost:3000" 
}));


// setup a session store signing the contents using the secret key
app.use(session({ secret: process.env.PASSPORT_KEY,
  resave: true,
  saveUninitialized: true
 }));

//middleware that's required for passport to operate
app.use(passport.initialize());

// middleware to store user object
app.use(passport.session());

// use flash to store messages
app.use(flash());

// we need to add the following line so that we can access the 
// body of a POST request as  using JSON like syntax
app.use(express.urlencoded({ extended: true })) 


app.use(express.static('public'))	// define where static assets live

// load the handlebars module 
const exphbs = require('express-handlebars')


var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        
    }
});

// we set the template engine to handlebars. This registers the 
// handlebars callback function as hbs. The function can be used to specify
// a set of defaults. For example, we provide the name of the default 
// layout template and the name of the extension for the handlebars file 
// below. We have also added the location of the custom helpers.
app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs',
	helpers: require(__dirname + "/public/js/helpers.js").helpers
}))



// next we set the view engine to engine specified previously, i.e. hbs
app.set('view engine', 'hbs')

// connect to database
require('./models/db.js') 

// connect to router
const foodRouter = require('./routes/foodRouter.js')
const userRouter = require('./routes/userRouter.js')


// send HTTP requests to router
// user router handles login and signup
app.use('/user', userRouter);

// food router handles displaying one or many foods, searching foods, etc
app.use('/', foodRouter)

app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).render('error', {errorCode: '404', message: 'That route is invalid.'})
})


// start server and listen for HTTP requests
app.listen(process.env.PORT || 5000, () => {
  console.log("FoodBuddy app is listening ...")
})

// need to export app for testing purposes
module.exports = app
