"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import "../styles/globals.css";
import "../styles/loading.css";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

      if (currentUser) {
        setUser(currentUser);
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && isMounted) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error("Błąd podczas pobierania danych użytkownika:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
        if (!["/login", "/register"].includes(pathname)) {
          router.push("/login");
        }
      }

      if (isMounted) {
        setIsSessionReady(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [pathname]);

  if (!isSessionReady) {
    return (
      <html lang="pl">
        <body>
          <p>Ładowanie sesji...</p>
        </body>
      </html>
    );
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
