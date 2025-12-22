import React from 'react';
import heartIcon from './heart.png';

export default function Wishlist({ wishlistItems, onRemove }) {
  return (
    <div className="wishlist-wrapper" style={{ minHeight: '100vh', fontFamily: 'Monospace', padding: '40px 20px' }}>
      <style>{`
        :root {
          --blue-dark: #00326f;
          --blue-light: #0151aa;
          --bg-input: #0753b0ff;
          --gradient-blue: linear-gradient(90deg, #00326f 0%, #041830ff 100%);
          --gradient-red: linear-gradient(90deg, #d9534f 0%, #a02622 100%);
        }

        .page-title {
          color: var(--blue-dark);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom: 4px solid var(--blue-dark);
          display: inline-block;
          margin-bottom: 40px;
        }

        /* --- Carte Wishlist 3D Brutaliste --- */
        .wish-card {
          border: 2px solid var(--blue-dark);
          background: white;
          transition: transform 0.3s ease;
          box-shadow: 8px 8px 0px var(--blue-dark);
          border-radius: 0;
          height: 100%;
        }

        .wish-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px var(--blue-light);
        }

        .price-tag {
          color: var(--blue-dark);
          font-weight: 900;
          font-size: 1.2rem;
        }

        /* --- État Vide --- */
        .empty-wishlist {
          border: 3px dashed var(--blue-dark);
          padding: 60px;
          text-align: center;
          background: #f8f9fa;
          box-shadow: 10px 10px 0px rgba(0, 50, 111, 0.1);
        }

        /* --- Bouton Supprimer 3D (Thème Rouge) --- */
        .btn-3d-red {
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
          position: absolute; height: 8px; background: var(--gradient-red);
          bottom: 100%; left: 4px; right: -4px; transform: skew(-45deg, 0);
          transition: all 0.2s;
        }
        .block-cube .bg-right {
          position: absolute; background: #a02622;
          top: -4px; bottom: 4px; width: 8px; left: 100%;
          transform: skew(0, -45deg); transition: all 0.2s;
        }
        .block-cube .bg {
          position: absolute; left: 0; top: 0; right: 0; bottom: 0;
          background: var(--gradient-red); transition: all 0.2s;
        }
        .block-cube .bg-inner {
          background: #d9534f;
          position: absolute; left: 2px; top: 2px; right: 2px; bottom: 2px;
          transition: all 0.2s;
        }

        .block-cube-hover:hover .bg-inner {
          top: 100% !important;
        }

        .text-label { position: relative; z-index: 3; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .category-label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="container">
        <div className="d-flex align-items-center mb-2">
          <img src={heartIcon} alt="Wishlist" style={{ width: '32px', marginRight: '15px' }} />
          <h2 className="page-title m-0">Ma Liste de Souhaits</h2>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist mt-4">
            <h3 className="fw-bold mb-3" style={{ color: 'var(--blue-dark)' }}>VOTRE LISTE EST VIDE</h3>
            <p className="text-muted">Explorez le catalogue pour ajouter vos coups de cœur ici !</p>
          </div>
        ) : (
          <div className="row g-4 mt-2">
            {wishlistItems.map((item) => (
              <div key={item._id} className="col-md-4 col-lg-3">
                <div className="card wish-card">
                  <div className="card-body d-flex flex-column">
                    <span className="category-label mb-1">{item.category}</span>
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--blue-dark)' }}>{item.name}</h5>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="price-tag">{item.price} €</span>
                      <span style={{ color: '#f39c12' }}>★ {item.rating || 'N/A'}</span>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={() => onRemove(item._id)}
                        className="btn-3d-red block-cube block-cube-hover"
                      >
                        <div className="bg-top"><div className="bg-inner"></div></div>
                        <div className="bg-right"><div className="bg-inner"></div></div>
                        <div className="bg"><div className="bg-inner"></div></div>
                        <span className="text-label">❌ SUPPRIMER</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}