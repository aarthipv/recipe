// In src/pages/recipe-suggestions.js

import React, { useState } from 'react';
import axios from 'axios';

const RecipeSuggestions = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  const handleIngredientChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientList = ingredients.split(',').map(ingredient => ingredient.trim());

    try {
      const response = await axios.post('http://localhost:3001/recipes/suggest', { ingredients: ingredientList });
      setRecipes(response.data);  // Set the response data (recipes)
      setError('');  // Clear any previous errors
    } catch (err) {
      setError('Error fetching recipe suggestions');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Recipe Suggestions</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={handleIngredientChange}
        />
        <button type="submit">Get Recipes</button>
      </form>

      {error && <p>{error}</p>}

      {recipes.length > 0 && (
        <div>
          <h2>Suggested Recipes:</h2>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe._id}>
                <h3>{recipe.name}</h3>
                <p>{recipe.instructions}</p>
                <p>Cooking Time: {recipe.cookingTime} minutes</p>
                <img src={recipe.imageUrl} alt={recipe.name} width="200" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
