const utilities = require("./utility");

// add our router
const express = require('express')
const foodRouter = express.Router()

// express-validator, to validate user data in forms
const expressValidator = require('express-validator')

// connect to controller
const foodController = require('../controllers/foodController.js')

// process routes by calling controller functions
foodRouter.get('/', (req, res) => foodController.getAllFoods(req, res))


// with the addition of utilities.isLoggedIn (see Week 9 lectures), this route can
// only be accessed by users who have logged in
foodRouter.get('/foods/:id', utilities.isLoggedIn, (req, res) => foodController.getOneFood(req, res))

foodRouter.post('/search', expressValidator.body('foodName').isAlpha().optional({checkFalsy: true}), (req, res) => foodController.searchFoods(req, res))  // includes validation of user input

// route to show my favourites
foodRouter.get('/favourites', (req, res) => foodController.showFavourites(req, res))

//we'll probably stop using the next two 'filter' routes
foodRouter.get('/filter', (req, res) => foodController.showFilter(req, res))
foodRouter.post('/filter', (req, res) => foodController.processFilter(req, res))

// export the router
module.exports = foodRouter
