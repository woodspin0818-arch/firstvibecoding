import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setDone(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✦</div>
        <h2>验证邮箱</h2>
        <p className="auth-hint">注册成功！请查收邮件并点击验证链接后登录。</p>
        <button className="auth-btn" onClick={() => { setMode('login'); setDone(false); }}>去登录</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✦</div>
        <h2>{mode === 'login' ? '登录' : '注册'}</h2>
        <form onSubmit={submit}>
          <input
            className="auth-input"
            type="email" placeholder="邮箱"
            value={email} onChange={(e) => setEmail(e.target.value)}
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
          {mode === 'login' ? (
            <>还没有账号？<span onClick={() => { setMode('register'); setError(''); }}>注册</span></>
          ) : (
            <>已有账号？<span onClick={() => { setMode('login'); setError(''); }}>登录</span></>
          )}
        </div>
      </div>
    </div>
  );
}
