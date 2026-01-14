
---

# 🛍️ RECO - Hybrid Intelligent E-commerce

An intelligent e-commerce platform featuring a **Hybrid Recommendation Engine**. Unlike standard shops, RECO analyzes user behavior in real-time (purchases, wishlist, and cart) to provide highly personalized product suggestions.

## 🚀 The Hybrid Recommendation Logic
The core of this project is the `recommender.js` service, which uses a multi-layered scoring system to rank products:

*   **Content-Based Filtering:** Analyzes tags and categories of products you’ve already bought.
*   **Wishlist Intent:** Gives high priority (weight) to items you want but haven't bought yet.
*   **Cross-Selling (Cart):** Suggests complementary accessories based on what is currently in your basket (e.g., suggesting a mouse if you have a laptop).
*   **Popularity Fallback:** Handles "Cold Start" for new users by showing trending items.

**Scoring Formula:**  
`Final Score = (Content Match × 8) + (Wishlist Match × 12) + (Cart Complement × 3) + (Popularity × 0.2)`

---

## 🛠️ Tech Stack

**Frontend:**
*   **React.js** (Functional Components, Hooks)
*   **React Router** (Navigation)
*   **Bootstrap** (UI/UX Design)

**Backend:**
*   **Node.js & Express** (REST API)
*   **MongoDB & Mongoose** (Database & Modeling)
*   **JWT (JSON Web Tokens)** (Secure Authentication)
*   **Bcrypt** (Password Hashing)

---

## 📂 Project Structure

```text
/
├── backend/
│   ├── models/         # Database Schemas (User, Product, Interaction)
│   ├── routes/         # API Endpoints (Auth, Cart, Wishlist, Recommend)
│   ├── service/        # The Recommendation Logic (recommender.js)
│   ├── data/           # JSON seeds for testing
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # React Components (Navbar, Cart, etc.)
    │   ├── App.js      # Main State & Routing
    │   └── Login.js    # Authentication handling
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
*   Install [Node.js](https://nodejs.org/)
*   Install [MongoDB](https://www.mongodb.com/try/download/community)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/reco_db
JWT_SECRET=your_secret_key
```
Seed the database with test products and users:
```bash
node seed.js
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🧪 Testing the Intelligence

The project includes 3 test profiles to demonstrate the algorithm:

1.  **Aya (Tech Lover):** Log in as `aya@test.com`. She has a history of buying Laptops. Her recommendations will focus on **Computers and Peripherals**.
2.  **Ali (Fashion Enthusiast):** Log in as `ali.nouveau@test.com`. He bought Sneakers. His recommendations will focus on **Clothing and Apparel**.
3.  **Sofia (New User):** Log in as `sofia@test.com`. She has no history. She will see **Popular Products** until she starts liking or adding items to her cart.

---

## 🛰️ Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Secure login & returns user data + token |
| `GET` | `/api/recommend/:userId` | Returns the top 10 personalized products |
| `POST` | `/api/cart/add` | Persists a product to user's cart in MongoDB |
| `POST` | `/api/wishlist/add` | Adds product to wishlist for high-weight scoring |

---

## 📝 License
This project was developed as a demonstration of **NoSQL Database management** and **Recommendation Systems**. Feel free to use and improve it!

---
*Developed with ❤️ by wiame*
