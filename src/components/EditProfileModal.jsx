import { useState } from 'react';
import './EditProfileModal.css';

export default function EditProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    displayName: user.displayName,
    bio: user.bio,
    location: user.location,
    website: user.website,
  });
  const [error, setError] = useState('');

  const set = (k) => (e) => {
    setError('');
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleSave = () => {
    if (!form.displayName.trim()) {
      setError('名称不能为空');
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <span className="modal-title">编辑个人资料</span>
          <button className="modal-save" onClick={handleSave}>保存</button>
        </div>
        <div className="modal-cover" style={{ background: user.coverColor }} />
        <div className="modal-avatar-row">
          <div className="modal-avatar">{user.displayName[0]}</div>
        </div>
        <div className="modal-fields">
          <label className={`field ${error ? 'field-error' : ''}`}>
            <span>名称</span>
            <input value={form.displayName} onChange={set('displayName')} maxLength={50} />
            {error && <span className="field-error-msg">{error}</span>}
          </label>
          <label className="field">
            <span>简介</span>
            <textarea value={form.bio} onChange={set('bio')} maxLength={160} rows={3} />
          </label>
          <label className="field">
            <span>位置</span>
            <input value={form.location} onChange={set('location')} maxLength={30} />
          </label>
          <label className="field">
            <span>网站</span>
            <input value={form.website} onChange={set('website')} maxLength={100} />
          </label>
        </div>
      </div>
    </div>
  );
}
