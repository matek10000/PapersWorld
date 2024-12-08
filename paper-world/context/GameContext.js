import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [resources, setResources] = useState({ coins: 20, paper: 100 });
  const [buildings, setBuildings] = useState([]);

  const addBuilding = (type) => {
    setBuildings([...buildings, { type, level: 1 }]);
  };

  const upgradeBuilding = (index) => {
    const updatedBuildings = buildings.map((building, i) => 
      i === index ? { ...building, level: building.level + 1 } : building
    );
    setBuildings(updatedBuildings);
  };

  return (
    <GameContext.Provider value={{ resources, setResources, buildings, addBuilding, upgradeBuilding }}>
      {children}
    </GameContext.Provider>
  );
};
