import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import './App.css';

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = 加载中

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9f9' }}>
      <div style={{ color: '#536471', fontSize: 15 }}>加载中…</div>
    </div>
  );

  if (!session) return <AuthPage />;

  return (
    <Routes>
      <Route path="/profile/:userId" element={<ProfilePage sessionUser={session.user} />} />
      <Route path="/" element={<Navigate to={`/profile/${session.user.id}`} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
