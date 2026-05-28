'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type FeedTab = 'foryou' | 'following' | 'nearby' | 'trending';
type PostType = 'produce' | 'tip' | 'news' | 'video' | 'live' | 'question' | 'promo';

interface Story {
  id: string;
  user: string;
  avatar: string;
  hasUnread: boolean;
  isLive?: boolean;
}

interface Post {
  id: string;
  user: string;
  avatar: string;
  role: string;
  location: string;
  timeAgo: string;
  type: PostType;
  text: string;
  images?: string[];
  product?: { name: string; price: number; unit: string; qty: string };
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isLive?: boolean;
  viewers?: number;
}

// ─── Demo Data ─────────────────────────────────────────────────────────────────
const STORIES: Story[] = [
  { id: 's0', user: 'You', avatar: '👤', hasUnread: false },
  { id: 's1', user: 'Emeka Farm', avatar: '👨‍🌾', hasUnread: true, isLive: true },
  { id: 's2', user: 'Aisha Crops', avatar: '👩‍🌾', hasUnread: true },
  { id: 's3', user: 'Kaduna Hub', avatar: '🏪', hasUnread: true },
  { id: 's4', user: 'Lagos Mart', avatar: '🛒', hasUnread: false },
  { id: 's5', user: 'FarmTok', avatar: '📱', hasUnread: true, isLive: true },
  { id: 's6', user: 'AgriTech NG', avatar: '🌱', hasUnread: false },
  { id: 's7', user: 'SwiftCargo', avatar: '🚛', hasUnread: true },
];

const TRENDING_TAGS = ['#TomatoPrices', '#HarvestSeason', '#FarmTok', '#AgriNG', '#RiceMarket', '#DrySeasonFarming'];

const FEED_POSTS: Post[] = [
  {
    id: 'p1', user: 'Chidi Okafor', avatar: '👨‍🌾', role: 'Farmer · Enugu', location: 'Enugu',
    timeAgo: '2m ago', type: 'produce',
    text: '🍅 FRESH TOMATOES AVAILABLE — Harvest done today! 500 baskets ready for immediate purchase. Lagos, PH, Abuja deliveries arranged. Message me or tap BUY NOW below.',
    product: { name: 'Fresh Tomatoes', price: 8500, unit: 'basket', qty: '500 baskets' },
    tags: ['#TomatoPrices', '#FreshProduce', '#Enugu'],
    likes: 142, comments: 38, shares: 21, isLiked: true,
  },
  {
    id: 'p2', user: 'FarmLink Live 🔴', avatar: '📡', role: 'FarmLink · Nigeria',
    location: 'Lagos', timeAgo: 'LIVE', type: 'live',
    text: '🔴 LIVE: Tomato Price Watch — Daily market prices from Mile 12, Lagos. Expert commentary + Q&A with traders.',
    tags: ['#Live', '#TomatoPrices', '#Markets'],
    likes: 891, comments: 204, shares: 56, isLive: true, viewers: 1243,
  },
  {
    id: 'p3', user: 'Aisha Mohammed', avatar: '👩‍🌾', role: 'Farmer · Kano', location: 'Kano',
    timeAgo: '15m ago', type: 'tip',
    text: '🌾 Dry Season Farming Tip: If you\'re growing onions in the north right now, make sure your irrigation schedule is 3× daily in this heat. I lost 20% last year from under-watering. Don\'t make the same mistake! \n\nWho else is managing irrigation this season? Drop your tips below 👇',
    tags: ['#DrySeasonFarming', '#OnionFarming', '#KanoFarmers'],
    likes: 487, comments: 91, shares: 63,
  },
  {
    id: 'p4', user: 'AgriNews Nigeria', avatar: '📰', role: 'Media · Abuja', location: 'Abuja',
    timeAgo: '1h ago', type: 'news',
    text: '📊 BREAKING: Federal Government announces ₦50bn agriculture support fund for small-scale farmers. Applications open next month. Read the full breakdown below 👇\n\n✅ Up to ₦2M per farmer\n✅ 0% interest, 5-year term\n✅ No collateral needed for certified users',
    tags: ['#AgriPolicy', '#FarmersGrant', '#Nigeria'],
    likes: 2341, comments: 389, shares: 871,
  },
  {
    id: 'p5', user: 'Tunde Balogun', avatar: '🧑‍💼', role: 'Agro-dealer · Ibadan', location: 'Ibadan',
    timeAgo: '3h ago', type: 'promo',
    text: '⚡ FLASH SALE — Fertilizer Blowout! NPK 15-15-15 just dropped to ₦18,000 per 50kg bag (was ₦24,000). Limited stock. First 100 orders get free delivery to farm gate anywhere in Oyo State.',
    product: { name: 'NPK Fertilizer 15-15-15', price: 18000, unit: '50kg bag', qty: 'Limited stock' },
    tags: ['#Fertilizer', '#AgroInputs', '#FlashSale'],
    likes: 334, comments: 57, shares: 128,
  },
  {
    id: 'p6', user: 'Ngozi Eze', avatar: '👩‍💻', role: 'Buyer · Port Harcourt', location: 'Port Harcourt',
    timeAgo: '5h ago', type: 'question',
    text: '❓ Question for the farmers here: What\'s the current farm-gate price for cassava in Edo/Delta states? I need about 5 tonnes for my processing unit. Please DM me or comment below!\n\n@Farmers #CassavaPrices',
    tags: ['#CassavaPrices', '#Cassava', '#BuyingNow'],
    likes: 78, comments: 43, shares: 9,
  },
];

