import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames } from '../slices/gamesSlice';
import { createMiniGameUser } from '../slices/gameUserSlice';
import { useNavigate } from 'react-router-dom';
import '../style/Games.css'; // Import your CSS styles for the games component

const Games = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { games, loading, error } = useSelector((state) => state.games);
  const userId = useSelector((state) => state.users.user?.id);

  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
    dispatch(fetchGames());
  }, [userId, navigate, dispatch]);

  const handlePlay = (game) => {
    setIsLoadingGame(true);
    
    // Record the play action in the mini-game-users table
    dispatch(createMiniGameUser({ 
      user_id: userId, 
      mini_game_id: game.id, 
      date: new Date().toISOString().split('T')[0] 
    }));
    
    // Simulate loading before showing game
    setTimeout(() => {
      setSelectedGame(game);
      setIsLoadingGame(false);
    }, 1200);
  };

  const handleBack = () => {
    setSelectedGame(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
        </div>
        <p>Loading educational games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Games</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="games-app">
      {/* Floating decorative elements */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>
      
      <div className="games-container">
        {selectedGame ? (
          <div className="game-player">
            <div className="player-header">
              <button className="back-button" onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Games
              </button>
              <h2 className="game-title">{selectedGame.name}</h2>
            </div>
            
            <div className="game-frame">
              {isLoadingGame ? (
                <div className="game-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading {selectedGame.name}...</p>
                </div>
              ) : (
                <object
                  type="application/x-shockwave-flash"
                  data={`http://127.0.0.1:8000${selectedGame.link}`}
                  width="100%"
                  height="100%"
                >
                  <param name="movie" value={`http://127.0.0.1:8000${selectedGame.link}`} />
                  <param name="allowFullScreen" value="true" />
                  <param name="allowScriptAccess" value="always" />
                  <p>Your browser does not support Flash content. Please use a modern browser with Ruffle enabled.</p>
                </object>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="games-header">
              <h1 className="games-title">Calm & Educational <span>Games</span></h1>
              <p className="games-subtitle">Discover games that stimulate your mind and help you relax</p>
            </div>
            
            <div className="games-grid">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className="game-card"
                  data-game-id={game.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="game-card-inner">
                    <div className="game-image-container">
                      <img
                        className="game-image"
                        src={`http://127.0.0.1:8000${game.image}` || 'https://via.placeholder.com/300x180?text=Educational+Game'}
                        alt={game.name}
                      />
                      <div className="game-overlay"></div>
                    </div>
                    <div className="game-info">
                      <h3 className="game-title">{game.name}</h3>
                      <p className="game-description">{game.description}</p>
                      <button
                        className="play-button"
                        onClick={() => handlePlay(game)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                        </svg>
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="games-footer">
        <p>© 2023 Educational Games Platform | Designed for Learning & Fun</p>
      </div>
    </div>
  );
};

export default Games;