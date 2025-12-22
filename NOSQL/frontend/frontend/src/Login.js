import React, { useState } from 'react';
import shopImage from './shop1.jpg';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function login() {
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onLogin(data.user);
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  }

  return (
    <div className="login-page-wrapper">
      <style>{`
        :root {
          --bg-page: #ffffffff; /* Light green */
          --blue-dark: #00326f; /* Dark blue */
          --blue-light: #0151aa; /* Dark teal */
          --bg-input: #0753b0ff; /* Teal for inputs */
          --gradient: linear-gradient(90deg, #00326f 0%, #041830ff 100%); /* Solid teal for buttons */
        }

        .login-page-wrapper {
          background-color: var(--bg-page);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Monospace', serif;
          padding: 20px;
        }

        .main-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          max-width: 1100px;
          width: 100%;
          gap: 50px;
          background: white;
        
          box-shadow: 0 10px 30px rgba(6, 1, 30, 0.44);
          padding: 40px;
          margin: 20px;
        }

        /* Section Image (Gauche) */
        .image-section {
          flex: 0 0 50%; /* 50% width */
          display: flex;
          align-items: center;
          text-align: center;
        }

        .form-section {
          flex: 0 0 50%; /* 50% width */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          
        }

        .image-section h2 {
          color: var(--blue-dark);
          margin-top: 20px;
          font-weight: bold;
        }

        /* Section Formulaire (Droite) */
        .form-section {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .form-3d {
          width: 350px;
          padding: 40px 20px;
        }

        .form-3d h1 {
          font-size: 24px;
          color: var(--blue-dark);
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
        }

        .control {
          margin-bottom: 30px;
          position: relative;
        }

        .control input {
          width: 100%;
          padding: 14px 16px;
          border: 0;
          background: transparent;
          color: #fff;
          font-family: monospace;
          letter-spacing: 0.05em;
          font-size: 16px;
          position: relative;
          z-index: 2;
          outline: none;
        }

        .block-cube {
          position: relative;
        }

        .block-cube .bg-top {
          position: absolute;
          height: 10px;
          background: var(--gradient);
          bottom: 100%;
          left: 5px;
          right: -5px;
          transform: skew(-45deg, 0);
          transition: all 0.2s ease-in-out;
        }

        .block-cube .bg-right {
          position: absolute;
          background: var(--blue-dark);
          top: -5px;
          bottom: 5px;
          width: 10px;
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
          background: var(--bg-input);
          position: absolute;
          left: 2px;
          top: 2px;
          right: 2px;
          bottom: 2px;
          transition: all 0.2s ease-in-out;
        }

        .block-cube.block-input input:focus ~ .bg-top .bg-inner,
        .block-cube.block-input input:focus ~ .bg-right .bg-inner,
        .block-cube.block-input input:focus ~ .bg .bg-inner {
          background: rgba(255, 255, 255, 0.1);
          top: 100%;
        }

        .btn-3d {
          width: 100%;
          cursor: pointer;
          border: 0;
          background: transparent;
          color: #fff;
          padding: 14px;
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
        }

        .block-cube-hover:hover .bg-inner {
          top: 100% !important;
        }

        .text-label {
          position: relative;
          z-index: 3;
        }

        .error-msg {
          color: #d9534f;
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .main-container {
            flex-direction: column;
            gap: 20px;
          }
          .image-section img {
            max-width: 250px;
          }
        }
      `}</style>

      <div className="main-container">
        {/* Colonne Gauche : Image Shopping */}
        <div className="image-section">
          <img 
            src={shopImage} /* Votre image importée */
            alt="Shopping Illustration" 
            className="main-image"
          />
        </div>

        {/* Colonne Droite : Formulaire 3D */}
        <div className="form-section">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--blue-dark)' }}>VOTRE BOUTIQUE</h2>
          <div className="form-3d">
            <h1>Sign In</h1>
            
            <div className="control block-cube block-input">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="bg-top"><div className="bg-inner"></div></div>
              <div className="bg-right"><div className="bg-inner"></div></div>
              <div className="bg"><div className="bg-inner"></div></div>
            </div>

            <div className="control block-cube block-input">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="bg-top"><div className="bg-inner"></div></div>
              <div className="bg-right"><div className="bg-inner"></div></div>
              <div className="bg"><div className="bg-inner"></div></div>
            </div>

            <button 
              className="btn-3d block-cube block-cube-hover" 
              type="button"
              onClick={login}
            >
              <div className="bg-top"><div className="bg-inner"></div></div>
              <div className="bg-right"><div className="bg-inner"></div></div>
              <div className="bg"><div className="bg-inner"></div></div>
              <span className="text-label">Log In</span>
            </button>

            {error && <div className="error-msg">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
