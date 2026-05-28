'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

type CommunityTab = 'groups' | 'discussions' | 'events' | 'connections';

interface Group {
  id: string;
  name: string;
  icon: string;
  members: number;
  posts: number;
  category: string;
  joined?: boolean;
  recent: string;
}

interface Discussion {
  id: string;
  user: string;
  avatar: string;
  title: string;
  body: string;
  replies: number;
  likes: number;
  timeAgo: string;
  tags: string[];
  isLiked?: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'webinar' | 'market' | 'training' | 'meetup';
  attendees: number;
  registered?: boolean;
  emoji: string;
}

const GROUPS: Group[] = [
  { id: 'g1', name: 'Nigerian Tomato Farmers', icon: '🍅', members: 8420, posts: 342, category: 'Crops', joined: true, recent: 'Prices up 15% in Lagos this week' },
  { id: 'g2', name: 'Grains & Cereals Network', icon: '🌾', members: 12031, posts: 891, category: 'Crops', recent: 'New government subsidy for rice' },
  { id: 'g3', name: 'Agro-Input Traders', icon: '🧪', members: 4230, posts: 214, category: 'Business', joined: true, recent: 'Fertilizer prices stabilizing' },
  { id: 'g4', name: 'West Africa Exporters', icon: '🌍', members: 3891, posts: 543, category: 'Export', recent: 'New ECOWAS trade corridor open' },
  { id: 'g5', name: 'Young Farmers Nigeria', icon: '👨‍🌾', members: 15234, posts: 1241, category: 'Community', recent: 'Agri-Youth Summit 2026 announced' },
  { id: 'g6', name: 'Smart Irrigation Club', icon: '💧', members: 2108, posts: 167, category: 'Technology', recent: 'Solar drip vs drip comparison' },
  { id: 'g7', name: 'Livestock & Poultry', icon: '🐓', members: 9320, posts: 671, category: 'Livestock', recent: 'Bird flu prevention best practices' },
  { id: 'g8', name: 'Organic Farmers Alliance', icon: '🌱', members: 6770, posts: 412, category: 'Organic', recent: 'International organic certification' },
];

const DISCUSSIONS: Discussion[] = [
  {
    id: 'd1', user: 'Chidi Okafor', avatar: '👨‍🌾', timeAgo: '20m ago',
    title: 'What\'s the best way to store tomatoes without refrigeration?',
    body: 'I have 100 baskets that need to last 5 days before delivery. The weather is very hot right now and I\'m losing produce. Any natural storage methods that work?',
    tags: ['#TomatoStorage', '#PostHarvest'], replies: 24, likes: 47, isLiked: true,
  },
  {
    id: 'd2', user: 'Aisha Grains', avatar: '👩‍🌾', timeAgo: '2h ago',
    title: 'Is FarmLink logistics cheaper than direct trucking?',
    body: 'I\'ve been using my own truck for 2 years but it\'s getting expensive. Has anyone compared FarmLink logistics rates vs hiring a driver directly?',
    tags: ['#Logistics', '#CostComparison'], replies: 18, likes: 33,
  },
  {
    id: 'd3', user: 'Felix Agro', avatar: '🧑‍💼', timeAgo: '5h ago',
    title: 'Government ₦50bn agriculture fund — who has applied?',
    body: 'The FGN announced the new agricultural support fund. The form is supposedly online from next week. Has anyone been through the pre-registration process?',
    tags: ['#GovernmentFund', '#Policy'], replies: 89, likes: 214,
  },
  {
    id: 'd4', user: 'Ngozi Farms', avatar: '👩‍🌾', timeAgo: '1d ago',
    title: 'Best cassava varieties for Edo State climate?',
    body: 'Starting a new 5-acre cassava plot. The land has heavy clay soil and gets about 1500mm rainfall per year. Which TME series varieties do well in this?',
    tags: ['#Cassava', '#EdoState', '#Varieties'], replies: 31, likes: 58,
  },
];

const EVENTS: Event[] = [
  { id: 'e1', title: 'Agri-Finance Webinar: Access Loans Without Collateral', date: 'Jun 5, 2026', time: '2:00 PM WAT', location: 'Zoom (Online)', type: 'webinar', attendees: 1240, registered: true, emoji: '💰' },
  { id: 'e2', title: 'FarmLink Seller Summit — Lagos', date: 'Jun 12, 2026', time: '10:00 AM', location: 'Eko Hotel, Lagos', type: 'meetup', attendees: 450, emoji: '🏆' },
  { id: 'e3', title: 'Farm-to-Market Training: Digital Sales for Farmers', date: 'Jun 18, 2026', time: '9:00 AM', location: 'Online (YouTube Live)', type: 'training', attendees: 876, emoji: '📱' },
  { id: 'e4', title: 'Abuja Agri Market Day', date: 'Jun 22, 2026', time: '7:00 AM', location: 'Garki Market, Abuja', type: 'market', attendees: 2341, emoji: '🌾' },
  { id: 'e5', title: 'Irrigation & Smart Farming Workshop', date: 'Jul 3, 2026', time: '10:00 AM', location: 'Ibadan, Oyo State', type: 'training', attendees: 189, emoji: '💧' },
];

