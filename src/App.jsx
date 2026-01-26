import { useState } from 'react';
import Game from './Game.jsx';
import './App.css'

function App() {
  const [main, setMain] = useState(true);
  const [difficulty, setDifficulty] = useState(null);

  function toggleMain() {
    setMain(!main);
  }
  
  if (main) {
    return (
      <>
        <h1 style={{ cursor: 'pointer' }}>Memory Card Game</h1>
        <div>
          <h2>Choose Difficulty:</h2>
          <button onClick={() => {
            setDifficulty(9);
            toggleMain();
            }}>Easy</button>
          <button onClick={() => {
            setDifficulty(16);
            toggleMain();
            }}>Normal</button>
          <button onClick={() => {
            setDifficulty(36);
            toggleMain();
            }}>Hard</button>
        </div>
      </>
    )
  } else {
    return (
    <>
      <h1 onClick={() => {
        toggleMain();
        setDifficulty(null);
      }} style={{ cursor: 'pointer' }}>Memory Card Game</h1>
      <Game difficulty={difficulty} />
    </>
  )}
}

export default App;