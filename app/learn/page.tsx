'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

type LearnTab = 'courses' | 'videos' | 'articles' | 'askexpert';

interface Course {
  id: string;
  title: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  enrolled: number;
  rating: number;
  category: string;
  emoji: string;
  free: boolean;
  progress?: number;
}

interface VideoLesson {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  views: number;
  thumbnail: string;
  category: string;
}

interface Article {
  id: string;
  title: string;
  author: string;
  readTime: string;
  category: string;
  excerpt: string;
  emoji: string;
  date: string;
}

const COURSES: Course[] = [
  { id: 'c1', title: 'Smart Farming for Beginners', instructor: 'Dr. Amina Yusuf', level: 'Beginner', duration: '4h 30m', lessons: 18, enrolled: 4231, rating: 4.8, category: 'Tech', emoji: '🌱', free: true, progress: 35 },
  { id: 'c2', title: 'Tomato Farming: Farm-to-Market', instructor: 'Emeka Chukwu', level: 'Intermediate', duration: '6h 15m', lessons: 24, enrolled: 2891, rating: 4.9, category: 'Crops', emoji: '🍅', free: true },
  { id: 'c3', title: 'Drip Irrigation & Water Management', instructor: 'Eng. Tunde Balogun', level: 'Intermediate', duration: '3h 45m', lessons: 14, enrolled: 1540, rating: 4.7, category: 'Irrigation', emoji: '💧', free: false },
  { id: 'c4', title: 'Digital Marketing for Farmers', instructor: 'Ngozi Eze', level: 'Beginner', duration: '5h', lessons: 20, enrolled: 3102, rating: 4.6, category: 'Business', emoji: '📱', free: true },
  { id: 'c5', title: 'Soil Health & Fertilization Mastery', instructor: 'Dr. Adaeze Obi', level: 'Advanced', duration: '8h', lessons: 32, enrolled: 967, rating: 4.8, category: 'Agronomy', emoji: '🌍', free: false },
  { id: 'c6', title: 'Poultry Farming for Profit', instructor: 'Ibrahim Kano', level: 'Beginner', duration: '5h 30m', lessons: 22, enrolled: 2341, rating: 4.7, category: 'Livestock', emoji: '🐓', free: true },
  { id: 'c7', title: 'Accessing Agricultural Finance', instructor: 'Fatima Aliyu', level: 'Beginner', duration: '2h', lessons: 8, enrolled: 5421, rating: 4.9, category: 'Finance', emoji: '💰', free: true },
  { id: 'c8', title: 'Organic Farming Certification', instructor: 'Dr. Chukwudi Nweze', level: 'Advanced', duration: '10h', lessons: 40, enrolled: 782, rating: 4.6, category: 'Organic', emoji: '🌿', free: false },
];

const VIDEOS: VideoLesson[] = [
  { id: 'v1', title: 'How to Identify Common Tomato Diseases', instructor: 'Dr. Amina', duration: '12:34', views: 45213, thumbnail: '🍅', category: 'Plant Health' },
  { id: 'v2', title: 'Building a Low-Cost Drip Irrigation System', instructor: 'Eng. Balogun', duration: '18:22', views: 23891, thumbnail: '💧', category: 'Irrigation' },
  { id: 'v3', title: 'How to Negotiate Better Prices at Market', instructor: 'Ngozi Eze', duration: '8:45', views: 31240, thumbnail: '🤝', category: 'Business' },
  { id: 'v4', title: 'Composting Guide: Turn Waste into Fertilizer', instructor: 'Dr. Obi', duration: '15:10', views: 18432, thumbnail: '♻️', category: 'Agronomy' },
  { id: 'v5', title: 'FarmLink Tutorial: How to List and Sell Produce', instructor: 'FarmLink Team', duration: '6:30', views: 67213, thumbnail: '📱', category: 'Platform Guide' },
  { id: 'v6', title: 'Cassava Processing: Flour & Starch Production', instructor: 'Aisha Mohammed', duration: '20:15', views: 14232, thumbnail: '🥔', category: 'Processing' },
];

