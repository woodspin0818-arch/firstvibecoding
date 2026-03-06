import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fakeEmail = (u) => `${u.toLowerCase()}@firstvibecoding.app`;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError('用户名只能包含字母、数字、下划线，3-20位');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: fakeEmail(username),
          password,
          options: { data: { username } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: fakeEmail(username),
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err.message;
      if (msg.includes('already registered')) setError('该用户名已被注册');
      else if (msg.includes('Invalid login')) setError('用户名或密码错误');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✦</div>
        <h2>{mode === 'login' ? '登录' : '注册'}</h2>
        <form onSubmit={submit}>
          <input
            className="auth-input"
            type="text" placeholder="用户名（字母/数字/下划线）"
            value={username} onChange={(e) => setUsername(e.target.value)}
            required autoFocus
          />
          <input
            className="auth-input"
            type="password" placeholder="密码（至少6位）"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? '请稍候…' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>
        <div className="auth-switch">
          {mode === 'login'
            ? <>还没有账号？<span onClick={() => { setMode('register'); setError(''); }}>注册</span></>
            : <>已有账号？<span onClick={() => { setMode('login'); setError(''); }}>登录</span></>
          }
        </div>
      </div>
    </div>
  );
}
