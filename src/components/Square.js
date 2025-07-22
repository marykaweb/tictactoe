import React from 'react';

const Square = ({ value, onClick }) => {
  return (
    <button className={`square ${value ? 'filled' : ''}`} onClick={onClick}>
      {value && <span className={`symbol ${value.toLowerCase()}`}>{value}</span>}
    </button>
  );
};

export default Square;