const ARTICLES: Article[] = [
  { id: 'a1', title: 'How FarmLink Farmers Are Earning 40% More by Cutting Out Middlemen', author: 'FarmLink Editorial', readTime: '5 min', category: 'Success Story', emoji: '📈', excerpt: 'Three farmers from Enugu, Kano, and Ibadan share how they doubled income using direct digital sales...', date: 'May 25' },
  { id: 'a2', title: '10 Signs Your Soil Needs Attention Before Planting Season', author: 'Dr. Adaeze Obi', readTime: '8 min', category: 'Agronomy', emoji: '🌍', excerpt: 'Ignoring these soil health signals before planting is one of the most costly mistakes small-scale farmers make...', date: 'May 22' },
  { id: 'a3', title: 'Nigeria\'s ₦50 Billion Farm Fund: Full Guide to Applying', author: 'FarmLink News', readTime: '6 min', category: 'Finance', emoji: '💰', excerpt: 'Everything you need to know about eligibility, documentation, and deadlines for the federal agriculture fund...', date: 'May 20' },
  { id: 'a4', title: 'Why Dry Season Farming Is Actually Better for Profits', author: 'Ibrahim Kano', readTime: '4 min', category: 'Strategy', emoji: '☀️', excerpt: 'While most farmers rest in the dry season, savvy growers capitalize on reduced competition and premium prices...', date: 'May 18' },
  { id: 'a5', title: 'A Beginner\'s Guide to Export Standards for West African Produce', author: 'Dr. Fatima Aliyu', readTime: '10 min', category: 'Export', emoji: '🌍', excerpt: 'ECOWAS, EU, and US phytosanitary requirements explained in plain language for small-scale farmers...', date: 'May 15' },
];

const LEVEL_COLORS = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

const CATEGORIES_COURSES = ['All', 'Tech', 'Crops', 'Business', 'Livestock', 'Finance', 'Agronomy', 'Organic'];

