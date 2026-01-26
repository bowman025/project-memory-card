import { useState } from 'react';
import Game from './Game.jsx';
import './App.css';

function App() {
  const [main, setMain] = useState(true);
  const [difficulty, setDifficulty] = useState(null);

  function toggleMain() {
    setMain(!main);
  }

  function handleDifficultySelect(diff) {
    setDifficulty(diff);
    toggleMain();
  }
  
  return (
    <>
      <header>
        <h1 
          onClick={() => main || toggleMain()} 
          style={{ cursor: 'pointer' }}
        >
          <i>Magic</i>: The Memory Card Game
        </h1>
      </header>
      <main>
        {main ? (
          <div className="difficulty">
            <h2>Choose Difficulty:</h2>
            <div className="buttons">
              <button onClick={() => handleDifficultySelect(9)}>Easy</button>
              <button onClick={() => handleDifficultySelect(16)}>Normal</button>
              <button onClick={() => handleDifficultySelect(36)}>Hard</button>
            </div>
          </div>
        ) : (
          <Game difficulty={difficulty} />
        )}
      </main>
      <footer>Made by <a href="https://github.com/bowman025">bowman025</a>.</footer>
    </>
  );
}

export default App;