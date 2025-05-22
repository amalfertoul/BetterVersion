import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames } from '../slices/gamesSlice';
import { createMiniGameUser } from '../slices/gameUserSlice';

const Games = () => {
  const dispatch = useDispatch();

  // Retrieve games from Redux state
  const { games, loading, error } = useSelector((state) => state.games);

  // Retrieve the logged-in user's ID from Redux state
  const userId = useSelector((state) => state.users.user?.id);

  // State to track the currently selected game
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handlePlay = (game) => {
    // Record the play action in the mini-game-users table
    dispatch(createMiniGameUser({ user_id: userId, mini_game_id: game.id, date: new Date().toISOString().split('T')[0] }));
    setSelectedGame(game); // Set the selected game to display the game player
  };

  const handleBack = () => {
    setSelectedGame(null); // Reset the selected game to go back to the game list
  };

  if (loading) {
    return <div className="loading-message">Loading games...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="games-container">
      {selectedGame ? (
        <div className="game-player">
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
          <h2 className="game-title">{selectedGame.name}</h2>
          <div className="game-frame">
            {/* Ruffle will automatically replace this <object> tag */}
            <object
              type="application/x-shockwave-flash"
              data={`http://127.0.0.1:8000${selectedGame.link}`}
              width="800"
              height="600"
            >
              <param name="movie" value={`http://127.0.0.1:8000${selectedGame.link}`} />
              <param name="allowFullScreen" value="true" />
              <param name="allowScriptAccess" value="always" />
              <p>Your browser does not support Flash content. Please use a modern browser with Ruffle enabled.</p>
            </object>
          </div>
        </div>
      ) : (
        <>
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
                  src={`http://127.0.0.1:8000${game.image}` || 'https://via.placeholder.com/300x180?text=Educational+Game'}
                  alt={game.name}
                />
                <h3 className="game-title">{game.name}</h3>
                <p className="game-description">{game.description}</p>
                <button
                  className="play-button"
                  onClick={() => handlePlay(game)}
                >
                  Play
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Games;