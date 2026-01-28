import { useState, useEffect, useCallback } from 'react';
import useSessionStorage from './useSessionStorage.jsx';
import SpinningMessage from './Congrats.jsx';
import '../css/Game.css';
import wheelUrl from '../assets/imgs/wheel.png';

const mtgSets = ['ala', 'blb', 'dmu', 'eld', 'khm', 'ltr', 'mom', 'neo', 'vow', 'znr', ];

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


function Game({ difficulty }) {
  const [images, setImages] = useSessionStorage("images", { 8: [], 15: [], 24: [] });
  const [highScores, setHighScores] = useSessionStorage("highScores", { 8: 0, 15: 0, 24: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clicked, setClicked] = useState([]);
  const [shuffleCount, setShuffleCount] = useState(0);

  const currentImages = images[difficulty] || [];
  const highScore = highScores[difficulty] || 0;

  const setCurrentImages = useCallback((newImages) => {
    setImages(prev => ({ ...prev, [difficulty]: newImages }));
  }, [difficulty, setImages]);

  const setHighScore = useCallback((newScore) => {
    setHighScores(prev => ({ ...prev, [difficulty]: newScore }));
  }, [difficulty, setHighScores]);

  useEffect(() => {
    setClicked([]);
    setError(null);
    
    if (currentImages.length !== difficulty) {
      setLoading(true);
      const fetchImages = async () => {
        try {
          // this is just to display the animation for 1 second
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          let allCards = [];
          let randomSet = mtgSets[Math.floor(Math.random() * mtgSets.length)];
          let nextPageUrl = `https://api.scryfall.com/cards/search?q=set:${randomSet}`;
          while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
            const json = await response.json();
            console.log(json.data);
            allCards = [...allCards, ...json.data];
            nextPageUrl = json.has_more ? json.next_page : null;
          }
          const filtered = allCards.filter(card => card.image_uris?.art_crop);
          const shuffled = shuffleArray(filtered);
          const sliced = shuffled.slice(0, difficulty);
          setCurrentImages(sliced);
        } catch (err) {
          console.error("Fetch error: ", err);
          setError("Failed to load images. Please try again.");
        } finally {
          setLoading(false);
        }
      }
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [difficulty, currentImages.length, setCurrentImages]);

  if (loading) return <div className='loading'><img src={wheelUrl} alt="Loading" /></div>;
  if (error) return <p className="error">{error}</p>;
  
  return (
    <div className="game">
      {clicked.length === difficulty && <SpinningMessage />}
      <div className="scores">
        <div className="score"><b>Score</b>: <span className="score-num">{clicked.length}</span></div>
        <div className="high-score"><b>High Score</b>: <span className="highscore-num">{highScore}</span></div>
      </div>
      <div className={`grid${difficulty}`}>
        {currentImages.map((image) => 
          <div
            key={`${image.id}-${shuffleCount}`}
            className="card"
            tabIndex={0}
            onClick={() => handleClick(image.id)}
            onKeyDown={(e) => handleKeyDown(e, image.id)}
          >
            <img
                className="fade-in"
                src={image.image_uris.art_crop} 
                alt="Random MtG Commander image"
            />
          </div>
        )}
      </div>
    </div>
  );

  function handleClick(id) {
    if (!clicked.includes(id)) {
      const newClickedLength = clicked.length + 1;
      setClicked(clicked => [...clicked, id]);
      if (newClickedLength > highScore && newClickedLength <= difficulty) {
        setHighScore(newClickedLength);
      }
    } else {
      setClicked([]);
    }
      randomizeImages();
  }

  function handleKeyDown(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(id);
    }
  }

  function randomizeImages() {
    setCurrentImages(shuffleArray(currentImages));
    setShuffleCount(c => c + 1);
  }
}

export default Game;