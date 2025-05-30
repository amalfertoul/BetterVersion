import React, { useState, useEffect } from 'react';
import "../style/Footer.css";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <footer className={`modern-footer ${isVisible ? 'visible' : ''}`}>
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
              <path d="M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z M12,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S14.21,16,12,16z"/>
            </svg>
          </div>
          <h3>À propos</h3>
          <p>Notre plateforme vous aide à créer et partager vos vision boards inspirants.</p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22.675,0H1.325C0.593,0,0,0.593,0,1.325v21.351C0,23.407,0.593,24,1.325,24H12.82v-9.294H9.692v-3.622h3.128V8.413 c0-3.1,1.893-4.788,4.659-4.788c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763v2.313h3.587 l-0.467,3.622h-3.12V24h6.116c0.73,0,1.323-0.593,1.323-1.325V1.325C24,0.593,23.407,0,22.675,0z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24">
                <path d="M23.954,4.569c-0.885,0.389-1.83,0.654-2.825,0.775c1.014-0.611,1.794-1.574,2.163-2.723 c-0.951,0.564-2.005,0.974-3.127,1.195c-0.898-0.959-2.173-1.558-3.591-1.558c-2.717,0-4.92,2.203-4.92,4.917 c0,0.39,0.045,0.765,0.127,1.124C7.691,8.094,4.066,6.13,1.64,3.161C1.213,3.883,0.975,4.722,0.975,5.625 c0,1.708,0.869,3.212,2.188,4.096c-0.807-0.026-1.566-0.248-2.228-0.616c0,0.021,0,0.041,0,0.062c0,2.386,1.693,4.374,3.946,4.827 c-0.413,0.111-0.849,0.171-1.296,0.171c-0.314,0-0.623-0.03-0.918-0.086c0.623,1.953,2.445,3.377,4.604,3.417 c-1.68,1.319-3.809,2.105-6.102,2.105c-0.39,0-0.779-0.023-1.17-0.067c2.189,1.394,4.768,2.209,7.557,2.209 c9.054,0,14-7.503,14-14c0-0.21-0.005-0.42-0.014-0.63C22.504,6.412,23.34,5.543,23.954,4.569z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10c5.52,0,10-4.48,10-10C22,6.48,17.52,2,12,2z M17,15.5h-2v2H9v-2H7v-2h2v-2h2v2h2v-2h2v2h2V15.5z M15,10.5v-1c0-0.55-0.45-1-1-1h-4c-0.55,0-1,0.45-1,1v1H7V9c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2v1.5H15z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <div className="footer-icon">
            <svg viewBox="0 0 24 24">
              <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/>
              <polygon points="7,10 7,14 17,14 17,10"/>
              <rect x="7" y="7" width="10" height="1.5"/>
            </svg>
          </div>
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="/" className="hover-effect">Accueil</a></li>
            <li><a href="/visionboards" className="hover-effect">Vision Boards</a></li>
            <li><a href="/profile" className="hover-effect">Profil</a></li>
            <li><a href="/explore" className="hover-effect">Explorer</a></li>
            <li><a href="/faq" className="hover-effect">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <div className="footer-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18H4V8l8,5l8-5V18z M12,11L4,6h16L12,11z"/>
            </svg>
          </div>
          <h3>Contact</h3>
          <p className="contact-info">
            <svg viewBox="0 0 24 24">
              <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5L4,8V6l8,5l8-5V8z"/>
            </svg>
            <span>email@example.com</span>
          </p>
          <p className="contact-info">
            <svg viewBox="0 0 24 24">
              <path d="M20,15.5c-1.2,0-2.5-0.2-3.6-0.6h-0.3c-0.3,0-0.5,0.1-0.7,0.3l-2.2,2.2c-2.8-1.5-5.2-3.8-6.6-6.6l2.2-2.2 c0.3-0.3,0.4-0.7,0.2-1.1C8.7,6.5,8.5,5.2,8.5,4c0-0.6-0.4-1-1-1H4C3.4,3,3,3.4,3,4c0,9.4,7.6,17,17,17c0.6,0,1-0.4,1-1v-3.5 C21,15.9,20.6,15.5,20,15.5z"/>
            </svg>
            <span>+1 (555) 123-4567</span>
          </p>
          <p className="contact-info">
            <svg viewBox="0 0 24 24">
              <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z"/>
            </svg>
            <span>Paris, France</span>
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
        <p>&copy; {currentYear} VisionBoard App. Tous droits réservés.</p>
        <div className="footer-links">
          <a href="/privacy">Politique de confidentialité</a>
          <a href="/terms">Conditions d'utilisation</a>
          <a href="/cookies">Préférences cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;