export default function LearnPage() {
  const [tab, setTab] = useState<LearnTab>('courses');
  const [catFilter, setCatFilter] = useState('All');
  const [expertQ, setExpertQ] = useState('');
  const [expertAnswered, setExpertAnswered] = useState(false);
  const [expertAnswer, setExpertAnswer] = useState('');
  const [sending, setSending] = useState(false);

  const filteredCourses = COURSES.filter(c => catFilter === 'All' || c.category === catFilter);

  const EXPERT_ANSWERS: Record<string, string> = {
    default: 'Great question! Our agronomist team reviews all submitted questions and typically responds within 24 hours. Meanwhile, try searching our course library for immediate answers.',
    disease: '🔍 For crop disease identification, we recommend our "Smart Farming for Beginners" course. Common tomato diseases include late blight (dark spots, white mold), early blight (concentric ring spots), and leaf curl virus (transmitted by whiteflies). Take a clear photo and use FarmLink\'s AI crop scanner for instant identification.',
    irrigation: '💧 For small farms under 2 acres, gravity-fed drip irrigation with 500L tanks is often most cost-effective (₦15,000–30,000 setup). For larger farms, check our "Drip Irrigation & Water Management" course for a full comparison of systems.',
    price: '📊 The best time to sell depends on your crop. For tomatoes, December–February and July–August usually see peak prices. Use FarmLink\'s Market Prices page to track real-time local prices and set price alerts.',
    fertilizer: '🌍 NPK ratios depend on your soil. A general starting point for Nigeria soils: 15-15-15 NPK at planting, then switch to high-Nitrogen (like 20-10-10) during vegetative growth. We recommend soil testing every season — FIIRO offers affordable tests.',
  };

  const askExpert = async () => {
    if (!expertQ.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    const q = expertQ.toLowerCase();
    const response = q.includes('disease') || q.includes('blight') || q.includes('pest')
      ? EXPERT_ANSWERS.disease
      : q.includes('irrigat') || q.includes('water')
      ? EXPERT_ANSWERS.irrigation
      : q.includes('price') || q.includes('sell') || q.includes('when')
      ? EXPERT_ANSWERS.price
      : q.includes('fertiliz') || q.includes('npk') || q.includes('soil')
      ? EXPERT_ANSWERS.fertilizer
      : EXPERT_ANSWERS.default;
    setExpertAnswer(response);
    setExpertAnswered(true);
    setSending(false);
  };

  const tabs: { key: LearnTab; icon: string; label: string }[] = [
    { key: 'courses', icon: '🎓', label: 'Courses' },
    { key: 'videos', icon: '🎬', label: 'Videos' },
    { key: 'articles', icon: '📰', label: 'Articles' },
    { key: 'askexpert', icon: '🧑‍🏫', label: 'Ask Expert' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-24">
        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Hub</h1>
          <p className="text-sm text-gray-500 mt-0.5">Learn, grow, and earn more from your farm</p>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-600 to-emerald-700 rounded-3xl p-5 mb-5 text-white">
          <p className="text-sm opacity-80 mb-1">🌱 35,000+ farmers enrolled</p>
          <h2 className="text-xl font-bold mb-1">Grow your farming knowledge</h2>
          <p className="text-sm opacity-90 mb-4">Free courses, expert videos, and live Q&A — all in one place</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { val: '80+', label: 'Free Courses' },
              { val: '500+', label: 'Video Lessons' },
              { val: '24h', label: 'Expert Reply' },
            ].map((s, i) => (
              <div key={i} className="bg-white/20 rounded-xl py-2">
                <p className="text-lg font-bold">{s.val}</p>
                <p className="text-xs opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition ${tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              <span>{t.icon}</span><span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Courses */}
        {tab === 'courses' && (
          <div className="space-y-4">
            {/* In progress */}
            {COURSES.filter(c => c.progress).map(c => (
              <div key={c.id} className="bg-brand-50 rounded-2xl border border-brand-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.instructor}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-700">{c.progress}%</span>
                </div>
                <div className="bg-brand-200 rounded-full h-2 mb-2">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <button className="w-full bg-brand-600 text-white text-xs py-2 rounded-xl font-bold hover:bg-brand-700 transition">
                  Continue Learning →
                </button>
              </div>
            ))}

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES_COURSES.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition ${catFilter === c ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Course cards */}
            <div className="space-y-3">
              {filteredCourses.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LEVEL_COLORS[c.level]}`}>{c.level}</span>
                        {c.free ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Free</span>
                          : <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">Premium</span>}
                      </div>
                      <p className="text-sm font-bold text-gray-900 leading-snug">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.instructor}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>⭐ {c.rating}</span>
                        <span>{c.lessons} lessons</span>
                        <span>{c.duration}</span>
                        <span>{c.enrolled.toLocaleString()} enrolled</span>
                      </div>
                    </div>
                  </div>
                  <button className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition ${c.free ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border border-brand-500 text-brand-600 hover:bg-brand-50'}`}>
                    {c.free ? '🎓 Start Free Course' : '🔐 Unlock Premium — ₦2,500'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {tab === 'videos' && (
          <div className="space-y-3">
            {VIDEOS.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-stretch">
                <div className="w-24 bg-gradient-to-br from-brand-700 to-emerald-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl opacity-70">{v.thumbnail}</span>
                </div>
                <div className="flex-1 p-3">
                  <p className="text-xs text-brand-600 font-semibold mb-0.5">{v.category}</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{v.title}</p>
                  <p className="text-xs text-gray-500">{v.instructor}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>▶ {v.duration}</span>
                    <span>·</span>
                    <span>👁️ {v.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles */}
        {tab === 'articles' && (
          <div className="space-y-3">
            {ARTICLES.map(a => (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{a.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.category}</span>
                      <span className="text-xs text-gray-400">{a.readTime} read</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-snug mb-1">{a.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{a.excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">{a.author} · {a.date}</p>
                      <button className="text-xs text-brand-600 font-semibold hover:underline">Read →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ask Expert */}
        {tab === 'askexpert' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">🧑‍🏫</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Ask an Agri Expert</p>
                  <p className="text-xs text-gray-500">Get answers from certified agronomists · Usually within 24h</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-800">Ask your question</p>
              <textarea value={expertQ} onChange={e => setExpertQ(e.target.value)}
                placeholder="e.g. Why are my tomato leaves turning yellow? What fertilizer ratio is best for sandy soil in Kano?"
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-300" />
              {!expertAnswered ? (
                <button onClick={askExpert} disabled={!expertQ.trim() || sending}
                  className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition disabled:opacity-40">
                  {sending ? '🤔 Getting answer...' : '🚀 Ask the Expert'}
                </button>
              ) : (
                <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-sm">🧑‍🏫</div>
                    <p className="text-xs font-bold text-brand-800">FarmLink Agronomist · Just now</p>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{expertAnswer}</p>
                  <button onClick={() => { setExpertAnswered(false); setExpertQ(''); setExpertAnswer(''); }}
                    className="mt-3 text-xs text-brand-600 font-semibold hover:underline">
                    Ask another question →
                  </button>
                </div>
              )}
            </div>

            {/* Common questions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-gray-800 mb-3">💡 Common Questions</p>
              <div className="space-y-2">
                {[
                  'What fertilizer should I use for tomatoes?',
                  'How do I identify and treat crop diseases?',
                  'When is the best time to sell my harvest?',
                  'How do I set up drip irrigation cheaply?',
                  'How do I apply for the government farm fund?',
                ].map((q, i) => (
                  <button key={i} onClick={() => { setExpertQ(q); setExpertAnswered(false); }}
                    className="w-full text-left text-sm text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-xl transition hover:underline">
                    → {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
