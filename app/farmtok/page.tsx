'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

type FarmTokTab = 'foryou' | 'live' | 'trending';

interface Video {
  id: string;
  user: string;
  avatar: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  duration: string;
  product?: { name: string; price: number };
  thumbnail: string; // emoji representing the "thumbnail"
  isLive?: boolean;
  viewers?: number;
}

interface LiveStream {
  id: string;
  user: string;
  avatar: string;
  title: string;
  tags: string[];
  viewers: number;
  thumbnail: string;
  isFollowing?: boolean;
}

const VIDEOS: Video[] = [
  {
    id: 'v1', user: 'Emeka Farms', avatar: '👨‍🌾', duration: '0:42',
    thumbnail: '🍅',
    caption: '🍅 Watch me harvest 500 baskets in one morning! This is the 3rd season using FarmLink to sell — no middlemen, no wahala 🙌 #FarmLife #TomatoFarmer',
    tags: ['#TomatoFarmer', '#FarmLife', '#NoMiddlemen'],
    likes: 8421, comments: 342, shares: 891, isLiked: true,
    product: { name: 'Fresh Tomatoes', price: 8500 },
  },
  {
    id: 'v2', user: 'AgroTech TV', avatar: '📹', duration: '2:15',
    thumbnail: '🌿',
    caption: '🌿 How I doubled my yield using drip irrigation — step by step tutorial. This one trick saves 60% water and increases output by 40%. SAVE THIS VIDEO!',
    tags: ['#DripIrrigation', '#FarmingTips', '#AgriTech'],
    likes: 12043, comments: 891, shares: 2341,
  },
  {
    id: 'v3', user: 'Zainab Grains', avatar: '👩‍🌾', duration: '1:08',
    thumbnail: '🌾',
    caption: '🌾 Sorting 2 tonnes of millet for packaging — ASMR edition 😌 Come see the process before it reaches your table. Support your local farmer!',
    tags: ['#Millet', '#LocalFarmer', '#AgriASMR'],
    likes: 5234, comments: 214, shares: 432,
    product: { name: 'Whole Millet', price: 3200 },
  },
  {
    id: 'v4', user: 'North Farm Hub', avatar: '🧑‍🌾', duration: '0:55',
    thumbnail: '🧅',
    caption: '🧅 Kano onion season is HERE. Come to the farm and see quality before you buy. Bulk orders accepted, direct delivery to any state. DM me!',
    tags: ['#OnionSeason', '#KanoFarm', '#BulkOrder'],
    likes: 3891, comments: 156, shares: 234,
    product: { name: 'Red Onions', price: 45000 },
    isLive: false,
  },
];

const LIVE_STREAMS: LiveStream[] = [
  {
    id: 'l1', user: 'FarmLink HQ', avatar: '📡', title: 'Daily Price Watch — Lagos Markets LIVE',
    tags: ['#Prices', '#Lagos'], viewers: 2341, thumbnail: '📊',
  },
  {
    id: 'l2', user: 'Emeka Farms', avatar: '👨‍🌾', title: '🍅 Live Tomato Harvest — Buy Direct!',
    tags: ['#Tomato', '#Harvest'], viewers: 891, thumbnail: '🍅', isFollowing: true,
  },
  {
    id: 'l3', user: 'AgriExpert Dr. Bello', avatar: '👨‍💼', title: 'Ask Me Anything: Dry Season Crops Q&A',
    tags: ['#AMA', '#DrySeasonFarming'], viewers: 543, thumbnail: '🌾',
  },
  {
    id: 'l4', user: 'North Farm Hub', avatar: '🧑‍🌾', title: 'Onion Grading & Packaging Process',
    tags: ['#Onion', '#Kano'], viewers: 328, thumbnail: '🧅',
  },
];

function VideoCard({ video, onLike }: { video: Video; onLike: (id: string) => void }) {
  const [showProduct, setShowProduct] = useState(false);
  const colors = ['from-green-800 to-emerald-600', 'from-yellow-800 to-amber-600', 'from-teal-800 to-green-700', 'from-orange-800 to-yellow-700'];
  const idx = parseInt(video.id.replace(/\D/g, '')) - 1;
  const bg = colors[idx % colors.length];

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Video thumbnail */}
      <div className={`relative bg-gradient-to-br ${bg} h-52 flex items-center justify-center overflow-hidden`}>
        <span className="text-8xl opacity-60">{video.thumbnail}</span>
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
          {video.duration}
        </div>
        {/* Play button */}
        <button className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
            <span className="text-white text-2xl ml-1">▶</span>
          </div>
        </button>
        {/* Product badge */}
        {video.product && (
          <button onClick={() => setShowProduct(!showProduct)}
            className="absolute bottom-2 left-2 bg-brand-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            🛒 Buy
          </button>
        )}
      </div>

      {/* Product popup */}
      {showProduct && video.product && (
        <div className="absolute top-28 left-3 right-3 bg-white rounded-2xl shadow-lg p-3 z-10 border border-brand-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-900">{video.product.name}</p>
            <button onClick={() => setShowProduct(false)} className="text-gray-400 text-lg">×</button>
          </div>
          <p className="text-brand-700 font-bold mb-2">₦{video.product.price.toLocaleString()}</p>
          <Link href="/marketplace" className="block w-full bg-brand-600 text-white text-center text-sm py-2 rounded-xl font-semibold hover:bg-brand-700 transition">
            View in Marketplace →
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">{video.avatar}</div>
          <p className="text-sm font-bold text-gray-900">{video.user}</p>
          <button className="ml-auto text-xs border border-brand-500 text-brand-600 px-2 py-0.5 rounded-full font-semibold hover:bg-brand-50 transition">
            Follow
          </button>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed mb-2 line-clamp-2">{video.caption}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags.map(t => <span key={t} className="text-xs text-brand-600">{t}</span>)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onLike(video.id)}
            className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl font-semibold transition ${video.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
            {video.isLiked ? '❤️' : '🤍'} {(video.likes).toLocaleString()}
          </button>
          <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition font-semibold">
            💬 {video.comments.toLocaleString()}
          </button>
          <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition font-semibold ml-auto">
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveCard({ stream }: { stream: LiveStream }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(t); }, []);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 h-40 flex items-center justify-center">
        <span className="text-7xl opacity-50">{stream.thumbnail}</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <span className="text-white text-xl ml-0.5">▶</span>
          </button>
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
          <div className={`w-1.5 h-1.5 rounded-full bg-white ${pulse ? 'opacity-100' : 'opacity-40'}`} />
          LIVE
        </div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          👁️ {stream.viewers.toLocaleString()}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-sm">{stream.avatar}</div>
          <p className="text-xs font-bold text-gray-700">{stream.user}</p>
          {stream.isFollowing && <span className="text-xs text-brand-600 font-medium">Following</span>}
        </div>
        <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{stream.title}</p>
        <button className="w-full bg-red-600 text-white text-xs py-2 rounded-xl font-bold hover:bg-red-700 transition">
          🔴 Join Live
        </button>
      </div>
    </div>
  );
}

