import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames } from '../slices/gamesSlice';
import { createMiniGameUser } from '../slices/gameUserSlice';

const Games = () => {
  const dispatch = useDispatch();

  // Récupérer les jeux depuis le state Redux
  const { games, loading, error } = useSelector((state) => state.games);

  // Récupérer l'id de l'utilisateur connecté depuis le state Redux
  const userId = useSelector((state) => state.users.userId);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handlePlay = (gameId, link) => {
    // Enregistrer l'action de jouer dans la table mini-game-users
    dispatch(createMiniGameUser({ userId, gameId }));
    window.open(link, '_blank');
  };

  if (loading) {
    return <div className="loading-message">Chargement des jeux...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="games-container">
      <h1 className="games-title">Jeux calmes et éducatifs en ligne</h1>
      
      <div className="games-grid">
        {games.map((game, index) => (
          <div 
            key={game.id} 
            className="game-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              className="game-image"
              src={game.image || 'https://via.placeholder.com/300x180?text=Jeux+Éducatif'}
              alt={game.name}
            />
            <h3 className="game-title">{game.name}</h3>
            <p className="game-description">{game.description}</p>
            <button 
              className="play-button"
              onClick={() => handlePlay(game.id, game.link)}
            >
              Jouer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;