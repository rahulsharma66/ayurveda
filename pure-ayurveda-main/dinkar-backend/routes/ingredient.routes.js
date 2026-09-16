const express = require("express");
const router = express.Router();
const Ingredient = require("../models/Ingredient");

// Get all ingredients
router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.json(ingredients);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
});

// Get single ingredient by name (for the customer frontend later)
router.get("/:name", async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ name: req.params.name });
    if (!ingredient) return res.status(404).json({ message: "Not found" });
    res.json(ingredient);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
});

// Create a new ingredient (for admin panel)
router.post("/", async (req, res) => {
  try {
    const newIngredient = await Ingredient.create(req.body);
    res.status(201).json(newIngredient);
  } catch (error) { res.status(400).json({ message: "Failed to create" }); }
});

// Delete an ingredient
router.delete("/:id", async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
});

module.exports = router;