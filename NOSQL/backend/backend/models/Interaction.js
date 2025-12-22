// This file defines the Interaction model using Mongoose schema for MongoDB.
// Interactions track user actions on products for recommendation purposes.

// Import Mongoose to create schemas and models.
const mongoose = require('mongoose');

// Define the Interaction schema to log user-product interactions.
const InteractionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: 'User' },       // Reference to the User who performed the action.
  product_id: { type: mongoose.Types.ObjectId, ref: 'Product' }, // Reference to the Product involved.
  event: { type: String, enum: ['view', 'click', 'add_to_cart', 'purchase'] }, // Type of interaction event.
  timestamp: Date  // Date and time of the interaction.
});

// Export the Interaction model based on the schema.
module.exports = mongoose.model('Interaction', InteractionSchema); 