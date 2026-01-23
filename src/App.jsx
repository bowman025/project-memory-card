import { useState, useEffect } from 'react';
import './App.css'

function App() {

  return (
    <>
      <h1>Memory Card Game!</h1>
      <ImageFetcher />
    </>
  )
}

export default App

function ImageFetcher() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState([]);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cards = [];
        const cardIds = new Set();
        while (cards.length < 16) {
          const response = await fetch('https://api.scryfall.com/cards/random')
          const json = await response.json();
          if (!cardIds.has(json.id)) {
            cards.push(json);
            cardIds.add(json.id);
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setImages(cards);
      } catch (error) {
        console.error("Fetch error: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) return <p className='loading'>Loading...</p>

  return (
    <div className="game">
      <div className='grid'>
        {images.map(image => 
          <button key={image.id} 
                  className="cell" 
                  onClick={() => handleClick(image.id)}>
                    <img src={image.image_uris.art_crop} alt="Random MtG image" />
          </button>)}
      </div>
      <div className='score'>Score: {clicked.length}</div>
      <div className='high-score'>High Score: {highScore}</div>
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
    const randomized = [...images];
    for (let i = randomized.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
    };
    setImages(randomized);
  }
}