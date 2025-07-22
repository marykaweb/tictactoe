import React from 'react';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <div className="game">
      <h1>🎮 Крестики-Нолики</h1>
      <Board />
    </div>
  );
}

export default App;