const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Add product to wishlist
router.post('/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in wishlist
    const alreadyExists = user.wishlist.some(
      item => String(item.product_id) === String(productId)
    );

    if (alreadyExists) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    user.wishlist.push({
      product_id: productId,
      addedAt: new Date()
    });

    await user.save();
    const populatedUser = await user.populate('wishlist.product_id', 'name price category');

    res.json({
      message: 'Product added to wishlist',
      wishlist: populatedUser.wishlist
    });
  } catch (error) {
    console.error('Wishlist add error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove product from wishlist
router.post('/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      item => String(item.product_id) !== String(productId)
    );

    await user.save();
    const populatedUser = await user.populate('wishlist.product_id', 'name price category');

    res.json({
      message: 'Product removed from wishlist',
      wishlist: populatedUser.wishlist
    });
  } catch (error) {
    console.error('Wishlist remove error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('wishlist.product_id');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      wishlist: user.wishlist,
      count: user.wishlist.length
    });
  } catch (error) {
    console.error('Wishlist get error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