const EVENT_TYPE_COLOR = {
  webinar: 'bg-purple-100 text-purple-700',
  market: 'bg-green-100 text-green-700',
  training: 'bg-blue-100 text-blue-700',
  meetup: 'bg-orange-100 text-orange-700',
};

export default function CommunityPage() {
  const [tab, setTab] = useState<CommunityTab>('groups');
  const [groups, setGroups] = useState(GROUPS);
  const [discussions, setDiscussions] = useState(DISCUSSIONS);
  const [events, setEvents] = useState(EVENTS);
  const [search, setSearch] = useState('');

  const toggleJoin = (id: string) => setGroups(gs => gs.map(g => g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g));
  const toggleLike = (id: string) => setDiscussions(ds => ds.map(d => d.id === id ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 } : d));
  const toggleRegister = (id: string) => setEvents(es => es.map(e => e.id === id ? { ...e, registered: !e.registered, attendees: e.registered ? e.attendees - 1 : e.attendees + 1 } : e));

  const filteredGroups = groups.filter(g => !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()));

  const tabs: { key: CommunityTab; icon: string; label: string }[] = [
    { key: 'groups', icon: '👥', label: 'Groups' },
    { key: 'discussions', icon: '💬', label: 'Discuss' },
    { key: 'events', icon: '📅', label: 'Events' },
    { key: 'connections', icon: '🤝', label: 'Connect' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-24">
        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <p className="text-sm text-gray-500 mt-0.5">Connect with farmers, traders & agri experts across Africa</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: '👥', val: '50K+', label: 'Members' },
            { icon: '🌍', val: '14', label: 'Countries' },
            { icon: '💬', val: '2,400', label: 'Daily posts' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
              <p className="text-2xl">{s.icon}</p>
              <p className="text-base font-bold text-gray-900">{s.val}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition ${tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              <span className="hidden sm:block">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Groups */}
        {tab === 'groups' && (
          <div className="space-y-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search groups..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            {filteredGroups.map(g => (
              <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{g.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">{g.name}</p>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{g.category}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                      <span>👥 {g.members.toLocaleString()} members</span>
                      <span>·</span>
                      <span>💬 {g.posts} posts/day</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 italic truncate">&ldquo;{g.recent}&rdquo;</p>
                  </div>
                  <button onClick={() => toggleJoin(g.id)}
                    className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition ${g.joined ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                    {g.joined ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discussions */}
        {tab === 'discussions' && (
          <div className="space-y-4">
            <button className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
              + Start a Discussion
            </button>
            {discussions.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-lg">{d.avatar}</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{d.user}</p>
                    <p className="text-xs text-gray-400">{d.timeAgo}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1.5">{d.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{d.body}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {d.tags.map(t => <span key={t} className="text-xs text-brand-600">{t}</span>)}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button onClick={() => toggleLike(d.id)}
                    className={`flex items-center gap-1 font-semibold ${d.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>
                    {d.isLiked ? '❤️' : '🤍'} {d.likes}
                  </button>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 font-semibold">
                    💬 {d.replies} replies
                  </button>
                  <button className="ml-auto text-brand-600 text-xs font-semibold hover:underline">
                    View Thread →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events */}
        {tab === 'events' && (
          <div className="space-y-4">
            {events.map(e => (
              <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{e.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${EVENT_TYPE_COLOR[e.type]}`}>
                      {e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-1.5 leading-snug">{e.title}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      <span>📅 {e.date}</span>
                      <span>🕐 {e.time}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-0.5">
                      <span>📍 {e.location}</span>
                      <span>·</span>
                      <span>👥 {e.attendees.toLocaleString()} attending</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => toggleRegister(e.id)}
                  className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition ${e.registered ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                  {e.registered ? '✓ Registered' : 'Register Free'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Connections */}
        {tab === 'connections' && (
          <div className="space-y-4">
            <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
              <p className="text-sm font-bold text-brand-800 mb-1">🌍 Find People Near You</p>
              <p className="text-xs text-brand-600">Connect with farmers, buyers, and agri-professionals in your area</p>
              <button className="mt-3 bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand-700 transition">
                Enable Location
              </button>
            </div>
            {[
              { name: 'Emeka Okafor', role: 'Tomato Farmer', loc: 'Enugu', avatar: '👨‍🌾', mutual: 5 },
              { name: 'Aisha Mohammed', role: 'Onion Trader', loc: 'Kano', avatar: '👩‍🌾', mutual: 3 },
              { name: 'Tunde Balogun', role: 'Agro-dealer', loc: 'Ibadan', avatar: '🧑‍💼', mutual: 8 },
              { name: 'Dr. Bello', role: 'Agronomist', loc: 'Abuja', avatar: '👨‍💼', mutual: 12 },
              { name: 'Ngozi Eze', role: 'Bulk Buyer', loc: 'Port Harcourt', avatar: '👩‍💻', mutual: 2 },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">{p.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.role} · {p.loc}</p>
                  <p className="text-xs text-gray-400">{p.mutual} mutual connections</p>
                </div>
                <button className="flex-shrink-0 text-xs bg-brand-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-brand-700 transition">
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
