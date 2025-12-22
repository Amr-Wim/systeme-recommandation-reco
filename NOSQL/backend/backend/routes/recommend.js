// This file defines the recommendation route for the API.

// Import Express and create a router instance.
const express = require('express');
const router = express.Router();
// Import the recommendation function from the service layer.
const { recommendForUser } = require('../service/recommender');

// Define a GET route for recommendations based on user ID.
router.get('/:userId', async (req, res) => {
  try {
    // Extract userId from the URL parameters.
    const { userId } = req.params;
    // Call the recommender service to get recommendations for the user, limiting to 10.
    const recommendations = await recommendForUser(userId);
    // Send the recommendations as JSON response.
    res.json(recommendations);
  } catch (err) {
    // Log the error and send a 500 status with error message.
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the router for use in the main server file.
module.exports = router;