const mongoose = require("mongoose")

const bcrypt   = require('bcrypt-nodejs')

// define the Favourite schema
const favouriteSchema = new mongoose.Schema({
    foodId: {type: mongoose.Schema.Types.ObjectId, ref: 'Food'}
})

// define the Eaten schema
const eatenSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    when: {type: Date, default: Date.now}
})

// define the User schema
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nameFamily: {type: String, required: true},
    nameGiven: String,
    favourites: [favouriteSchema],
    eaten: [eatenSchema]
})

// method for generating a hash; used for password hashing
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// compile the Schemas into Models
const User = mongoose.model('User', userSchema)
const Favourite = mongoose.model('Favourite', favouriteSchema)
const Eaten = mongoose.model('Eaten', eatenSchema)


module.exports = {User, Favourite}; // make model available to other files