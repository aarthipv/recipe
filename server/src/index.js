import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Recipe } from "./models/Recipes.js";  // Ensure correct import

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://aarthipv2004:MERNpassword123@recipes.d5pov.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes"
);

app.post("/recipes/suggest", async (req, res) => {
  const { ingredients } = req.body; 
  try {
    console.log("Request received for recipe suggestions:", ingredients);

    // Query MongoDB to find recipes that match the provided ingredients
    const recipes = await Recipe.find({
      ingredients: { $in: ingredients },
    });

    // Rank recipes based on the number of matching ingredients
    const rankedRecipes = recipes
      .map((recipe) => ({
        ...recipe._doc,
        matchScore:
          recipe.ingredients.filter((ing) => ingredients.includes(ing))
            .length /
          recipe.ingredients.length,
      }))
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by matchScore

    res.json(rankedRecipes);  // Send the ranked recipes as a response
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
});

app.listen(3001, () => console.log("Server started!"));
