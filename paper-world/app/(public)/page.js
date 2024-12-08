"use client";

import Link from 'next/link';
import './home.css'; // Import stylów tylko dla strony głównej

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <div className="card">
          <h1>Paper World</h1>
          <Link href="/register" className="button">
            Zacznij teraz
          </Link>
          <p>Masz już konto? <Link href="/login">Zaloguj się!</Link></p>
        </div>
      </div>
    </main>
  );
}
