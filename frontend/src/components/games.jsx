import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames } from '../slices/gamesSlice';
import { createMiniGameUser } from '../slices/gameUserSlice';

const Games = () => {
  const dispatch = useDispatch();

  // Retrieve games from Redux state
  const { games, loading, error } = useSelector((state) => state.games);

  // Retrieve the logged-in user's ID from Redux state
  const userId = useSelector((state) => state.users.user?.id);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handlePlay = (gameId, link) => {
    // Record the play action in the mini-game-users table
    dispatch(createMiniGameUser({ user_id: userId, mini_game_id: gameId, date: new Date().toISOString().split('T')[0] }));
    window.open(link, '_blank');
  };

  if (loading) {
    return <div className="loading-message">Loading games...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleClick = (gameId) => {
    dispatch(createMiniGameUser({ userId, gameId }));
  };

  return (
    <div 
      className="games-container" 
      onClick={(e) => {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
          const gameId = gameCard.getAttribute('data-game-id');
          handleClick(gameId);
        }
      }}
    >
      <h1 className="games-title">Calm and Educational Online Games</h1>
      
      <div className="games-grid">
        {games.map((game, index) => (
          <div 
            key={game.id} 
            className="game-card"
            data-game-id={game.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              className="game-image"
              src={"http://127.0.0.1:8000"+game.image || 'https://via.placeholder.com/300x180?text=Educational+Game'}
              alt={game.name}
            />
            <h3 className="game-title">{game.name}</h3>
            <p className="game-description">{game.description}</p>
            <button 
              className="play-button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay(game.id, game.link);
              }}
            >
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;