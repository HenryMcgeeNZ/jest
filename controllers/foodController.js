// connect to Mongoose model
const Food = require("../models/food");
const User = require("../models/user");

const mongoose = require('mongoose')
//const Food = mongoose.model('Food')
//const User = mongoose.model('User') // used when saving favourites
//const Favourite = mongoose.model('Favourite')

// get express-validator, to validate user data in forms
const expressValidator = require('express-validator')


// get list of foods, and render it
const getAllFoods = async (req, res) => { 
	try {
		// we only need names and photos
		const foods = await Food.find( {}, 
			{name:true, photo:true}).lean()	
		res.render('index', {"foods": foods})	
	} catch (err) {
		console.log(err)
	}
}

const getOneFood =  async (req, res) => { // get one food, and render it
	try {
		const food = await Food.findOne( {_id: req.params.id} ).lean()
		// the login status is passed to the showFood template so that 
		// we can enable or disable the Favourites button.
		// req.isAuthenticated() is provided by passport middleware - it returns
		// true if request is authenticated otherwise it returns a false.
		
		res.render('showFood', {"thisfood": food, "loggedin":req.isAuthenticated()})	
	} catch (err) {
		console.log(err)
		res.render('error', {"errorCode": 404, "message":"Error: Food not found!"})	
	}
}

const saveFavourites =  async (req, res, favs) => { // get one food, and render it
	try {
		// get the user whose email is stored in the session -- user is logged in
		// and that we are saving at least one favourite food
		if(req.session.email && favs.length > 0){
			// find user in database	
			let user = await User.findOne( {email: req.session.email} )
			
			// create a list of Favourites
			favs = JSON.parse(favs)
			favouritesArray = []
			for (let i = 0; i < favs.length; ++i) {                
				let foodid = favs[i].replace(/[\\]"/g, '');;
				favFood = await Food.findOne( {_id: foodid} ).lean()
				favouritesArray.push(favFood);			
			}
			// save user's favourite foods to the database
			user.favourites = favouritesArray		
			user.save()
		}
	} catch (err) {
		console.log(err)
	}
}


const showFavourites = async (req, res) => { 
	try {
		// we only need names and photos
		if(req.session.email){
			const user = await User.findOne( {email: req.session.email} )
			const foods = await Food.find( {_id: {$in: user.favourites}})
			res.render('favs', {"foods": foods})	
			

		}
		else{
			res.render('error', {"errorCode": 401, "message":"You are not logged in!"})	
		}

	} catch (err) {
		console.log(err)
	}
}
const searchFoods = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
	// if we get this far, there are no validation errors, so proceed to do the search ...
	var query = {}
	if (req.body.foodName !== '') {
		query["name"] = {$regex: new RegExp(req.body.foodName, 'i') }
	}
	if (req.body.vegan) {
		query["vegan"] = true
	}
	if (req.body.organic) {
		query["organic"] = true
	}
	// the query has been constructed - now execute against the database
	try {
		const foods = await Food.find(query, {name:true, photo:true}).lean()
		res.render('index', {"foods": foods})	
	} catch (err) {
		console.log(err)
	}
}


// two unused routes
const showFilter = (req, res) => { // show filter page - currently unused
	res.render('showFilter')
}

const processFilter = (req, res) => { // receives POST data - user's food filter  - currently unused
	res.render('filterPost', {
		filterData: JSON.stringify(req.body)
	})
}


// export the controller functions
module.exports = {getAllFoods, getOneFood, searchFoods, showFilter, processFilter, saveFavourites, showFavourites}