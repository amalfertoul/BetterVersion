import React, { useState, useEffect } from 'react';
import '../style/FirstPage.css';

const FirstPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const features = [
    {
      title: "Vision Board",
      description: "A space where your dreams come to life with inspiring image galleries and personalized thematic boards."
    },
    {
      title: "Task Management",
      description: "Break down your goals into daily, weekly, and monthly tasks with progress tracking."
    },
    {
      title: "Mini-Games",
      description: "Stimulate your mind with logic games and creative challenges to improve your focus."
    },
    {
      title: "Friends & Collaboration",
      description: "Connect with people who share your goals and participate in collective challenges."
    },
    {
      title: "Visualization & Planning",
      description: "Track your progress with detailed statistics and a personalized dashboard."
    }
  ];

  return (
    <div className="first-page">
      {/* Hero Section */}
      <header className={`hero ${scrolled ? 'scrolled' : ''}`}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-part">Become the</span>
              <span className="title-highlight">Best Version</span>
              <span className="title-part">of Yourself</span>
            </h1>
            <p className="hero-subtitle">
              Turn your dreams into reality with intuitive organization and continuous inspiration
            </p>
            <button className="cta-button">Start your journey</button>
          </div>
          <div className="hero-visual">
            <div className="vision-board-animation">
              <div className="board">
                <div className="image-item" style={{ animationDelay: '0.1s' }}>
                  <div className="image-placeholder travel"></div>
                  <div className="image-label">Travel</div>
                </div>
                <div className="image-item" style={{ animationDelay: '0.3s' }}>
                  <div className="image-placeholder career"></div>
                  <div className="image-label">Career</div>
                </div>
                <div className="image-item" style={{ animationDelay: '0.5s' }}>
                  <div className="image-placeholder health"></div>
                  <div className="image-label">Well-being</div>
                </div>
                <div className="image-item" style={{ animationDelay: '0.7s' }}>
                  <div className="image-placeholder projects"></div>
                  <div className="image-label">Projects</div>
                </div>
              </div>
              <div className="progress-tracker">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="progress-text">Goal at 75%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-header">
          <h2>Our Mission</h2>
          <p>BetterVersion is based on three essential pillars</p>
        </div>
        
        <div className="mission-pillars">
          <div className="pillar">
            <div className="pillar-icon inspire">
              <div className="icon-bg"></div>
              <svg viewBox="0 0 24 24">
                <path d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7Z" />
              </svg>
            </div>
            <h3>Inspire</h3>
            <p>With vision boards full of motivating images</p>
          </div>
          
          <div className="pillar">
            <div className="pillar-icon organize">
              <div className="icon-bg"></div>
              <svg viewBox="0 0 24 24">
                <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M12,17L7,12H10V8H14V12H17L12,17Z" />
              </svg>
            </div>
            <h3>Organize</h3>
            <p>Turn your goals into concrete steps, day by day</p>
          </div>
          
          <div className="pillar">
            <div className="pillar-icon connect">
              <div className="icon-bg"></div>
              <svg viewBox="0 0 24 24">
                <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12M5,15L4.4,14.5C2.4,12.6 1,11.4 1,9.9C1,8.7 2,7.7 3.2,7.7C3.9,7.7 4.6,8 5,8.5C5.4,8 6.1,7.7 6.8,7.7C8,7.7 9,8.6 9,9.9C9,11.4 7.6,12.6 5.6,14.5L5,15Z" />
              </svg>
            </div>
            <h3>Connect</h3>
            <p>The path to success is more rewarding when shared</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Main Features</h2>
          <p>Everything you need to turn your dreams into reality</p>
        </div>
        
        <div className="features-container">
          <div className="features-selector">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="tab-icon"></div>
                <span>{feature.title}</span>
              </div>
            ))}
          </div>
          
          <div className="feature-display">
            <div className="feature-content">
              <h3>{features[activeFeature].title}</h3>
              <p>{features[activeFeature].description}</p>
            </div>
            <div className="feature-visual">
              <div className={`visual-item ${activeFeature === 0 ? 'active' : ''}`}>
                <div className="vision-board-preview">
                  <div className="board-image"></div>
                  <div className="board-image"></div>
                  <div className="board-image"></div>
                  <div className="board-image"></div>
                </div>
              </div>
              <div className={`visual-item ${activeFeature === 1 ? 'active' : ''}`}>
                <div className="task-management-preview">
                  <div className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-content">
                      <div className="task-title">Morning meditation</div>
                      <div className="task-category">Daily</div>
                    </div>
                  </div>
                  <div className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-content">
                      <div className="task-title">Workout session</div>
                      <div className="task-category">Weekly</div>
                    </div>
                  </div>
                  <div className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-content">
                      <div className="task-title">Trip planning</div>
                      <div className="task-category">Monthly</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`visual-item ${activeFeature === 2 ? 'active' : ''}`}>
                <div className="minigame-preview">
                  <div className="game-grid">
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                    <div className="game-cell"></div>
                  </div>
                  <div className="game-score">Score: 320</div>
                </div>
              </div>
              <div className={`visual-item ${activeFeature === 3 ? 'active' : ''}`}>
                <div className="community-preview">
                  <div className="friends-list">
                    <div className="friend-item">
                      <div className="friend-avatar"></div>
                      <div className="friend-name">Marie</div>
                    </div>
                    <div className="friend-item">
                      <div className="friend-avatar"></div>
                      <div className="friend-name">Thomas</div>
                    </div>
                    <div className="friend-item">
                      <div className="friend-avatar"></div>
                      <div className="friend-name">Sophie</div>
                    </div>
                  </div>
                  <div className="community-challenge">
                    <div className="challenge-title">Challenge: 30 days of exercise</div>
                    <div className="challenge-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '60%' }}></div>
                      </div>
                      <div className="progress-text">12/20 participants</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`visual-item ${activeFeature === 4 ? 'active' : ''}`}>
                <div className="dashboard-preview">
                  <div className="stats-card">
                    <div className="stat-title">Tasks completed</div>
                    <div className="stat-value">87%</div>
                  </div>
                  <div className="stats-card">
                    <div className="stat-title">Monthly goals</div>
                    <div className="stat-value">4/6</div>
                  </div>
                  <div className="stats-card">
                    <div className="stat-title">Annual progress</div>
                    <div className="stat-value">42%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="section-header">
          <h2>They transformed their lives</h2>
          <p>Discover testimonials from our users</p>
        </div>
        
        <div className="testimonials">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">“</div>
              <p>BetterVersion helped me organize my professional goals like never before. In one year, I got the promotion I dreamed of!</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Thomas Dubois</div>
                  <div className="author-title">Project Manager</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">“</div>
              <p>Thanks to the vision boards, I made my dream of traveling to Asia come true. Today, I'm preparing for a 3-month trip!</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Sophie Martin</div>
                  <div className="author-title">Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      /* CTA Section */
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to become the best version of yourself?</h2>
            <p>Join thousands of people already transforming their lives with BetterVersion</p>
            <a href="/register">
          <button className="cta-button">Start for free</button>
            </a>
          </div>
        </section>

        {/* Footer */}
      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">BetterVersion</div>
            <div className="tagline">Turn your dreams into reality</div>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Apps</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copyright">© 2023 BetterVersion. All rights reserved.</div>
          <div className="social-links">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">t</a>
            <a href="#" className="social-icon">in</a>
            <a href="#" className="social-icon">ig</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FirstPage;