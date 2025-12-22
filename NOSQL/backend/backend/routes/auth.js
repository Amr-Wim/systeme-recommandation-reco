// Authentication routes with JWT and bcrypt security
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user (Bcrypt est géré dans le modèle User.js via pre-save)
    const user = new User({ 
      firstName, 
      lastName, 
      email, 
      password,
      wishlist: [], // Initialisation vide
      cart: []      // Initialisation vide
    });
    
    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        wishlist: user.wishlist, // Persistance
        cart: user.cart          // Persistance
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login - Login with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // On récupère l'utilisateur avec son password, sa wishlist et son panier
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Comparaison du mot de passe via la méthode du modèle
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Création du token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login successful for:', user.firstName);
    
    // REPONSE COMPLETE : On renvoie TOUTES les données pour le Frontend
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        wishlist: user.wishlist || [], // On renvoie la wishlist stockée
        cart: user.cart || []          // On renvoie le panier stocké
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware pour vérifier le JWT (Optionnel pour les autres routes)
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
    } catch (err) {
      console.log('Invalid token');
    }
  }
  next();
});

module.exports = router;