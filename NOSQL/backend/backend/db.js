// This file handles the database connection using Mongoose for MongoDB.

// Import Mongoose for MongoDB interaction and dotenv for environment variables.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file.

// Default MongoDB URI if not provided in environment variables.
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/reco_db';

// Asynchronous function to connect to the database.
async function connect() {
  // Connect to MongoDB with the specified URI and options for compatibility.
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB'); // Log success message.
}

// Export the connect function for use in other files.
module.exports = { connect };