const POST_TYPE_LABELS: Record<PostType, { icon: string; color: string }> = {
  produce: { icon: '🌾', color: 'bg-green-100 text-green-700' },
  tip: { icon: '💡', color: 'bg-yellow-100 text-yellow-700' },
  news: { icon: '📰', color: 'bg-blue-100 text-blue-700' },
  video: { icon: '🎬', color: 'bg-purple-100 text-purple-700' },
  live: { icon: '🔴', color: 'bg-red-100 text-red-700' },
  question: { icon: '❓', color: 'bg-orange-100 text-orange-700' },
  promo: { icon: '⚡', color: 'bg-pink-100 text-pink-700' },
};

// ─── Components ───────────────────────────────────────────────────────────────
function StoriesBar() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {STORIES.map((s, i) => (
        <button key={s.id} className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="relative">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-3 ${s.hasUnread ? 'border-brand-500' : 'border-gray-200'} bg-white shadow-sm`}
              style={{ borderWidth: s.hasUnread ? 3 : 2 }}>
              {s.avatar}
            </div>
            {s.isLive && (
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ fontSize: 9 }}>
                LIVE
              </div>
            )}
            {i === 0 && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">+</div>
            )}
          </div>
          <span className="text-xs text-gray-600 max-w-[52px] truncate">{s.user}</span>
        </button>
      ))}
    </div>
  );
}

function PostCard({ post, onLike, onSave }: { post: Post; onLike: (id: string) => void; onSave: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const typeInfo = POST_TYPE_LABELS[post.type];

  const text = expanded ? post.text : post.text.slice(0, 160);
  const needsExpand = post.text.length > 160;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Post header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">
            {post.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-sm text-gray-900">{post.user}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
                {typeInfo.icon} {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </span>
            </div>
            <p className="text-xs text-gray-400">{post.role} · {post.timeAgo}</p>
          </div>
          <div className="flex items-center gap-2">
            {post.isLive && (
              <span className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                🔴 {post.viewers?.toLocaleString()} watching
              </span>
            )}
            <button className="text-gray-400 hover:text-gray-600 text-lg">⋯</button>
          </div>
        </div>
      </div>

      {/* Post text */}
      <div className="px-4 pt-3">
        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {text}{needsExpand && !expanded ? '...' : ''}
        </p>
        {needsExpand && (
          <button onClick={() => setExpanded(!expanded)} className="text-brand-600 text-xs font-semibold mt-1">
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Live stream placeholder */}
      {post.isLive && (
        <div className="mx-4 mt-3 bg-gradient-to-br from-red-900 to-gray-900 rounded-2xl h-40 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-red-500" style={{ width: `${20 + i * 8}%`, height: `${20 + i * 8}%`, left: `${40 - i * 4}%`, top: `${40 - i * 4}%`, opacity: 0.05 * i }} />
            ))}
          </div>
          <p className="text-white text-4xl mb-2">📡</p>
          <p className="text-white font-bold">Watch Live</p>
          <p className="text-red-200 text-xs">{post.viewers?.toLocaleString()} viewers</p>
          <Link href="/farmtok" className="mt-3 bg-red-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold hover:bg-red-700 transition">
            Join Stream →
          </Link>
        </div>
      )}

      {/* Product card */}
      {post.product && (
        <div className="mx-4 mt-3 bg-brand-50 rounded-2xl p-3 flex items-center justify-between gap-3 border border-brand-100">
          <div>
            <p className="text-sm font-bold text-gray-900">{post.product.name}</p>
            <p className="text-xs text-gray-500">{post.product.qty}</p>
          </div>
          <div className="text-right">
            <p className="text-brand-700 font-bold">₦{post.product.price.toLocaleString()}</p>
            <p className="text-xs text-gray-400">per {post.product.unit}</p>
          </div>
          <Link href="/marketplace" className="bg-brand-600 text-white text-xs px-3 py-2 rounded-xl font-semibold hover:bg-brand-700 transition flex-shrink-0">
            Buy →
          </Link>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-4 mt-3 flex flex-wrap gap-1">
          {post.tags.map(t => (
            <span key={t} className="text-xs text-brand-600 hover:underline cursor-pointer">{t}</span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="px-4 pt-3 pb-3 flex items-center gap-1">
        <button onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition flex-1 justify-center ${post.isLiked ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-500'}`}>
          {post.isLiked ? '❤️' : '🤍'} {post.likes + (post.isLiked ? 0 : 0)}
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition flex-1 justify-center">
          💬 {post.comments}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition flex-1 justify-center">
          🔗 {post.shares}
        </button>
        <button onClick={() => onSave(post.id)}
          className={`p-2 rounded-xl transition ${post.isSaved ? 'text-brand-600 bg-brand-50' : 'text-gray-400 hover:bg-gray-50'}`}>
          {post.isSaved ? '🔖' : '📌'}
        </button>
      </div>

      {/* Comment input */}
      {showComments && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-50">
          <div className="flex gap-2 mt-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">👤</div>
            <div className="flex-1 flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              <button disabled={!commentText.trim()}
                className="bg-brand-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-40">
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Create Post Modal ─────────────────────────────────────────────────────────
function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [postType, setPostType] = useState<PostType | ''>('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const types: { key: PostType; icon: string; label: string; desc: string }[] = [
    { key: 'produce', icon: '🌾', label: 'Sell Produce', desc: 'List farm products for sale' },
    { key: 'promo', icon: '⚡', label: 'Promotion', desc: 'Flash sale or offer' },
    { key: 'tip', icon: '💡', label: 'Farming Tip', desc: 'Share knowledge with others' },
    { key: 'question', icon: '❓', label: 'Ask Community', desc: 'Get answers from farmers' },
    { key: 'news', icon: '📰', label: 'News / Update', desc: 'Share agri news & updates' },
    { key: 'video', icon: '🎬', label: 'Share Video', desc: 'Upload a farm video' },
  ];

  const handlePost = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          {step > 1 && !done ? (
            <button onClick={() => setStep(s => s - 1)} className="text-gray-500 hover:text-gray-700">← Back</button>
          ) : <div />}
          <h3 className="font-bold text-gray-900">{done ? 'Posted!' : step === 1 ? 'Create Post' : 'Write Your Post'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        {done ? (
          <div className="text-center py-12 px-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Post Published!</h3>
            <p className="text-gray-500 text-sm mb-6">Your post is now live in the feed.</p>
            <button onClick={onClose} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-700 transition">
              View Feed
            </button>
          </div>
        ) : step === 1 ? (
          <div className="p-5">
            <p className="text-sm text-gray-500 mb-4">What are you posting today?</p>
            <div className="grid grid-cols-2 gap-3">
              {types.map(t => (
                <button key={t.key} onClick={() => { setPostType(t.key); setStep(2); }}
                  className="flex flex-col items-start gap-2 p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition text-left">
                  <span className="text-3xl">{t.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-xl">👤</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Your Name</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>{types.find(t => t.key === postType)?.icon}</span>
                  <span>{types.find(t => t.key === postType)?.label}</span>
                </div>
              </div>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder={
                postType === 'produce' ? "Describe your produce — what's available, quantity, and how to order..."
                : postType === 'tip' ? "Share your farming tip or technique..."
                : postType === 'question' ? "Ask the FarmLink community..."
                : "What's on your mind?"
              }
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-300" />
            {(postType === 'produce' || postType === 'promo') && (
              <div className="bg-brand-50 rounded-xl p-3 text-xs text-brand-700 font-medium">
                💡 Tip: Include your price, quantity, and delivery options for more inquiries.
              </div>
            )}
            {/* Photo upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-brand-300 transition cursor-pointer">
              <p className="text-2xl mb-1">📷</p>
              <p className="text-sm text-gray-500">Add photos (optional)</p>
              <p className="text-xs text-gray-400">Up to 4 photos</p>
            </div>
            {/* Tags */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tags (optional)</label>
              <input placeholder="#TomatoPrices, #Ibadan, #FreshProduce"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <button onClick={handlePost} disabled={!text.trim() || submitting}
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-40">
              {submitting ? 'Posting...' : '🚀 Publish Post'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('foryou');
  const [posts, setPosts] = useState(FEED_POSTS);
  const [showCreate, setShowCreate] = useState(false);

  const handleLike = (id: string) => {
    setPosts(ps => ps.map(p => p.id === id ? {
      ...p,
      isLiked: !p.isLiked,
      likes: p.isLiked ? p.likes - 1 : p.likes + 1
    } : p));
  };

  const handleSave = (id: string) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'foryou', label: 'For You' },
    { key: 'following', label: 'Following' },
    { key: 'nearby', label: 'Nearby' },
    { key: 'trending', label: 'Trending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-28">
        {/* Header */}
        <div className="pt-4 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Farm Feed</h1>
            <p className="text-xs text-gray-400">What&apos;s happening in agriculture today</p>
          </div>
          <Link href="/farmtok"
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:opacity-90 transition">
            🎬 FarmTok
          </Link>
        </div>

        {/* Stories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4">
          <StoriesBar />
        </div>

        {/* Create post prompt */}
        <button onClick={() => setShowCreate(true)}
          className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3 mb-4 hover:border-brand-200 transition text-left">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">👤</div>
          <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-400">
            What&apos;s happening in your farm today?
          </div>
          <span className="text-brand-600 text-xl">📷</span>
        </button>

        {/* Feed tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Trending tags (shown on trending tab) */}
        {tab === 'trending' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <p className="text-sm font-bold text-gray-800 mb-3">🔥 Trending Now</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map(tag => (
                <button key={tag} className="bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-100 transition">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
          ))}
        </div>

        {/* Load more */}
        <button className="w-full mt-6 bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition text-sm">
          Load more posts
        </button>
      </main>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}

      {/* FAB */}
      <button onClick={() => setShowCreate(true)}
        className="fixed bottom-20 right-5 w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-brand-700 transition z-30">
        ✏️
      </button>

      <Footer />
    </div>
  );
}
