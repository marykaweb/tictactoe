import React from 'react';
import Square from './Square';

const Board = () => {
  const [squares, setSquares] = React.useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
	const [modalMessage, setModalMessage] = React.useState('');
	const [vsBot, setVsBot] = React.useState(false);

  const winner = calculateWinner(squares);

  const handleClick = (i) => {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  React.useEffect(() => {
  if (vsBot && !xIsNext && !winner && squares.some(sq => sq === null)) {
    // Задержка, чтобы не было мгновенного хода
    const timer = setTimeout(() => {
      const botMove = findBestMove(squares);
      const nextSquares = squares.slice();
      nextSquares[botMove] = 'O';
      setSquares(nextSquares);
      setXIsNext(true);
    }, 500); // имитация "размышления"

    return () => clearTimeout(timer);
  }
}, [squares, xIsNext, vsBot]);

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

	const resetGame = () => {
	  setSquares(Array(9).fill(null));
	  setXIsNext(true);
	};

  let status;
  if (!winner) {
    status = 'Следующий ход: ' + (xIsNext ? 'X' : 'O');
  }

  React.useEffect(() => {
	  const winner = calculateWinner(squares);

	  if (winner) {
	    setModalMessage(`🎉 Победил игрок ${winner}!`);
	    setShowModal(true);
	  } else if (!squares.includes(null)) {
	    setModalMessage('🤝 Ничья!');
	    setShowModal(true);
	  }
	}, [squares]);

  return (
    <div>
      <div className="status">{status}</div>
      <div className="game-mode">
  <label>
    <input
      type="checkbox"
      checked={vsBot}
      onChange={(e) => setVsBot(e.target.checked)}
    />
    🤖 Играть против бота
  </label>
</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div className="game-controls">
		  <button onClick={resetGame}>🔄 Начать заново</button>
		</div>
		{showModal && (
		  <div className="modal-overlay">
		    <div className="modal">
		      <h2>{modalMessage}</h2>
		      <button onClick={() => {
		        setShowModal(false);
		        resetGame();
		      }}>
		        Играть снова
		      </button>
		    </div>
		  </div>
		)}
    </div>
  );
};

function minimax(squares, depth, isMaximizing) {
  const winner = calculateWinner(squares);

  // Базовые случаи
  if (winner === 'O') return 10 - depth;  // Бот выиграл
  if (winner === 'X') return depth - 10;  // Игрок выиграл
  if (!squares.includes(null)) return 0;  // Ничья

  if (isMaximizing) {
    // Ход бота — максимизируем результат
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    // Ход игрока — минимизируем результат
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'X';
        const score = minimax(squares, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Находит лучший ход для бота
function findBestMove(squares) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = 'O';
      const score = minimax(squares, 0, false);
      squares[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

// Проверка победителя
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default Board;