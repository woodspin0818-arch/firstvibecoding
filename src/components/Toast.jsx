import { useState, useEffect } from 'react';

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: '#0f1419', color: '#fff',
      padding: '10px 20px', borderRadius: 20,
      fontSize: 14, fontWeight: 500,
      zIndex: 200, whiteSpace: 'nowrap',
      animation: 'toastIn 0.2s ease',
    }}>
      {message}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
