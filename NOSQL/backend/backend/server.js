// This is the main server file for the backend API using Express.js.

// Import required modules: Express for the server, Mongoose for DB, CORS for cross-origin, dotenv for env vars.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables.

// Create the Express application instance.
const app = express();

// Middleware setup: Enable CORS for frontend requests, parse JSON bodies.
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose, with fallback URI.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reco_db')
  .then(() => console.log('✅ MongoDB connected')) // Success message.
  .catch(err => console.error(err)); // Error handling.

// Import and use route modules for different API endpoints.
const authRoutes = require('./routes/auth');       // Authentication routes (login, register).
const productRoutes = require('./routes/products'); // Product-related routes.
const purchaseRoutes = require('./routes/purchase'); // Purchase routes.
const recommendRoutes = require('./routes/recommend'); // Recommendation routes.
const cartRoutes = require('./routes/cart');       // Cart routes.
const wishlistRoutes = require('./routes/wishlist'); // Wishlist routes.

app.use('/api/auth', authRoutes);         // Mount auth routes at /api/auth.
app.use('/api/products', productRoutes);  // Mount product routes at /api/products.
app.use('/api/purchase', purchaseRoutes); // Mount purchase routes at /api/purchase.
app.use('/api/recommend', recommendRoutes); // Mount recommend routes at /api/recommend.
app.use('/api/cart', cartRoutes);         // Mount cart routes at /api/cart.
app.use('/api/wishlist', wishlistRoutes); // Mount wishlist routes at /api/wishlist.

// Simple test route to check if API is running.
app.get('/', (req, res) => {
  res.send('API Recommandation MongoDB OK'); // Send a basic response.
});

// Start the server on port 4000.
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`); // Log server start.
});
