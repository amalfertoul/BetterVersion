import React from 'react';

const JeuxSanteCalme = () => {
  const games = [
    {
      id: 'todo-zen',
      name: "To-Do Adventure",
      image: "https://via.placeholder.com/300x200?text=To-Do+Adventure",
      description: "Un jeu de to-do list mignon avec un petit panda.",
      link: "https://play.google.com/store/apps/details?id=com.plantodo&hl=fr"
    },
    {
      id: 'flow',
      name: "Flow Free",
      image: "https://via.placeholder.com/300x200?text=Flow+Free",
      description: "Un jeu de puzzle relaxant avec des tuyaux colorés.",
      link: "https://www.coolmathgames.com/0-flow-free"
    },
    {
      id: 'zen-sand',
      name: "This Is Sand",
      image: "https://via.placeholder.com/300x200?text=This+Is+Sand",
      description: "Créer des paysages de sable relaxants.",
      link: "https://thisissand.com/"
    },
    {
      id: 'mandala',
      name: "Mandala Coloring",
      image: "https://via.placeholder.com/300x200?text=Mandala+Coloring",
      description: "Colorie des mandalas pour te détendre.",
      link: "https://www.color-mandala.com/"
    },
    {
      id: 'tiny-fishing',
      name: "Tiny Fishing",
      image: "https://via.placeholder.com/300x200?text=Tiny+Fishing",
      description: "Un jeu calme pour pêcher tranquillement.",
      link: "https://www.coolmathgames.com/0-tiny-fishing"
    },
    {
      id: 'slides',
      name: "I Love Hue",
      image: "https://via.placeholder.com/300x200?text=I+Love+Hue",
      description: "Un puzzle relaxant basé sur les couleurs.",
      link: "https://play.google.com/store/apps/details?id=com.zutgames.ilovehue"
    },
    {
      id: 'crossword',
      name: "Daily Crossword",
      image: "https://via.placeholder.com/300x200?text=Crossword",
      description: "Exerce ton esprit avec une grille quotidienne.",
      link: "https://www.nytimes.com/crosswords"
    },
    {
      id: 'calm-puzzle',
      name: "Jigsaw Explorer",
      image: "https://via.placeholder.com/300x200?text=Puzzle",
      description: "Fais des puzzles zen en ligne.",
      link: "https://www.jigsawexplorer.com/"
    }
  ];

  return (
    <div>
      <h1>Jeux calmes et éducatifs en ligne</h1>
      <div>
        {games.map((game) => (
          <div key={game.id}>
            <img src={game.image} alt={game.name} />
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <button onClick={() => window.open(game.link, "_blank")}>
              Jouer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JeuxSanteCalme;
