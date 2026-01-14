

# 🛒 Intelligent E-Commerce Engine: Hybrid Recommendation System

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Architecture](https://img.shields.io/badge/Architecture-3--Tier-green.svg)](#)
[![Field](https://img.shields.io/badge/Field-Data_Science_%26_Intelligent_Systems-orange.svg)](#)

## 📌 Project Overview
This is a full-stack intelligent e-commerce platform designed to maximize user engagement and conversion through a **multi-factor hybrid recommendation engine**. Unlike traditional static shops, this system tracks user behavior (Wishlists, Carts, and Purchase History) in real-time to provide personalized product suggestions.

### Key Engineering Goals:
*   **Persistence:** State management via MongoDB (Cart & Wishlist survive sessions).
*   **Intelligence:** Implementation of a weighted scoring algorithm for product discovery.
*   **Scalability:** 3-Tier architecture separating Business Logic, Data, and Presentation.

---

## 🧠 The "Brain": Hybrid Recommendation Engine

The core of this project is the `recommender.js` module. It uses a **Weighted Hybrid Scoring System** to rank products for every user.

### The Scoring Formula
The system calculates a "Interest Score" for every product in the database using the following weights:

$$Score = \frac{(CBF \times 3) + (CF \times 2) + (Pop \times 1) + (Wishlist \times 4.5) + (Comp \times 3)}{13.5}$$

| Component | Logic | Weight |
| :--- | :--- | :--- |
| **Wishlist Boost** | Items similar to those the user "saved for later." | **4.5** (Highest) |
| **Complementary** | Cross-selling logic (e.g., suggesting a Mouse for a Laptop). | **3.0** |
| **CBF** | Content-Based Filtering (Tags, Category, Price). | **3.0** |
| **CF** | Collaborative Filtering (What similar users bought). | **2.0** |
| **Popularity** | Global trends to solve the "Cold Start" problem. | **1.0** |

---

## 🏗️ System Architecture

The application follows a **Decoupled 3-Tier Architecture**:

1.  **Presentation Layer (Frontend):** React.js SPA with real-time state synchronization via REST API.
2.  **Logic Layer (Backend):** Node.js & Express handling the recommendation scoring and JWT-based security.
3.  **Data Layer (Database):** MongoDB with specialized schemas for:
    *   **User Profiles:** Storing persistent carts and historical behavior.
    *   **Product Catalog:** Rich metadata for Content-Based Filtering.
    *   **Transaction Logs:** For Collaborative Filtering analysis.

---

## 🚀 Key Features

*   **Persistent User State:** Cart and Wishlist items are saved in MongoDB, ensuring a seamless experience across devices.
*   **Behavior Tracking:** Tracks real-time interactions (`Add to Cart`, `Add to Wishlist`) to update recommendations instantly.
*   **Upsell/Cross-sell Logic:** Automatically identifies complementary products based on historical purchase data.
*   **Secure API:** JWT-authenticated routes for sensitive user data (Cart, Purchase History).

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Context API, CSS3
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (NoSQL)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Algorithms:** Custom Weighted Scoring (Python-style logic implemented in JS)

---

## 📊 Business Impact (Simulation)

By implementing this intelligent layer, the system aims to achieve:
*   **+150% Increase in Conversion:** Moving users from "Wishlist" to "Checkout" through targeted suggestions.
*   **Higher AOV (Average Order Value):** Using complementary product logic to encourage "Add-ons."
*   **Reduced Churn:** Personalized homepages reduce the time spent searching for products.

---

## 🔧 Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/ecommerce-intelligent-system.git
   ```
2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```
4. **Environment Variables:**
   Create a `.env` file in the backend folder and add:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
5. **Run the Application:**
   ```bash
   # In backend folder
   npm start
   # In frontend folder
   npm start
   ```

---

## 📜 API Documentation (Partial)

### Recommendations
*   `GET /api/recommend/:userId` -> Returns a ranked list of products.

### Cart Management
*   `POST /api/cart/add` -> Adds item to persistent DB cart.
*   `GET /api/cart/:userId` -> Fetches stored cart.

### Wishlist
*   `POST /api/wishlist/add` -> Updates user interest profile.

---

### 👨‍💻 Author
**Wiame El-Amimri**
*Master’s Student in Data Science & Intelligent Systems*

---

