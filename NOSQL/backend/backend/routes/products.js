// Product routes: expose product catalog to frontend
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
// Returns all products stored in the database as JSON.
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('ratings.user_id', 'firstName lastName');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
// Returns a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('ratings.user_id', 'firstName lastName');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products/:id/rate
// Add a rating to a product
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating, userId } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already rated this product
    const existingRating = product.ratings.find(r => r.user_id.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      product.ratings.push({ user_id: userId, rating });
    }

    // Update average rating
    product.updateAverageRating();
    await product.save();

    res.json({ message: 'Rating added successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }});

module.exports = router;