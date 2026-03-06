import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './ComposeBox.css';

export default function ComposeBox({ user, onPosted }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!body.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await supabase
      .from('posts')
      .insert({ body: body.trim(), user_id: user.id });
    if (error) { setError('发布失败，请重试'); }
    else { setBody(''); onPosted?.(); }
    setLoading(false);
  };

  return (
    <div className="compose">
      <div className="compose-avatar">{user.display_name?.[0] ?? '?'}</div>
      <div className="compose-right">
        <textarea
          className="compose-input"
          placeholder="有什么新鲜事？"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={280}
          rows={3}
        />
        {error && <div className="compose-error">{error}</div>}
        <div className="compose-footer">
          <span className="compose-count">{body.length}/280</span>
          <button className="compose-btn" onClick={submit} disabled={!body.trim() || loading}>
            {loading ? '发布中…' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
}
