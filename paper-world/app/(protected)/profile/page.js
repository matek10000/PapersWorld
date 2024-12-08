"use client";

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../utils/firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.nickname) {
          router.push('/game'); // Jeśli użytkownik ma już nickname, przekierowanie do gry
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid;

    if (!nickname) {
      alert('Musisz wpisać swój nick!');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        nickname: nickname,
        resources: { 
          coins: 20, 
          paper: 100 
        },
        village: {
          building: {
            buildingId: '1', // Dodanie domyślnego budynku
            level: 1
          }
        },
        CreatedAt: serverTimestamp(),
      }, { merge: true });

      router.push('/game');
    } catch (err) {
      console.error('Błąd podczas zapisywania danych:', err);
    }
  };

  return (
    <main>
      <div className="card">
        <h1>Ustaw swój nick</h1>
        <form onSubmit={handleSave}>
          <label htmlFor="nickname">Nick gracza</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            placeholder="Wpisz swój nick"
          />
          <button type="submit">Zapisz</button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
