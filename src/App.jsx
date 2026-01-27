import { useState } from 'react';
import Game from './Game.jsx';
import Sidebar from './Sidebar.jsx';
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

  function handleHomeSelectMenu() {
    if (!main) toggleMain();
  }

  function handleDiffSelectMenu(diff) {
    if (main) toggleMain();
    setDifficulty(diff);
  }
  
  return (
    <>
      <header>
        <h1 
          onClick={() => main || toggleMain()} 
          style={{ cursor: 'pointer' }}
        >
          <span className='title'>Magic: </span>
          <span className="subtitle">The Memory Card Game</span>
        </h1>
      </header>
      <main>
        <Sidebar 
          onDifficultySelect={handleDiffSelectMenu} 
          onHome={handleHomeSelectMenu}
        />
        {main ? (
          <div className="difficulty">
            <h2>Choose Difficulty:</h2>
            <div className="buttons">
              <button 
                className="btn-easy" 
                onClick={() => handleDifficultySelect(8)}
                >
                  Easy
                </button>
              <button 
                className="btn-normal" 
                onClick={() => handleDifficultySelect(15)}
                >
                  Normal
              </button>
              <button 
                className="btn-hard" 
                onClick={() => handleDifficultySelect(24)}
                >
                  Hard
              </button>
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