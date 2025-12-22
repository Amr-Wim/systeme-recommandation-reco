const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Add product to cart
// routes/cart.js
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body; // Récupère l'ID de l'utilisateur concerné
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    // Vérifier si le produit est déjà dans le panier
    const itemIndex = user.cart.findIndex(item => String(item.product_id) === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += (quantity || 1);
    } else {
      user.cart.push({ product_id: productId, quantity: quantity || 1 });
    }

    await user.save(); // Sauvegarde UNIQUEMENT pour cet utilisateur
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product from cart
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

    user.cart = user.cart.filter(
      item => String(item.product_id) !== String(productId)
    );

    await user.save();
    const populatedUser = await user.populate('cart.product_id', 'name price');

    res.json({
      message: 'Product removed from cart',
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error('Cart remove error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('cart.product_id');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total price
    const total = user.cart.reduce((sum, item) => {
      return sum + (item.product_id.price * item.quantity);
    }, 0);

    res.json({
      cart: user.cart,
      total,
      itemCount: user.cart.length
    });
  } catch (error) {
    console.error('Cart get error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.post('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
