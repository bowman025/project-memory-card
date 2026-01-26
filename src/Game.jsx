import { useState, useEffect, useMemo } from 'react';
import useSessionStorage from './useSessionStorage.jsx';

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function Game({ difficulty }) {
  const [imagesEasy, setImagesEasy] = useSessionStorage("images-easy", []);
  const [imagesMedium, setImagesMedium] = useSessionStorage("images-medium", []);
  const [imagesHard, setImagesHard] = useSessionStorage("images-hard", []);
  const [highScoreEasy, setHighScoreEasy] = useSessionStorage("highScore-easy", 0);
  const [highScoreMedium, setHighScoreMedium] = useSessionStorage("highScore-medium", 0);
  const [highScoreHard, setHighScoreHard] = useSessionStorage("highScore-hard", 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clicked, setClicked] = useState([]);

  const imageMap = useMemo(() => ({
    9: [imagesEasy, setImagesEasy],
    16: [imagesMedium, setImagesMedium],
    36: [imagesHard, setImagesHard],
  }), [imagesEasy, setImagesEasy, imagesMedium, setImagesMedium, imagesHard, setImagesHard]);

  const [currentImages, setCurrentImages] = imageMap[difficulty] || [[], () => {}];

  const scoreMap = useMemo(() => ({
    9: [highScoreEasy, setHighScoreEasy],
    16: [highScoreMedium, setHighScoreMedium],
    36: [highScoreHard, setHighScoreHard],
  }), [highScoreEasy, setHighScoreEasy, highScoreMedium, setHighScoreMedium, highScoreHard, setHighScoreHard]);

  const [highScore, setHighScore] = scoreMap[difficulty] || [0, () => {}];

  useEffect(() => {
    setClicked([]);
    setError(null);
    
    if (currentImages.length !== difficulty) {
      setLoading(true);
      const fetchImages = async () => {
        try {
          const cards = [];
          const cardIds = new Set();
          while (cards.length < difficulty) {
            const response = await fetch(
              'https://api.scryfall.com/cards/random?q=is%3Acommander'
            );
            const json = await response.json();
            if (!cardIds.has(json.id) && json.image_uris?.art_crop) {
              cards.push(json);
              cardIds.add(json.id);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          setCurrentImages(cards);
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

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="game">
      <div className="scores">
        <div className="score">Score: {clicked.length}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
      <div className={`grid ${difficulty}`}>
        {currentImages.map(image => 
          <div key={image.id} 
                  className="card" 
                  onClick={() => handleClick(image.id)}>
                    <img src={image.image_uris.art_crop} 
                    alt="Random MtG Commander image" />
          </div>)}
      </div>
    </div>
  );

  function handleClick(id) {
    console.log('Image id: ', id);
    if (!clicked.includes(id)) {
      const newClickedLength = clicked.length + 1;
      setClicked(clicked => [...clicked, id]);
      if (newClickedLength > highScore) {
        setHighScore(newClickedLength);
      }
    } else {
      setClicked([]);
    }
    randomizeImages();
  }

  function randomizeImages() {
    setCurrentImages(shuffleArray(currentImages));
  }
}

export default Game;