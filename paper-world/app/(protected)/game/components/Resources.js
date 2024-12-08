import React from 'react';

const Resources = ({ coins, paper }) => {
  return (
    <div className="resources">
      <span>🪙 Monety: {coins}</span>
      <span>📜 Papier: {paper}</span>
    </div>
  );
};

export default Resources;
