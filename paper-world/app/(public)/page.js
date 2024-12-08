"use client";

import './home.css'; // Import stylów tylko dla strony głównej

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <div className="logo-container">
          <img src="/logo.png" alt="Paper World Logo" className="logo" />
        </div>
      </div>
    </main>
  );
}
