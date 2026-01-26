import { useState, useEffect } from 'react';
import useSessionStorage from './useSessionStorage';

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
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState([]);
  const [highScore, setHighScore] = useState(0);

  const imageMap = {
    9: [imagesEasy, setImagesEasy],
    16: [imagesMedium, setImagesMedium],
    36: [imagesHard, setImagesHard],
  };

  const [currentImages, setCurrentImages] = imageMap[difficulty];
  const images = currentImages;

  useEffect(() => {
    if (currentImages.length !== difficulty) {
      const fetchImages = async () => {
        try {
          const cards = [];
          const cardIds = new Set();
          while (cards.length < difficulty) {
            const response = await fetch('https://api.scryfall.com/cards/random')
            const json = await response.json();
            if (!cardIds.has(json.id) && json.image_uris?.art_crop) {
              cards.push(json);
              cardIds.add(json.id);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          setCurrentImages(cards);
        } catch (error) {
          console.error("Fetch error: ", error);
        } finally {
          setLoading(false);
        }
      }
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [difficulty, currentImages, setCurrentImages]);

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="game">
      <div className="scores">
        <div className="score">Score: {clicked.length}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
      <div className={`grid ${difficulty}`}>
        {images.map(image => 
          <div key={image.id} 
                  className="card" 
                  onClick={() => handleClick(image.id)}>
                    <img src={image.image_uris.art_crop} alt="Random MtG image" />
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
    setCurrentImages(shuffleArray(images));
  }
}

export default Game;