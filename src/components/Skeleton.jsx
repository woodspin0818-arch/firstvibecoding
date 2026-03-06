export default function Skeleton() {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid #eff3f4' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff3f4', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 14, width: '40%', background: '#eff3f4', borderRadius: 4, marginBottom: 8, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 14, width: '90%', background: '#eff3f4', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 14, width: '70%', background: '#eff3f4', borderRadius: 4 }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0%,100% { opacity: 1; } 50% { opacity: 0.5; }
        }
        div[style*="background: #eff3f4"] { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
