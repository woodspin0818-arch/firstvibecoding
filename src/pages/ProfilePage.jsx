import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import ComposeBox from '../components/ComposeBox';
import EditProfileModal from '../components/EditProfileModal';
import Skeleton from '../components/Skeleton';
import Toast from '../components/Toast';
import '../App.css';
import './ProfilePage.css';

const TABS = ['帖子', '回复', '点赞'];
const PAGE_SIZE = 10;
const fmtNum = (n) => n >= 10000 ? (n / 10000).toFixed(1).replace('.0', '') + '万' : (n || 0).toLocaleString();

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

export default function ProfilePage({ sessionUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const targetId = userId || sessionUser?.id;
  const isOwner = targetId === sessionUser?.id;

  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState('帖子');
  const [tabLoading, setTabLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');
  const [following, setFollowing] = useState(false);
  const [followCounts, setFollowCounts] = useState({ following: 0, followers: 0 });

  // 加载用户资料
  useEffect(() => {
    if (!targetId) return;
    setLoading(true);
    setNotFound(false);
    setProfile(null);
    setPosts([]);
    setPage(0);
    setHasMore(true);

    const load = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setProfile(data);

      // 关注数
      const [{ count: fing }, { count: fers }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', targetId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', targetId),
      ]);
      setFollowCounts({ following: fing || 0, followers: fers || 0 });

      // 是否已关注
      if (sessionUser && !isOwner) {
        const { data: f } = await supabase.from('follows')
          .select('follower_id').eq('follower_id', sessionUser.id).eq('following_id', targetId).single();
        setFollowing(!!f);
      }
      setLoading(false);
    };
    load();
  }, [targetId, sessionUser, isOwner]);

  // 加载帖子
  const loadPosts = useCallback(async (currentTab, currentPage, reset = false) => {
    if (!targetId) return;
    const from = currentPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query;
    if (currentTab === '帖子') {
      query = supabase.from('posts')
        .select('*, profiles(*), likes(user_id)')
        .eq('user_id', targetId)
        .is('reply_to_id', null)
        .order('created_at', { ascending: false })
        .range(from, to);
    } else if (currentTab === '回复') {
      query = supabase.from('posts')
        .select('*, profiles(*), likes(user_id)')
        .eq('user_id', targetId)
        .not('reply_to_id', 'is', null)
        .order('created_at', { ascending: false })
        .range(from, to);
    } else {
      query = supabase.from('likes')
        .select('post_id, posts(*, profiles(*), likes(user_id))')
        .eq('user_id', targetId)
        .order('post_id', { ascending: false })
        .range(from, to);
    }

    const { data } = await query;
    const items = currentTab === '点赞' ? (data || []).map(d => d.posts).filter(Boolean) : (data || []);
    if (reset) setPosts(items);
    else setPosts(prev => [...prev, ...items]);
    setHasMore(items.length === PAGE_SIZE);
  }, [targetId]);

  useEffect(() => {
    if (!profile) return;
    setTabLoading(true);
    setPosts([]);
    setPage(0);
    setHasMore(true);
    loadPosts(tab, 0, true).then(() => setTabLoading(false));
  }, [tab, profile, loadPosts]);

  const loadMore = async () => {
    setLoadingMore(true);
    const next = page + 1;
    setPage(next);
    await loadPosts(tab, next);
    setLoadingMore(false);
  };

  const handleFollow = async () => {
    if (!sessionUser) return;
    if (following) {
      await supabase.from('follows').delete()
        .eq('follower_id', sessionUser.id).eq('following_id', targetId);
      setFollowing(false);
      setFollowCounts(c => ({ ...c, followers: c.followers - 1 }));
      setToast('已取消关注');
    } else {
      await supabase.from('follows').insert({ follower_id: sessionUser.id, following_id: targetId });
      setFollowing(true);
      setFollowCounts(c => ({ ...c, followers: c.followers + 1 }));
      setToast('关注成功');
    }
  };

  const toggleLike = async (postId, liked) => {
    if (!sessionUser) return;
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', sessionUser.id).eq('post_id', postId);
    } else {
      await supabase.from('likes').insert({ user_id: sessionUser.id, post_id: postId });
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const likes = liked
        ? (p.likes || []).filter(l => l.user_id !== sessionUser.id)
        : [...(p.likes || []), { user_id: sessionUser.id }];
      return { ...p, likes };
    }));
  };

  const saveProfile = async (form) => {
    const { error } = await supabase.from('profiles').update(form).eq('id', sessionUser.id);
    if (error) { setToast('保存失败，请重试'); return; }
    setProfile(p => ({ ...p, ...form }));
    setEditing(false);
    setToast('资料已保存');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (notFound) return (
    <div className="page">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(-1)}><BackIcon /></button>
        <span className="topbar-title">个人主页</span>
      </div>
      <div className="empty" style={{ paddingTop: 80 }}>
        <div className="empty-icon">🔍</div>
        <div className="empty-title">找不到该用户</div>
        <div className="empty-desc">这个账号不存在或已被注销。</div>
        <button className="back-home" onClick={() => navigate('/')}>返回首页</button>
      </div>
    </div>
  );

  if (loading || !profile) return (
    <div className="page">
      <div className="cover-skeleton" />
      <div className="profile-section"><Skeleton /></div>
    </div>
  );

  return (
    <div className="page">
      {!isOwner && (
        <div className="topbar">
          <button className="topbar-back" onClick={() => navigate(-1)}><BackIcon /></button>
          <div className="topbar-info">
            <span className="topbar-title">{profile.display_name}</span>
          </div>
        </div>
      )}

      <div className="cover" style={{ background: profile.cover_color }} />

      <div className="profile-section">
        <div className="profile-top">
          <div className="avatar">{profile.display_name?.[0]}</div>
          {isOwner ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 56 }}>
              <button className="edit-btn" onClick={() => setEditing(true)}>编辑资料</button>
              <button className="edit-btn" onClick={handleSignOut}>退出</button>
            </div>
          ) : (
            <button className={`follow-btn ${following ? 'following' : ''}`} onClick={handleFollow}>
              {following ? '已关注' : '关注'}
            </button>
          )}
        </div>

        <div className="display-name">
          {profile.display_name}
          {profile.verified && <span className="verified" title="已认证">✓</span>}
        </div>
        <div className="username">@{profile.username}</div>
        {profile.bio && <div className="bio">{profile.bio}</div>}

        <div className="meta">
          {profile.location && (
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {profile.location}
            </span>
          )}
          {profile.website && (
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <a href={`https://${profile.website}`} target="_blank" rel="noreferrer">{profile.website}</a>
            </span>
          )}
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {new Date(profile.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}加入
          </span>
        </div>

        <div className="stats">
          <span className="stat"><strong>{fmtNum(followCounts.following)}</strong> 正在关注</span>
          <span className="stat"><strong>{fmtNum(followCounts.followers)}</strong> 关注者</span>
        </div>
      </div>

      {isOwner && sessionUser && (
        <ComposeBox user={profile} onPosted={() => loadPosts(tab, 0, true)} />
      )}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t && !tabLoading ? 'active' : ''}`}
            onClick={() => { if (t !== tab) { setTab(t); } }}>
            {t}
          </button>
        ))}
      </div>

      {tabLoading ? <Skeleton /> : posts.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🌱</div>
          <div className="empty-title">暂无内容</div>
          <div className="empty-desc">这里还没有任何{tab}。</div>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              sessionUserId={sessionUser?.id}
              onToggleLike={toggleLike}
            />
          ))}
          {hasMore && (
            <button className="load-more" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? '加载中…' : '加载更多'}
            </button>
          )}
          {!hasMore && posts.length >= PAGE_SIZE && (
            <div className="feed-end">— 已经到底了 —</div>
          )}
        </>
      )}

      {editing && (
        <EditProfileModal
          user={{ ...profile, displayName: profile.display_name }}
          onSave={(form) => saveProfile({ display_name: form.displayName, bio: form.bio, location: form.location, website: form.website })}
          onClose={() => setEditing(false)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
