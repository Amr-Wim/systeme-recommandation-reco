// Import required modules and models.
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Interaction = require('./models/Interaction');

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/reco_db'
    );

    console.log('✅ MongoDB connected');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Interaction.deleteMany({});

    console.log('🧹 Collections cleared');

    // --- PRODUITS INFORMATIQUE & VÊTEMENTS ---
    const products = await Product.insertMany([
      // INFORMATIQUE
      { name: 'Laptop Lenovo ThinkPad', category: 'Informatique', tags: ['laptop', 'lenovo', 'business'], price: 900 },
      { name: 'Laptop Dell Inspiron', category: 'Informatique', tags: ['laptop', 'dell'], price: 700 },
      { name: 'Laptop HP Pavilion', category: 'Informatique', tags: ['laptop', 'hp', 'portable'], price: 650 },
      { name: 'MacBook Pro', category: 'Informatique', tags: ['laptop', 'apple', 'premium'], price: 1299 },
      { name: 'Souris Logitech', category: 'Accessoires', tags: ['mouse', 'logitech'], price: 25 },
      { name: 'Souris Razer', category: 'Accessoires', tags: ['mouse', 'razer', 'gaming'], price: 59 },
      { name: 'Clavier mécanique', category: 'Accessoires', tags: ['keyboard', 'gaming'], price: 60 },
      { name: 'Écran 27 pouces 4K', category: 'Moniteurs', tags: ['monitor', '4k', 'gaming'], price: 399 },
      
      // VÊTEMENTS (NOUVEAU)
      { name: 'T-shirt Coton Bio', category: 'Mode', tags: ['vêtement', 'coton', 'été', 'casual'], price: 25 },
      { name: 'Jean Slim Bleu', category: 'Mode', tags: ['vêtement', 'denim', 'casual', 'classic'], price: 55 },
      { name: 'Veste en Cuir Noir', category: 'Mode', tags: ['vêtement', 'cuir', 'hiver', 'premium'], price: 120 },
      { name: 'Sweat à Capuche Gris', category: 'Mode', tags: ['vêtement', 'sport', 'coton', 'winter'], price: 45 },
      { name: 'Robe d\'été Fleurie', category: 'Mode', tags: ['vêtement', 'femme', 'été', 'léger'], price: 35 },
      { name: 'Sneakers de Sport', category: 'Mode', tags: ['chaussures', 'sport', 'confort'], price: 85 },
      { name: 'Chemise en Lin Blanche', category: 'Mode', tags: ['vêtement', 'classic', 'été', 'chic'], price: 40 },
      { name: 'Pantalon Cargo Noir', category: 'Mode', tags: ['vêtement', 'streetwear', 'coton'], price: 50 },
      { name: 'Manteau en Laine', category: 'Mode', tags: ['vêtement', 'hiver', 'chic', 'premium'], price: 150 },
      { name: 'Casquette New Era', category: 'Mode', tags: ['accessoire', 'sport', 'streetwear'], price: 30 }
    ]);

    console.log('📦 Products inserted (Informatique + Mode)');

    // --- UTILISATEURS ---
    const users = [];
    const usersList = [
      {
        firstName: 'Aya',
        lastName: 'Lh',
        email: 'aya@test.com',
        password: '123456',
        history: [{ product_id: products[0]._id, date: new Date() }] // Acheté Laptop Lenovo
      },
      {
        firstName: 'Sara',
        lastName: 'Benali',
        email: 'sara@test.com',
        password: '123456',
        history: [{ product_id: products[8]._id, date: new Date() }] // Acheté T-shirt (Vêtement)
      },
      {
        firstName: 'Mohamed',
        lastName: 'Ali',
        email: 'mohamed@test.com',
        password: '123456',
        history: [{ product_id: products[10]._id, date: new Date() }] // Acheté Veste Cuir (Vêtement)
      },
      {
        firstName: 'Ali', // Utilisateur test pour voir si les recos changent
        lastName: 'Nouveau',
        email: 'ali.nouveau@test.com',
        password: '123456',
        history: [{ product_id: products[13]._id, date: new Date() }] // Acheté Sneakers (Vêtement)
      },
      {
        // --- NOUVEL UTILISATEUR : RIEN ACHETÉ ---
        firstName: 'Sofia',
        lastName: 'Test',
        email: 'sofia@test.com',
        password: '123456',
        history: [],   // Vide
        wishlist: [],  // Vide
        cart: []       // Vide
      }
    ];

    for (const userData of usersList) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }

    console.log('👤 Users inserted');

    // --- INTERACTIONS ---
    await Interaction.insertMany([
      { user_id: users[0]._id, product_id: products[0]._id, event: 'purchase', timestamp: new Date() },
      { user_id: users[1]._id, product_id: products[8]._id, event: 'purchase', timestamp: new Date() },
      { user_id: users[2]._id, product_id: products[10]._id, event: 'purchase', timestamp: new Date() },
      { user_id: users[3]._id, product_id: products[13]._id, event: 'purchase', timestamp: new Date() }
    ]);

    console.log('🛒 Interactions inserted');
    console.log('🎉 SEED FINISHED SUCCESSFULLY');
    process.exit();

  } catch (err) {
    console.error('❌ SEED ERROR:', err);
    process.exit(1);
  }
}

seed();