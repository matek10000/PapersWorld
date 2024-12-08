"use client";

import { useState } from 'react';
import { auth } from '../../../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main>
      <div className="card">
        <h1>Rejestracja</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Hasło</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Zarejestruj się</button>
        </form>
      </div>
    </main>
  );
}
