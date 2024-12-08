"use client";

import { useState } from 'react';
import { auth } from '../../../utils/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main>
      <div className="card">
        <h1>Logowanie</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Hasło</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Zaloguj się</button>
        </form>
      </div>
    </main>
  );
}
