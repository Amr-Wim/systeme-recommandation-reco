import React, { useState, useEffect } from 'react';
import boxIcon from './box.png';

export default function Purchases({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  async function fetchPurchases() {
    try {
      const res = await fetch(`http://localhost:4000/api/purchase/${user._id}`);
      const data = await res.json();
      setPurchases(data || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3" style={{ fontFamily: 'Monospace', color: 'var(--blue-dark)' }}>RÉCUPÉRATION DE VOS TRANSACTIONS...</p>
      </div>
    );
  }

  return (
    <div className="purchases-wrapper" style={{ minHeight: '100vh', fontFamily: 'Monospace', padding: '40px 20px' }}>
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
          margin-bottom: 40px;
        }

        /* --- Carte d'achat Brutaliste --- */
        .purchase-card {
          border: 3px solid var(--blue-dark);
          background: white;
          box-shadow: 8px 8px 0px var(--blue-dark);
          border-radius: 0;
          margin-bottom: 25px;
          padding: 25px;
          transition: transform 0.2s;
        }

        .purchase-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 11px 11px 0px var(--blue-light);
        }

        /* --- Badge de Statut 3D --- */
        .status-badge {
          background: var(--blue-dark);
          color: white;
          padding: 8px 15px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.8rem;
          display: inline-block;
          border-left: 4px solid var(--blue-light);
        }

        .price-text {
          color: var(--blue-dark);
          font-weight: 900;
          font-size: 1.2rem;
        }

        .date-text {
          font-size: 0.85rem;
          color: #666;
          background: #f0f0f0;
          padding: 2px 8px;
          display: inline-block;
        }

        /* --- État Vide --- */
        .empty-purchases {
          border: 3px dashed var(--blue-dark);
          padding: 60px;
          text-align: center;
          background: #f8f9fa;
        }

        .product-name {
          color: var(--blue-dark);
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .category-tag {
          font-size: 0.75rem;
          color: var(--blue-light);
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="container">
        <div className="d-flex align-items-center mb-2">
          <img src={boxIcon} alt="Box" style={{ width: '32px', marginRight: '15px' }} />
          <h2 className="page-title m-0">Historique des Achats</h2>
        </div>

        {purchases.length === 0 ? (
          <div className="empty-purchases mt-4">
            <h3 className="fw-bold mb-3" style={{ color: 'var(--blue-dark)' }}>AUCUN ACHAT ENREGISTRÉ</h3>
            <p className="text-muted mb-0">C'est le moment idéal pour passer votre première commande !</p>
          </div>
        ) : (
          <div className="mt-4">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="purchase-card">
                <div className="row align-items-center">
                  {/* Informations Produit */}
                  <div className="col-md-7">
                    <div className="category-tag">CATÉGORIE: {purchase.product_id?.category || 'N/A'}</div>
                    <h4 className="product-name">
                      {purchase.product_id?.name || 'Produit supprimé'}
                    </h4>
                    <div className="price-text">Montant : {purchase.product_id?.price || '0'} €</div>
                  </div>

                  {/* Meta Informations (Date & Statut) */}
                  <div className="col-md-5 text-md-end mt-3 mt-md-0">
                    <div className="mb-2">
                      <span className="date-text">
                        COMMANDÉ LE : {new Date(purchase.timestamp).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="status-badge">
                      ✅ CONFIRMÉ & PAYÉ
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