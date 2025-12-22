// Purchase route: records a purchase interaction and updates user's history
const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');
const User = require('../models/User');

// POST /api/purchase
// Body: { userId, productId }
// Creates an Interaction document for the purchase event and appends to user's history array.
router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Create interaction record for analytics/recommendations
    await Interaction.create({
      user_id: userId,
      product_id: productId,
      event: 'purchase',
      timestamp: new Date()
    });

    // Append purchase to user's history for personalization features
    await User.findByIdAndUpdate(userId, {
      $push: { history: { product_id: productId, date: new Date() } }
    });

    // Respond to client
    res.json({ message: 'Purchase successful' });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/purchase/:userId
// Get all purchases for a user
router.get('/:userId', async (req, res) => {
  try {
    const interactions = await Interaction.find({ user_id: req.params.userId })
      .populate('product_id')
      .sort({ timestamp: -1 });

    res.json(interactions);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ error: 'Server error' });
  }});

module.exports = router;