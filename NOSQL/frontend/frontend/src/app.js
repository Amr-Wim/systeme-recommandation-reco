// App.js - Version Finale Harmonisée
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import recoIcon from './recommandations (2).png';
import bonjourIcon from './bonjour.png';

// Import des composants
import Login from './Login';
import Products from './Products';
import Recommendations from './Recommendations';
import Navbar from './Navbar';
import Cart from './Cart';
import Wishlist from './Wishlist';
import Purchases from './Purchases';

// --- COMPOSANT HOME (ACCUEIL) ---
function Home({ user, cartItems, wishlistItems, onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Monospace', backgroundColor: '#f8f9fa' }}>
      <style>{`
        :root {
          --blue-dark: #00326f;
          --blue-light: #0151aa;
          --bg-input: #0753b0ff;
          --gradient: linear-gradient(90deg, #00326f 0%, #041830ff 100%);
        }

        /* Bannière d'accueil Brutaliste */
        .brutalist-banner {
          background-color: var(--blue-dark);
          color: white;
          padding: 40px;
          border: 4px solid var(--blue-dark);
          box-shadow: 12px 12px 0px var(--blue-light);
          margin-bottom: 50px;
          position: relative;
          overflow: hidden;
        }

        .brutalist-banner h1 {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* Bouton 3D Recommendations */
        .btn-3d-recs {
          cursor: pointer;
          border: 0;
          background: transparent;
          color: #fff;
          padding: 15px 25px;
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          display: inline-block;
          margin-top: 15px;
        }

        .block-cube { position: relative; }
        .block-cube .bg-top {
          position: absolute; height: 10px; background: var(--gradient);
          bottom: 100%; left: 5px; right: -5px; transform: skew(-45deg, 0);
          transition: all 0.2s;
        }
        .block-cube .bg-right {
          position: absolute; background: var(--blue-light);
          top: -5px; bottom: 5px; width: 10px; left: 100%;
          transform: skew(0, -45deg); transition: all 0.2s;
        }
        .block-cube .bg {
          position: absolute; left: 0; top: 0; right: 0; bottom: 0;
          background: var(--gradient); transition: all 0.2s;
        }
        .block-cube .bg-inner {
          background: var(--bg-input);
          position: absolute; left: 2px; top: 2px; right: 2px; bottom: 2px;
          transition: all 0.2s;
        }
        .block-cube-hover:hover .bg-inner { top: 100% !important; }
        .text-label { position: relative; z-index: 3; }
      `}</style>

      <div className="container py-5">
        {/* Welcome Section */}
        <div className="brutalist-banner">
          <h1>BIENVENUE {user.firstName.toUpperCase()} !<img src={bonjourIcon} alt="Icon" style={{ width: '70px', marginRight: '50px' }} /></h1>
          <p className="lead mb-4">
            VOTRE EXPÉRIENCE SHOPPING PERSONNALISÉE COMMENCE ICI.
          </p>
          <button
            className="btn-3d-recs block-cube block-cube-hover"
            onClick={() => navigate('/recommendations')}
          >
            <div className="bg-top"><div className="bg-inner"></div></div>
            <div className="bg-right"><div className="bg-inner"></div></div>
            <div className="bg"><div className="bg-inner"></div></div>
            <span className="text-label"> <img src={recoIcon} alt="Icon" style={{ width: '32px', marginRight: '15px' }} /> VOIR MES RECOMMANDATIONS</span>
          </button>
        </div>

        {/* Section Catalogue Produits */}
        <Products
          user={user}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          wishlistItems={wishlistItems}
        />
      </div>
    </div>
  );
}

// --- COMPOSANT APP PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Gérer la connexion et charger les données
  async function handleLogin(userData) {
    setUser(userData);
    try {
      // Charger le panier
      const cartRes = await fetch(`http://localhost:4000/api/cart/${userData._id}`);
      const cartData = await cartRes.json();
      setCartItems(cartData.cart.map(item => item.product_id));

      // Charger la wishlist
      const wishRes = await fetch(`http://localhost:4000/api/wishlist/${userData._id}`);
      const wishData = await wishRes.json();
      setWishlistItems(wishData.map(item => item.product_id));
    } catch (err) {
      console.log("Initialisation des données vide");
    }
  }

  // Déconnexion complète
  function handleLogout() {
    setUser(null);
    setCartItems([]);
    setWishlistItems([]);
    localStorage.clear();
  }

  // Ajouter au panier
  function handleAddToCart(product) {
    setCartItems([...cartItems, product]);
    if (user) {
      fetch('http://localhost:4000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: product._id, quantity: 1 })
      }).catch(err => console.error('Erreur API Panier:', err));
    }
    setModalMessage(`✅ ${product.name} ajouté au panier !`);
    setShowModal(true);
  }

  // Ajouter/Retirer de la wishlist
  function handleAddToWishlist(product) {
    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    if (isInWishlist) {
      setWishlistItems(wishlistItems.filter(item => item._id !== product._id));
      if (user) {
        fetch('http://localhost:4000/api/wishlist/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId: product._id })
        });
      }
      setModalMessage(`🤍 ${product.name} retiré de la liste`);
      setShowModal(true);
    } else {
      setWishlistItems([...wishlistItems, product]);
      if (user) {
        fetch('http://localhost:4000/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId: product._id })
        });
      }
      setModalMessage(`❤️ ${product.name} ajouté à la liste !`);
      setShowModal(true);
    }
  }

  // Supprimer du panier
  function handleRemoveFromCart(productId) {
    setCartItems(cartItems.filter(item => item._id !== productId));
    if (user) {
      fetch('http://localhost:4000/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: productId })
      });
    }
  }

  // Supprimer de la wishlist (via page Wishlist)
  function handleRemoveFromWishlist(productId) {
    setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    if (user) {
      fetch('http://localhost:4000/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: productId })
      });
    }
  }

  // Validation du panier
  async function handleCheckout() {
    try {
      for (const item of cartItems) {
        await fetch('http://localhost:4000/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, productId: item._id })
        });
      }
      setCartItems([]);
      if (user) {
        fetch(`http://localhost:4000/api/cart/clear/${user._id}`, { method: 'POST' });
      }
    } catch (err) {
      throw new Error("Échec du paiement");
    }
  }

  // Protection par Login
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      {/* Navbar avec bouton déconnexion correct */}
      <Navbar user={user} cartCount={cartItems.length} onLogout={handleLogout} />
      
      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              cartItems={cartItems}
              wishlistItems={wishlistItems}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          }
        />
        <Route path="/recommendations" element={<Recommendations user={user} />} />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />}
        />
        <Route
          path="/wishlist"
          element={<Wishlist wishlistItems={wishlistItems} onRemove={handleRemoveFromWishlist} />}
        />
        <Route path="/purchases" element={<Purchases user={user} />} />
      </Routes>

      {/* Modal de notification */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
    </BrowserRouter>
  );
}