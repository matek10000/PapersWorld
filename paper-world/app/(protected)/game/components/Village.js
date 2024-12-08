"use client";

import React, { useEffect, useState } from 'react';
import { getAllBuildings } from '../../../../utils/buildings';
import { getUserData } from '../../../../utils/users';
import { auth } from '../../../../utils/firebaseConfig';

const Village = () => {
  const [buildings, setBuildings] = useState([]);
  const [userVillage, setUserVillage] = useState(null);
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

        const userData = await getUserData(userId);
        if (userData?.village && isMounted) {
          setUserVillage(userData.village.building);
        }

        const buildingsData = await getAllBuildings();
        if (isMounted) setBuildings(buildingsData);
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
      {userVillage && buildings.map((building) => {
        const userBuilding = userVillage.buildingId === building.id ? building : null;
        if (!userBuilding) return null;

        // Użycie dynamicznej ścieżki do obrazka
        const imagePath = `/th_1.png`; // Poprawiona ścieżka do obrazu w public

        return (
          <div key={userBuilding.id} className="building">
            <img src={imagePath} alt={userBuilding.name} />
            <p>{userBuilding.name} (Poziom {userVillage.level})</p>
          </div>
        );
      })}
    </div>
  );
};

export default Village;
