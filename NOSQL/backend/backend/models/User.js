// This file defines the User model using Mongoose schema for MongoDB.

// Import Mongoose to create schemas and models.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema with fields for user information.
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password by default
  },
  history: [         // Array of user's purchase history.
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model.
      date: Date   // Date of purchase.
    }
  ],
  ratings: [         // Array of user's product ratings
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now }
    }
  ],
  wishlist: [        // Array of products user wants to buy later
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  cart: [            // Array of products in shopping cart
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1, min: 1 },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model based on the schema.
module.exports = mongoose.model('User', UserSchema);

