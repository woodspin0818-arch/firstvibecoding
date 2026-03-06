import './PostCard.css';

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : (n || 0);

const IconComment = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="18" height="18">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconRetweet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="18" height="18">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" width="18" height="18">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="18" height="18">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const renderBody = (text) =>
  (text || '').split(/(#\S+)/g).map((part, i) =>
    part.startsWith('#')
      ? <a key={i} className="hashtag" href={`/search?q=${encodeURIComponent(part)}`} onClick={(e) => e.stopPropagation()}>{part}</a>
      : part
  );

const timeAgo = (ts) => {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}天`;
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

export default function PostCard({ post, sessionUserId, onToggleLike }) {
  const author = post.profiles || post.author || {};
  const likeCount = post.likes?.length || 0;
  const liked = (post.likes || []).some(l => l.user_id === sessionUserId);

  return (
    <div className="post">
      <div className="post-avatar">{(author.display_name || author.displayName || '?')[0]}</div>
      <div className="post-content">
        <div className="post-header">
          <span className="post-name">{author.display_name || author.displayName}</span>
          <span className="post-username">@{author.username}</span>
          <span className="post-dot">·</span>
          <span className="post-time">{timeAgo(post.created_at || post.time)}</span>
        </div>
        <div className="post-body">{renderBody(post.body)}</div>
        <div className="post-actions">
          <button className="action comment"><IconComment /><span>{fmt(post.reply_count || 0)}</span></button>
          <button className="action retweet"><IconRetweet /><span>{fmt(post.retweet_count || 0)}</span></button>
          <button className={`action like ${liked ? 'active' : ''}`} onClick={() => onToggleLike?.(post.id, liked)}>
            <IconHeart filled={liked} /><span>{fmt(likeCount)}</span>
          </button>
          <button className="action share"><IconShare /></button>
        </div>
      </div>
    </div>
  );
}
