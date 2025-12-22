import React, { useEffect, useState } from 'react';
import panierIcon from './panier.png';
import heartIcon from './heart.png';

export default function Products({ user, onAddToCart, onAddToWishlist, wishlistItems }) {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data || []);
        const initialRatings = {};
        data.forEach(p => { initialRatings[p._id] = p.rating || 0; });
        setRatings(initialRatings);
      })
      .finally(() => setLoading(false));
  }, []);

  function isInWishlist(productId) {
    return wishlistItems.some(item => item._id === productId);
  }

  async function addRating(productId, rating) {
    try {
      await fetch(`http://localhost:4000/api/products/${productId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, userId: user._id })
      });
      setRatings({ ...ratings, [productId]: rating });
    } catch (err) {
      console.error('Erreur:', err);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted" style={{ fontFamily: 'Monospace' }}>Chargement du catalogue...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5" style={{ fontFamily: 'Monospace' }}>
      <style>{`
        :root {
          --blue-dark: #00326f;
          --blue-light: #0151aa;
          --bg-input: #0753b0ff;
          --gradient: linear-gradient(90deg, #00326f 0%, #041830ff 100%);
        }

        .page-title {
          color: var(--blue-dark);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom: 4px solid var(--blue-dark);
          display: inline-block;
          padding-bottom: 5px;
        }

        /* --- Style Bouton 3D (Identique Login) --- */
        .btn-3d {
          cursor: pointer;
          border: 0;
          background: transparent;
          color: #fff;
          padding: 12px;
          font-weight: bold;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          width: 100%;
          display: block;
        }

        .block-cube { position: relative; }
        .block-cube .bg-top {
          position: absolute; height: 8px; background: var(--gradient);
          bottom: 100%; left: 4px; right: -4px; transform: skew(-45deg, 0);
          transition: all 0.2s;
        }
        .block-cube .bg-right {
          position: absolute; background: var(--blue-dark);
          top: -4px; bottom: 4px; width: 8px; left: 100%;
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

        .block-cube-hover:hover .bg-inner {
          top: 100% !important;
        }

        /* --- Variation Gris/Rouge pour Liste de Souhaits --- */
        .wish-active .bg-inner { background: #d9534f !important; }
        .wish-inactive .bg-inner { background: #6c757d !important; }

        .text-label { position: relative; z-index: 3; display: flex; align-items: center; justify-content: center; gap: 8px; }

        /* --- Carte Produit 3D --- */
        .product-card {
          border: 2px solid var(--blue-dark);
          background: white;
          transition: transform 0.3s ease;
          border-radius: 0; /* Garder un look carré/industriel */
          box-shadow: 8px 8px 0px var(--blue-dark);
          margin-bottom: 20px;
        }

        .product-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px var(--blue-light);
        }

        .product-price {
          color: var(--blue-dark);
          font-size: 1.4rem;
          font-weight: 900;
        }

        .tag-badge {
          background: var(--blue-dark);
          color: white;
          font-size: 0.7rem;
          padding: 4px 8px;
          margin-right: 5px;
          text-transform: uppercase;
        }

        .star-rating {
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .star-rating:hover { transform: scale(1.2); }
      `}</style>

      <div className="d-flex align-items-center mb-5">
        <img src={panierIcon} alt="Icon" style={{ width: '40px', marginRight: '15px' }} />
        <h2 className="page-title m-0">Catalogue Produits</h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5 border border-primary">
          <p className="text-muted">Aucun produit n'est disponible pour le moment.</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(p => (
            <div key={p._id} className="col-md-4 col-lg-3">
              <div className="card h-100 product-card">
                <div className="card-body d-flex flex-column">
                  <span className="text-muted small mb-1">{p.category}</span>
                  <h5 className="fw-bold mb-3" style={{ color: 'var(--blue-dark)' }}>{p.name}</h5>
                  
                  <div className="mb-3">
                    <span className="product-price">${p.price}</span>
                  </div>

                  <div className="mb-3 d-flex flex-wrap">
                    {p.tags && p.tags.map(tag => (
                      <span key={tag} className="tag-badge mb-1">{tag}</span>
                    ))}
                  </div>

                  {/* Ratings */}
                  <div className="mb-4 mt-auto">
                    <label className="d-block small fw-bold mb-1">NOTE: {ratings[p._id] || 0}/5</label>
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          onClick={() => addRating(p._id, star)}
                          className={`star-rating ${star <= (ratings[p._id] || 0) ? 'text-warning' : 'text-dark'}`}
                          style={{ WebkitTextStroke: star <= (ratings[p._id] || 0) ? '0' : '1px #ccc' }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions 3D */}
                  <div className="d-grid gap-3">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="btn-3d block-cube block-cube-hover"
                    >
                      <div className="bg-top"><div className="bg-inner"></div></div>
                      <div className="bg-right"><div className="bg-inner"></div></div>
                      <div className="bg"><div className="bg-inner"></div></div>
                      <span className="text-label">
                        <img src={panierIcon} alt="" style={{ width: '16px', filter: 'brightness(0) invert(1)' }} />
                        Ajouter
                      </span>
                    </button>

                    <button
                      onClick={() => onAddToWishlist(p)}
                      className={`btn-3d block-cube block-cube-hover ${isInWishlist(p._id) ? 'wish-active' : 'wish-inactive'}`}
                    >
                      <div className="bg-top"><div className="bg-inner"></div></div>
                      <div className="bg-right"><div className="bg-inner"></div></div>
                      <div className="bg"><div className="bg-inner"></div></div>
                      <span className="text-label">
                        {isInWishlist(p._id) ? '❤️ Favori' : '🤍 Liste'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}