"use client";

import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import '../styles/globals.css'; // Importowanie stylów globalnych

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Uzyskaj aktualną ścieżkę URL

  useEffect(() => {
    let isMounted = true; // Flaga, czy komponent jest zamontowany

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return; // Jeśli komponent został odmontowany, nie rób nic

      if (currentUser) {
        setUser(currentUser);

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && isMounted) {
            const data = userSnap.data();
            setUserData(data);
          }
        } catch (error) {
          console.error('Błąd podczas pobierania danych użytkownika:', error);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setUserData(null);
          // Sprawdź, czy użytkownik jest na publicznej stronie (login lub register)
          const publicPages = ['/login', '/register'];
          if (!publicPages.includes(pathname)) {
            router.push('/login');
          }
        }
      }

      if (isMounted) {
        setIsSessionReady(true);
      }
    });

    // Funkcja czyszcząca - usuń nasłuch i oznacz, że komponent został odmontowany
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [pathname]);

  if (!isSessionReady) {
    return <p>Ładowanie sesji...</p>;
  }

  return (
    <html lang="pl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Paper World</title>
      </head>
      <body>
        <div className="layout-container">
          <nav>
            <ul className="navigation">
              {!user && <li><a href="/">Strona główna</a></li>}
              {!user && <li><a href="/login">Zaloguj się</a></li>}
              {!user && <li><a href="/register">Zarejestruj się</a></li>}
              {user && !userData?.nickname && <li><a href="/profile">Profil</a></li>}
              {user && <li><a href="/game">Graj</a></li>}
            </ul>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
