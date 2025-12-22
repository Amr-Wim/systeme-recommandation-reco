import React from 'react';
import { useNavigate } from 'react-router-dom';
import accueilIcon from './accueil.png';
import iconeIcon from './icone.png';
import heartIcon from './heart.png';
import panierIcon from './panier.png';
import boxIcon from './box.png';

export default function Navbar({ user, cartCount, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <style>{`
        :root {
          --blue-dark: #00326f;
          --blue-light: #0151aa;
          --bg-input: #0753b0ff;
          --gradient: linear-gradient(90deg, #00326f 0%, #041830ff 100%);
        }

        .navbar {
          font-family: 'Monospace', serif;
          border-bottom: 3px solid var(--blue-dark);
        }

        .nav-link {
          color: var(--blue-dark) !important;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .nav-link:hover {
          color: var(--blue-light) !important;
          transform: translateY(-2px);
        }

        .brand-text {
          color: var(--blue-dark);
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
        }

        /* Style du bouton de déconnexion 3D (Assorti au Login) */
        .btn-3d-logout {
          cursor: pointer;
          border: 0;
          background: transparent;
          color: #fff;
          padding: 8px 15px;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          margin-left: 15px;
        }

        .block-cube {
          position: relative;
        }

        .block-cube .bg-top {
          position: absolute;
          height: 6px;
          background: var(--gradient);
          bottom: 100%;
          left: 3px;
          right: -3px;
          transform: skew(-45deg, 0);
          transition: all 0.2s ease-in-out;
        }

        .block-cube .bg-right {
          position: absolute;
          background: var(--blue-dark);
          top: -3px;
          bottom: 3px;
          width: 6px;
          left: 100%;
          transform: skew(0, -45deg);
          transition: all 0.2s ease-in-out;
        }

        .block-cube .bg {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient);
          transition: all 0.2s ease-in-out;
        }

        .block-cube .bg-inner {
          background: #d9534f; /* Un rouge discret pour l'action de déconnexion ou gardez var(--bg-input) pour rester bleu */
          position: absolute;
          left: 2px;
          top: 2px;
          right: 2px;
          bottom: 2px;
          transition: all 0.2s ease-in-out;
        }
        
        /* Version bleue pour rester 100% raccord */
        .logout-blue .bg-inner { background: var(--bg-input); }

        .block-cube-hover:hover .bg-inner {
          top: 100% !important;
        }

        .text-label {
          position: relative;
          z-index: 3;
        }

        .badge-custom {
          background-color: var(--blue-dark);
          font-size: 0.7rem;
        }

        .user-greeting {
          font-size: 0.85rem;
          color: #555;
          border-left: 2px solid var(--blue-dark);
          padding-left: 15px;
        }
      `}</style>

      <div className="container">
        {/* Brand / Logo */}
        <div 
          className="d-flex align-items-center" 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={iconeIcon}
            alt="Icon"
            style={{ width: '32px', height: '32px', marginRight: '10px' }}
          />
          <h5 className="brand-text">VOTRE BOUTIQUE</h5>
        </div>

        {/* Toggle Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <button onClick={() => navigate('/')} className="nav-link btn btn-link text-decoration-none">
                <img src={accueilIcon} alt="Home" style={{ width: '18px', marginRight: '5px' }} />
                Accueil
              </button>
            </li>
            
            <li className="nav-item">
              <button onClick={() => navigate('/wishlist')} className="nav-link btn btn-link text-decoration-none">
                <img src={heartIcon} alt="Wishlist" style={{ width: '18px', marginRight: '5px' }} />
                Souhaits
              </button>
            </li>

            <li className="nav-item">
              <button onClick={() => navigate('/cart')} className="nav-link btn btn-link text-decoration-none position-relative">
                <img src={panierIcon} alt="Cart" style={{ width: '18px', marginRight: '5px' }} />
                Panier
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-custom">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>

            <li className="nav-item">
              <button onClick={() => navigate('/purchases')} className="nav-link btn btn-link text-decoration-none">
                <img src={boxIcon} alt="Purchases" style={{ width: '18px', marginRight: '5px' }} />
                Achats
              </button>
            </li>

            {/* Utilisateur et Déconnexion */}
            {user && (
              <li className="nav-item d-flex align-items-center ms-lg-3">
                <span className="user-greeting">
                  Bonjour, <strong style={{ color: 'var(--blue-dark)' }}>{user.firstName}</strong>
                </span>
                
                <button
                  onClick={onLogout}
                  className="btn-3d-logout block-cube block-cube-hover logout-blue"
                >
                  <div className="bg-top"><div className="bg-inner"></div></div>
                  <div className="bg-right"><div className="bg-inner"></div></div>
                  <div className="bg"><div className="bg-inner"></div></div>
                  <span className="text-label">Quitter</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}