const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String } // Optional: if you want pictures of the herbs later
}, { timestamps: true });

module.exports = mongoose.model("Ingredient", ingredientSchema);