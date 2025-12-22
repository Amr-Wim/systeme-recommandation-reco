import React, { useEffect, useState } from 'react';
import recoIcon from './recommandations.png';
import iconeIcon from './icone.png';

export default function Recommendations({ user }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchRecs = async () => {
      if (!user || !user._id) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/recommend/${user._id}`);
        const data = await response.json();
        setRecs(data); 
      } catch (error) {
        console.error("Erreur lors du chargement des recommandations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [user._id]);

  async function buy(productId) {
    try {
      const response = await fetch('http://localhost:4000/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId })
      });
      if (response.ok) {
        setModalMessage('Produit acheté ! Vos recommandations vont bientôt se mettre à jour.');
        setShowModal(true);
      } else {
        setModalMessage("Erreur lors de l'achat");
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage("Erreur lors de l'achat");
      setShowModal(true);
    }
  }

  const categories = ['All', ...new Set(recs.map(p => p.category))];
  const filteredRecs = selectedCategory === 'All' ? recs : recs.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p style={{ fontFamily: 'Monospace', color: '#00326f' }}>Analyse de vos préférences en cours...</p>
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
          margin-bottom: 30px;
        }

        /* --- Style Filtre Catégorie --- */
        .filter-container {
          background: white;
          border: 3px solid var(--blue-dark);
          padding: 20px;
          box-shadow: 6px 6px 0px var(--blue-dark);
          margin-bottom: 40px;
        }

        .custom-select {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--blue-dark);
          font-family: 'Monospace';
          background: white;
          color: var(--blue-dark);
          font-weight: bold;
          outline: none;
          cursor: pointer;
        }

        /* --- Carte Recommandation 3D --- */
        .rec-card {
          border: 2px solid var(--blue-dark);
          background: white;
          transition: transform 0.3s ease;
          box-shadow: 8px 8px 0px var(--blue-dark);
        }

        .rec-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px var(--blue-light);
        }

        .category-badge {
          background: var(--blue-dark);
          color: white;
          padding: 4px 10px;
          font-size: 0.75rem;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 10px;
        }

        .price-text {
          color: var(--blue-dark);
          font-size: 1.5rem;
          font-weight: 900;
        }

        /* --- Bouton ACHETER 3D --- */
        .btn-3d {
          cursor: pointer;
          border: 0;
          background: transparent;
          color: #fff;
          padding: 14px;
          font-weight: bold;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          width: 100%;
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

        .text-label { position: relative; z-index: 3; }

        .empty-state {
          border: 3px dashed var(--blue-dark);
          padding: 40px;
          text-align: center;
          background: #f8f9fa;
        }
      `}</style>

      <div className="d-flex align-items-center mb-2">
        <img src={recoIcon} alt="Icon" style={{ width: '32px', marginRight: '15px' }} />
        <h2 className="page-title">RECOMMANDATIONS POUR {user.firstName.toUpperCase()}</h2>
      </div>

      {/* Filtre de catégorie au look industriel */}
      <div className="filter-container">
        <label className="fw-bold mb-2 d-block text-uppercase">Filtrer par univers :</label>
        <select
          className="custom-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'All' ? 'TOUTES LES CATÉGORIES' : cat.toUpperCase()}</option>
          ))}
        </select>
      </div>
      
      {filteredRecs.length === 0 ? (
        <div className="empty-state">
          <h5 className="fw-bold" style={{ color: 'var(--blue-dark)' }}>AUCUNE RECOMMANDATION DISPONIBLE</h5>
          <p className="mb-0">Explorez le catalogue et ajoutez des articles à votre liste pour recevoir des suggestions personnalisées.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRecs.map(p => (
            <div key={p._id} className="col-md-4">
              <div className="card h-100 rec-card">
                <div className="card-body d-flex flex-column">
                  <div className="category-badge">{p.category}</div>
                  <h5 className="fw-bold mb-3" style={{ color: 'var(--blue-dark)' }}>{p.name}</h5>
                  <div className="price-text mb-3">{p.price} €</div>
                  
                  <div className="mb-4 mt-auto">
                    <small className="text-muted d-block mb-1">TAGS :</small>
                    <div className="d-flex flex-wrap gap-1">
                      {p.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '10px', border: '1px solid #ccc', padding: '2px 5px' }}>
                          #{tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-white border-0 p-3">
                  <button
                    className="btn-3d block-cube block-cube-hover"
                    onClick={() => buy(p._id)}
                  >
                    <div className="bg-top"><div className="bg-inner"></div></div>
                    <div className="bg-right"><div className="bg-inner"></div></div>
                    <div className="bg"><div className="bg-inner"></div></div>
                    <span className="text-label">💰 ACHETER MAINTENANT</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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