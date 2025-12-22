// This file defines the Product model using Mongoose schema for MongoDB.

// Import Mongoose to create schemas and models.
const mongoose = require('mongoose');

// Define the Product schema with fields for product details.
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  tags: [String],      // Array of tags for the product.
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  description: String, // Product description.
  ratings: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now }
    }
  ],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to update average rating
ProductSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
};

// Export the Product model based on the schema.
module.exports = mongoose.model('Product', ProductSchema);
