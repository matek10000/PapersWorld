"use client";

import React, { useEffect, useState } from 'react';
import { getAllBuildings } from '../../../../utils/buildings';
import { getUserData } from '../../../../utils/users';
import { auth } from '../../../../utils/firebaseConfig';
import '../../../../styles/village.css'; // Import dedykowanego stylu CSS

const Village = () => {
  const [buildings, setBuildings] = useState([]);
  const [userVillage, setUserVillage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchVillageData = async () => {
      try {
        if (!auth.currentUser) {
          console.warn('Użytkownik nie jest zalogowany');
          return;
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error('Brak userId - użytkownik nie jest zalogowany');
          return;
        }

        // Pobierz dane użytkownika (userData) i ustaw userVillage
        const userData = await getUserData(userId);
        if (userData?.village && isMounted) {
          console.log('Dane użytkownika (userData):', userData);
          setUserData(userData);
          setUserVillage(userData.village.building); // village.building to teraz dane użytkownika
        }

        // Pobierz dane budynków (buildings)
        const buildingsData = await getAllBuildings();
        if (isMounted) {
          console.log('Dane budynków (buildingsData):', buildingsData);
          setBuildings(buildingsData);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych wioski:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchVillageData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Ładowanie danych wioski...</p>;
  }

  return (
    <div className="village">
      {userVillage && buildings.map((building, index) => {
        // Porównanie buildingId z danymi z userVillage
        const userBuilding = String(userVillage.buildingId) === String(building.id) ? building : null;
        
        // Jeśli nie ma pasującego budynku, pomiń go
        if (!userBuilding) return null;

        // Użycie dynamicznej ścieżki do obrazka
        const imagePath = `/${userVillage.buildingId}_lvl${userVillage.level}.png`;
        console.log(`Generowanie ścieżki obrazka: ${imagePath}`); // Debug ścieżki

        return (
          <div key={`${userBuilding.id}-${index}`} className="building">
            <img 
              src={imagePath} 
              alt={userBuilding.name} 
              onError={() => console.error(`Nie można załadować obrazu: ${imagePath}`)} 
            />
            <p>{userBuilding.name} (Poziom {userVillage.level})</p>
          </div>
        );
      })}

      {userData && (
        <Resources coins={userData.resources?.coins || 0} paper={userData.resources?.paper || 0} />
      )}
    </div>
  );
};

const Resources = ({ coins, paper }) => {
  return (
    <div className="player-status">
      <h3>Zasoby</h3>
      <p><strong>Monety:</strong> <span>{coins}</span></p>
      <p><strong>Papier:</strong> <span>{paper}</span></p>
    </div>
  );
};

export default Village;
