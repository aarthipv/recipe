import express from "express";
import multer from 'multer';
import path from 'path';
import { userRouter } from './routes/user.js';  // Ensure this is correct path to the user.js file
import { recipesRouter } from './routes/recipes.js';  // Ensure this is the correct path to the recipes.js file
import cors from "cors";
import mongoose from "mongoose";
import { RecipesModel } from "./models/Recipes.js";  // Ensure correct import

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Set up video storage using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add unique timestamp to filename
  }
});

const upload = multer({ storage: storage });

// Serve video files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Routes for user authentication and recipes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Handle the video upload API route
app.post("/recipes/upload-video", upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No video file uploaded.");
  }

  res.json({
    message: "Video uploaded successfully",
    filePath: `/uploads/${req.file.filename}` // Return the URL of the uploaded file
  });
});

// MongoDB connection
mongoose.connect(
  "mongodb+srv://aarthipv2004:MERNpassword123@recipes.d5pov.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes"
)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Recipe suggestion based on ingredients
app.post("/recipes/suggest", async (req, res) => {
  const { ingredients } = req.body;
  try {
    console.log("Request received for recipe suggestions:", ingredients);

    // Query MongoDB to find recipes that match the provided ingredients
    const recipes = await RecipesModel.find({
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

    res.json(rankedRecipes); // Send the ranked recipes as a response
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
