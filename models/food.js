const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({  // declare a Mongoose schema
  name: String,
  photo: String,
  description: String,
  vegan: Boolean,
  organic: Boolean,
  calories: Number,
  fat: Number,
  protein: Number
})

const Food = mongoose.model("Food", foodSchema) // compile the schema into a model

module.exports = Food // make model available to other files