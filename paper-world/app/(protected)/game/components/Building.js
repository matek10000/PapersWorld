import React from 'react';

const Building = ({ type, level }) => {
  return (
    <div className={`building ${type} level-${level}`}>
      <img src={`/assets/buildings/${type}.png`} alt={`${type} level ${level}`} />
    </div>
  );
};

export default Building;
