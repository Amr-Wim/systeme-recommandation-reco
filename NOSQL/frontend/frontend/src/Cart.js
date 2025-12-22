import React, { useState } from 'react';
import panierIcon from './panier.png';
import argentIcon from './argent.png';

export default function Cart({ cartItems, onRemove, onCheckout }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  async function handleCheckout() {
    setLoading(true);
    try {
      await onCheckout();
      setModalMessage('✅ Achat réussi!');
      setShowModal(true);
    } catch (err) {
      setModalMessage('❌ Erreur lors de l\'achat');
      setShowModal(true);
    }
    setLoading(false);
  }

  return (
    <div className="cart-page-wrapper" style={{ minHeight: '100vh', fontFamily: 'Monospace', padding: '40px 20px' }}>
      <style>{`
        :root {
          --blue-dark: #00326f;
          --blue-light: #0151aa;
          --bg-input: #0753b0ff;
          --gradient-blue: linear-gradient(90deg, #00326f 0%, #041830ff 100%);
          --gradient-red: linear-gradient(90deg, #d9534f 0%, #a02622 100%);
          --gradient-success: linear-gradient(90deg, #212E53 0%, #4A919E 100%);
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

        /* --- Conteneur Brutaliste --- */
        .brutalist-card {
          border: 3px solid var(--blue-dark);
          background: white;
          box-shadow: 10px 10px 0px var(--blue-dark);
          border-radius: 0;
          margin-bottom: 30px;
        }

        /* --- Item de Panier --- */
        .cart-item {
          border-bottom: 2px solid #eee;
          transition: background 0.2s;
        }
        .cart-item:last-child { border-bottom: 0; }
        .cart-item:hover { background: #f8fbff; }

        .price-tag {
          color: var(--blue-dark);
          font-weight: 900;
          font-size: 1.2rem;
        }

        /* --- État Vide --- */
        .empty-state {
          border: 3px dashed var(--blue-dark);
          padding: 60px;
          text-align: center;
          background: #f8f9fa;
        }

        /* --- Boutons 3D --- */
        .btn-3d {
          cursor: pointer;
          border: 0;
          background: transparent;
          color: #fff;
          padding: 12px;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
        }

        .block-cube { position: relative; }
        .block-cube .bg-top {
          position: absolute; height: 8px; bottom: 100%; left: 4px; right: -4px; 
          transform: skew(-45deg, 0); transition: all 0.2s;
        }
        .block-cube .bg-right {
          position: absolute; top: -4px; bottom: 4px; width: 8px; left: 100%;
          transform: skew(0, -45deg); transition: all 0.2s;
        }
        .block-cube .bg {
          position: absolute; left: 0; top: 0; right: 0; bottom: 0; transition: all 0.2s;
        }
        .block-cube .bg-inner {
          position: absolute; left: 2px; top: 2px; right: 2px; bottom: 2px; transition: all 0.2s;
        }
        .block-cube-hover:hover .bg-inner { top: 100% !important; }
        .text-label { position: relative; z-index: 3; display: flex; align-items: center; justify-content: center; gap: 8px; }

        /* Couleurs Boutons */
        .btn-red .bg-top, .btn-red .bg { background: var(--gradient-red); }
        .btn-red .bg-right { background: #a02622; }
        .btn-red .bg-inner { background: #d9534f; }

        .btn-pay .bg-top, .btn-pay .bg { background: var(--gradient-success); }
        .btn-pay .bg-right { background: #212E53; }
        .btn-pay .bg-inner { background: #4A919E; }

        .total-section {
          background: var(--blue-dark);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      <div className="container">
        <div className="d-flex align-items-center mb-2">
          <img src={panierIcon} alt="Panier" style={{ width: '32px', marginRight: '15px' }} />
          <h2 className="page-title m-0">VOTRE PANIER</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state mt-4">
            <h3 className="fw-bold mb-3" style={{ color: 'var(--blue-dark)' }}>VOTRE PANIER EST VIDE</h3>
            <p className="text-muted mb-0">Il est temps de remplir votre panier avec nos meilleurs produits !</p>
          </div>
        ) : (
          <div className="row mt-4">
            {/* Liste des produits */}
            <div className="col-lg-8">
              <div className="brutalist-card p-0">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item d-flex justify-content-between align-items-center p-4">
                    <div>
                      <span className="text-muted small text-uppercase">{item.category}</span>
                      <h5 className="fw-bold mb-1" style={{ color: 'var(--blue-dark)' }}>{item.name}</h5>
                      <span className="price-tag">{item.price} €</span>
                    </div>
                    
                    <button
                      onClick={() => onRemove(item._id)}
                      className="btn-3d block-cube block-cube-hover btn-red"
                      style={{ width: '140px' }}
                    >
                      <div className="bg-top"><div className="bg-inner"></div></div>
                      <div className="bg-right"><div className="bg-inner"></div></div>
                      <div className="bg"><div className="bg-inner"></div></div>
                      <span className="text-label">RETIRER</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé et Paiement */}
            <div className="col-lg-4">
              <div className="brutalist-card p-0 overflow-hidden">
                <div className="p-4">
                  <h4 className="fw-bold mb-4" style={{ color: 'var(--blue-dark)' }}>RÉSUMÉ</h4>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Articles ({cartItems.length})</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Livraison</span>
                    <span className="text-success fw-bold">GRATUIT</span>
                  </div>
                </div>

                <div className="total-section">
                  <span className="h5 mb-0 fw-bold">TOTAL</span>
                  <span className="h4 mb-0 fw-bold">{total.toFixed(2)} €</span>
                </div>

                <div className="p-4">
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn-3d block-cube block-cube-hover btn-pay w-100"
                    style={{ padding: '18px' }}
                  >
                    <div className="bg-top"><div className="bg-inner"></div></div>
                    <div className="bg-right"><div className="bg-inner"></div></div>
                    <div className="bg"><div className="bg-inner"></div></div>
                    <span className="text-label" style={{ fontSize: '18px' }}>
                      <img src={argentIcon} alt="Panier" style={{ width: '32px', marginRight: '15px' }} />
                      {loading ? 'CHARGEMENT...' : ' PAYER MAINTENANT'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {modalMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}