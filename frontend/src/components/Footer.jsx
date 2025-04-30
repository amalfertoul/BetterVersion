import React from 'react';
import "../style/Footer.css";
const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>À propos</h3>
          <p>Notre plateforme vous aide à créer et partager vos vision boards inspirants.</p>
        </div>
        
        <div className="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/visionboards">Vision Boards</a></li>
            <li><a href="/profile">Profil</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>email@example.com</p>
        
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VisionBoard App. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;