// ─── Go Live Modal ─────────────────────────────────────────────────────────────
function GoLiveModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 5)), 3000);
    return () => clearInterval(t);
  }, [live]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{live ? '🔴 You are LIVE' : 'Go Live'}</h3>
          {!live && <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>}
        </div>
        {!live ? (
          <div className="p-5 space-y-4">
            {/* Camera preview sim */}
            <div className="bg-gray-900 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden">
              {ready ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-gray-800 opacity-80" />
                  <span className="text-6xl relative z-10">🤳</span>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Camera On
                  </div>
                </>
              ) : (
                <button onClick={() => setReady(true)} className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition">
                  <span className="text-4xl">📷</span>
                  <span className="text-sm">Tap to enable camera</span>
                </button>
              )}
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Stream title (e.g. 'Tomato Harvest LIVE!')"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            <button onClick={() => setLive(true)} disabled={!title.trim()}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-40">
              🔴 Go Live Now
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Live view */}
            <div className="bg-gray-900 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-gray-800 opacity-80" />
              <span className="text-6xl relative z-10 animate-pulse">🤳</span>
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                🔴 LIVE
              </div>
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                👁️ {viewers} watching
              </div>
              <div className="absolute bottom-2 left-3 text-xs text-white/80">{title}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 h-24 overflow-y-auto space-y-1">
              <p className="text-xs text-gray-400">💬 Live comments appear here...</p>
              <p className="text-xs text-gray-700"><span className="font-bold">Aisha:</span> Looking good! Where are you located?</p>
              <p className="text-xs text-gray-700"><span className="font-bold">Buyer2025:</span> Price please!</p>
            </div>
            <button onClick={onClose} className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-bold text-sm hover:bg-red-200 transition">
              End Stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FarmTokPage() {
  const [tab, setTab] = useState<FarmTokTab>('foryou');
  const [videos, setVideos] = useState(VIDEOS);
  const [goLive, setGoLive] = useState(false);

  const handleLike = (id: string) => {
    setVideos(vs => vs.map(v => v.id === id ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes - 1 : v.likes + 1 } : v));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-24">
        {/* Header */}
        <div className="pt-4 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🎬 FarmTok</h1>
            <p className="text-xs text-gray-400">Short videos, live streams &amp; social commerce</p>
          </div>
          <button onClick={() => setGoLive(true)}
            className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-red-700 transition">
            🔴 Go Live
          </button>
        </div>

        {/* Upload CTA */}
        <div className="bg-gradient-to-r from-brand-600 to-emerald-600 rounded-2xl p-4 mb-4 flex items-center gap-4">
          <div className="text-4xl">🎬</div>
          <div className="flex-1">
            <p className="text-white font-bold">Share your farm story</p>
            <p className="text-green-100 text-xs">Upload a video and reach 50,000+ buyers</p>
          </div>
          <button className="bg-white text-brand-700 text-xs font-bold px-3 py-2 rounded-xl hover:bg-green-50 transition flex-shrink-0">
            Upload ↑
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-4">
          {(['foryou', 'live', 'trending'] as FarmTokTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition capitalize ${tab === t ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              {t === 'live' ? '🔴 Live' : t === 'trending' ? '🔥 Trending' : 'For You'}
            </button>
          ))}
        </div>

        {/* Live streams */}
        {tab === 'live' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-700">🔴 Live Now — {LIVE_STREAMS.length} streams</p>
            <div className="grid grid-cols-2 gap-3">
              {LIVE_STREAMS.map(s => <LiveCard key={s.id} stream={s} />)}
            </div>
          </div>
        )}

        {/* Videos */}
        {(tab === 'foryou' || tab === 'trending') && (
          <div className="space-y-4">
            {tab === 'trending' && (
              <div className="bg-orange-50 rounded-2xl p-3 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-bold text-orange-800">Trending this week</p>
                  <p className="text-xs text-orange-600">#TomatoPrices · #HarvestSeason · #FarmTips</p>
                </div>
              </div>
            )}
            {videos.map(v => <VideoCard key={v.id} video={v} onLike={handleLike} />)}
          </div>
        )}
      </main>

      {goLive && <GoLiveModal onClose={() => setGoLive(false)} />}
    </div>
  );
}
