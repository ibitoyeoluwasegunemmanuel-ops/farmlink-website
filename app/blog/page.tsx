'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const POSTS = [
  {
    id: 1, category: 'Market News', featured: true,
    title: 'Tomato Prices Surge 40% Ahead of Ramadan Season — What Farmers Should Know',
    excerpt: 'Market analysts report a significant uptick in tomato demand across Northern Nigeria and Niger as Ramadan approaches. Farmers in Kaduna and Kano states are reporting record sales prices of ₦18,000–₦22,000 per crate.',
    author: 'Amina Bello', authorRole: 'Market Analyst', date: '2026-05-25', readTime: '4 min', image: '🍅',
    tags: ['Tomatoes', 'Pricing', 'Ramadan', 'North Nigeria'],
    content: `Tomato prices across West Africa's markets have surged significantly this month, with analysts pointing to a combination of reduced supply from major farming states and increased seasonal demand ahead of the Ramadan period.\n\nFarmers in Kaduna State are reporting prices of ₦18,000 to ₦22,000 per 50kg crate — a 40% increase from the same period last year. This presents a significant opportunity for farmers who have produce ready for market.\n\nKey insights:\n• Prices expected to remain elevated through June\n• Direct-to-market sales avoiding middlemen could net farmers 25% more\n• FarmLink's escrow system protects both sides during high-value transactions\n• Consider listing on FarmLink now to lock in current high prices`,
  },
  {
    id: 2, category: 'Farming Tips', featured: false,
    title: '5 Drip Irrigation Techniques That Can Double Your Dry Season Yield',
    excerpt: 'With water scarcity affecting more farms each year, these proven irrigation techniques from successful farmers across Ghana and Nigeria can help you grow more with less water.',
    author: 'Dr. Kwame Asante', authorRole: 'Agricultural Engineer', date: '2026-05-22', readTime: '6 min', image: '💧',
    tags: ['Irrigation', 'Water Management', 'Dry Season', 'Technology'],
    content: `Water management is increasingly the difference between a profitable season and a failed crop. These five techniques have been proven on farms across sub-Saharan Africa.\n\n1. Subsurface drip irrigation: Pipes buried 20-30cm deliver water directly to root zones, reducing evaporation by up to 70%.\n\n2. Mulching + surface drip combination: A layer of organic mulch above drip lines can extend soil moisture retention by 3-4 days between irrigation cycles.\n\n3. Deficit irrigation scheduling: Applying water at specific growth stages rather than continuously can save 30% water without significantly reducing yield.\n\n4. Soil moisture sensors: Low-cost sensors (now available for under ₦15,000) tell you exactly when and how much to irrigate.\n\n5. Recycled water catchment: Rooftop collection systems can supplement irrigation during unexpected dry spells.`,
  },
  {
    id: 3, category: 'Success Stories', featured: false,
    title: 'How Chioma Eze Grew Her Vegetable Farm Revenue by 3× Using FarmLink',
    excerpt: 'From selling at local markets for ₦40,000/week to earning ₦180,000/week through direct buyer connections — Chioma shares her journey and the exact steps she took.',
    author: 'FarmLink Team', authorRole: 'Editorial', date: '2026-05-20', readTime: '5 min', image: '👩🏾‍🌾',
    tags: ['Success Story', 'Vegetables', 'Women in Farming', 'Income Growth'],
    content: `Chioma Eze started farming in 2021 with just 2 hectares of land in Anambra State. Her main challenge wasn't growing food — it was finding buyers who would pay fair prices.\n\n"Before FarmLink, I was selling to the same four market women who set all the prices. They knew I had no choice," Chioma recalls.\n\nAfter listing on FarmLink in early 2025, she connected with restaurants in Lagos, Abuja, and Enugu who needed consistent, quality vegetables. Within six months:\n\n• Weekly revenue grew from ₦40,000 to ₦180,000\n• She hired 4 additional farm workers\n• She expanded to a second plot of 3 hectares\n• She now gets orders 2 weeks in advance, eliminating uncertainty\n\n"The escrow system was the biggest thing for me. I know I'll get paid the moment my produce is confirmed delivered. No more chasing buyers."`,
  },
  {
    id: 4, category: 'Investment', featured: false,
    title: 'Farm Investment Returns in 2026: Which Crops Are Delivering 35%+ ROI',
    excerpt: 'Our analysis of 500+ farm investments on the FarmLink platform reveals which crop types are consistently delivering the highest returns for investors this season.',
    author: 'Tunde Adeyemi', authorRole: 'Investment Analyst', date: '2026-05-18', readTime: '7 min', image: '📈',
    tags: ['Investment', 'ROI', 'Crops', 'Finance'],
    content: `Based on data from over 500 farm investments on the FarmLink platform between January and May 2026, these are the top-performing crop categories by ROI.\n\nTop performers:\n1. Catfish farming: 38–45% ROI in 4–6 months (Ogun, Delta, Anambra)\n2. Tomato farming: 32–40% ROI in 3 months (Kaduna, Kano, Plateau)\n3. Cassava: 28–35% ROI in 12 months (Oyo, Cross River, Benue)\n4. Maize: 25–32% ROI in 4 months (Benue, Kogi, Niger)\n5. Leafy vegetables: 22–30% ROI in 6–8 weeks (all states, multiple cycles)\n\nKey factors driving returns in 2026:\n• Reduced importation reducing competition\n• Rising middle class in Lagos, Abuja, Accra driving premium demand\n• FarmLink's logistics network reducing post-harvest losses\n\nHow to invest: Browse farm listings at farmlink.africa/invest, review farmer profiles and past records, and invest from ₦50,000.`,
  },
  {
    id: 5, category: 'Weather', featured: false,
    title: 'NIMET 2026 Rainy Season Forecast: What Nigerian Farmers Must Prepare For',
    excerpt: 'Nigeria\'s meteorological agency predicts above-normal rainfall in the south and erratic patterns in the north. Here\'s how to adjust your planting calendar.',
    author: 'Fatima Usman', authorRole: 'Agrometeorologist', date: '2026-05-15', readTime: '5 min', image: '🌧️',
    tags: ['Weather', 'Planning', 'Climate', 'NIMET'],
    content: `Nigeria's 2026 long rainy season forecast from NIMET shows significant variation across zones that every farmer should factor into planning.\n\nSouth-South and South-East: Above-normal rainfall expected (June–October). Risk of flooding in riverine areas. Farmers should:\n• Raise planting beds by 15–20cm\n• Avoid planting in flood-prone lowlands\n• Invest in drainage channels before the season peaks\n\nNorth-West and North-East: Erratic onset, risk of mid-season dry spell in August. Farmers should:\n• Plant early varieties that mature before the dry spell\n• Maintain irrigation capacity as backup\n• Consider drought-tolerant varieties of millet and sorghum\n\nSouth-West: Near-normal rainfall. Standard planting calendar applies.\n\nPlanting window recommendation: First planting: April 15 – May 30. Second planting: July 15 – August 15 (shorter-season crops only).`,
  },
  {
    id: 6, category: 'Farming Tips', featured: false,
    title: 'Organic Certification in Africa: A Step-by-Step Guide to Premium Pricing',
    excerpt: 'Organic-certified produce commands 50–200% price premiums in export markets and premium supermarkets. Here\'s how to get certified without breaking the bank.',
    author: 'Dr. Ngozi Adaeze', authorRole: 'Organic Certification Consultant', date: '2026-05-12', readTime: '8 min', image: '🌿',
    tags: ['Organic', 'Certification', 'Export', 'Premium'],
    content: `Getting organic certification doesn't have to cost millions. Many farmers in Kenya, Ghana, and Nigeria have achieved certification for under ₦500,000 through group certification schemes.\n\nStep 1: Start with Internal Control System (ICS)\nDocument everything: what you plant, when you spray (or don't spray), what fertilizers you use. This documentation is the foundation of any certification.\n\nStep 2: Join a farmer group\nCertification bodies like ECOCERT, Control Union, and NASFA-ORG offer group certification that splits costs across 20–100 farmers. Individual cost drops to ₦50,000–₦150,000.\n\nStep 3: The transition period\n2–3 years of documented organic practice before certification. Use this time to find premium buyers who will pay more even for "transition organic" produce.\n\nStep 4: Apply for certification\nSuggest starting with NASFA-ORG (Nigeria) or GOAS (Ghana) before pursuing international certifiers like ECOCERT.\n\nExpected premium: Local organic markets: 30–80%. Export/EU market: 80–200%.`,
  },
  {
    id: 7, category: 'Market News', featured: false,
    title: 'Ghana Cocoa Season: Prices Hit 5-Year High as Global Demand Surges',
    excerpt: 'COCOBOD announces main crop prices of GHC 2,800/bag — the highest since 2021. What this means for Ghana\'s cocoa farmers and FarmLink investors.',
    author: 'Kwabena Mensah', authorRole: 'Commodity Analyst', date: '2026-05-10', readTime: '4 min', image: '🍫',
    tags: ['Cocoa', 'Ghana', 'Commodity', 'Export'],
    content: `Ghana's Cocoa Board (COCOBOD) has announced producer prices of GHC 2,800 per 64kg bag for the current main crop season — a 22% increase from last year and the highest nominal price in five years.\n\nThe surge is driven by:\n• Reduced output from Ivory Coast due to climate disruptions\n• Surging European and Asian demand for premium single-origin chocolate\n• Ghana's successful "Beyond the Bean" campaign promoting direct trade\n\nFor FarmLink investors with exposure to Ghanaian cocoa farms, this is an exceptional window. Farms listed on FarmLink in the Ashanti and Western Regions are currently projecting returns of 35–50% for the season.\n\nFor farmers: Now is the time to list your cocoa on FarmLink to attract direct buyers who can pay above COCOBOD floor prices for premium grades.`,
  },
  {
    id: 8, category: 'Success Stories', featured: false,
    title: 'The Katsina Farmer Who Built a ₦50M Onion Empire Starting With ₦80,000',
    excerpt: 'Musa Aliyu\'s story of how he turned a small onion plot into one of northern Nigeria\'s most profitable farming operations — and how FarmLink was the turning point.',
    author: 'FarmLink Team', authorRole: 'Editorial', date: '2026-05-05', readTime: '6 min', image: '🧅',
    tags: ['Success Story', 'Onions', 'North Nigeria', 'Scale'],
    content: `In 2019, Musa Aliyu borrowed ₦80,000 from his village cooperative to plant his first commercial onion crop on 0.5 hectares in Katsina State. Today, he farms 18 hectares and generates over ₦50 million in annual revenue.\n\n"The first few years, I was making money but never growing. Every buyer wanted to pay 60 days after delivery. I was always short of working capital to plant the next season."\n\nWhen Musa joined FarmLink in 2024, two things changed:\n1. Escrow payments meant he received money within 3 days of confirmed delivery — not 60 days\n2. FarmLink investor funding gave him ₦3.2 million to expand from 4 to 18 hectares in one season\n\nHis 2026 numbers:\n• 18 hectares under cultivation\n• 7 permanent staff + 40 seasonal workers\n• 12 regular buyers across Nigeria and Niger Republic\n• Average selling price 15% above local market (quality premium)`,
  },
];

const CATEGORIES = ['All', 'Market News', 'Farming Tips', 'Success Stories', 'Investment', 'Weather'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null);
  const [search, setSearch] = useState('');

  const filtered = POSTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = POSTS.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const catCount = (cat: string) => cat === 'All' ? POSTS.length : POSTS.filter(p => p.category === cat).length;

  const CAT_COLORS: Record<string, string> = {
    'Market News': 'bg-blue-100 text-blue-700',
    'Farming Tips': 'bg-green-100 text-green-700',
    'Success Stories': 'bg-amber-100 text-amber-700',
    'Investment': 'bg-purple-100 text-purple-700',
    'Weather': 'bg-sky-100 text-sky-700',
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-4xl">

          {/* Header */}
          <div className="pt-6 mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full text-sm font-bold mb-3">📰 FarmLink Blog</div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Farming News & Insights</h1>
            <p className="text-gray-500">Market prices, farming tips, success stories, and investment insights from across Africa</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles, topics, or crops..."
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-brand-400 shadow-sm" />
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>
                {cat} <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20' : 'bg-gray-100'}`}>{catCount(cat)}</span>
              </button>
            ))}
          </div>

          {/* Featured post */}
          {activeCategory === 'All' && !search && featured && (
            <button onClick={() => setSelectedPost(featured)}
              className="w-full bg-gradient-to-br from-brand-700 to-emerald-600 rounded-3xl p-6 mb-6 text-left hover:opacity-95 transition-opacity shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-6xl flex-shrink-0">{featured.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ FEATURED</span>
                    <span className="text-white/70 text-xs">{featured.category}</span>
                  </div>
                  <h2 className="text-xl font-black text-white mb-2 leading-snug">{featured.title}</h2>
                  <p className="text-white/70 text-sm line-clamp-2 mb-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-white/60 text-xs">
                    <span>✍️ {featured.author}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>⏱ {featured.readTime} read</span>
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* Posts grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📰</div>
              <p className="text-gray-500">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {(activeCategory === 'All' && !search ? rest : filtered).map(post => (
                <button key={post.id} onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-card p-5 text-left hover:border-brand-200 hover:shadow-md transition-all group">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-4xl flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">{post.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[post.category] || 'bg-gray-100 text-gray-600'}`}>{post.category}</span>
                        <span className="text-xs text-gray-400">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-black text-gray-900 text-sm leading-snug mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <span className="font-medium text-gray-600">{post.author}</span> · {post.date}
                    </div>
                    <span className="text-xs text-brand-600 font-bold">Read →</span>
                  </div>
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Load more */}
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {/* Article modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedPost(null)}>
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CAT_COLORS[selectedPost.category] || 'bg-gray-100 text-gray-600'}`}>{selectedPost.category}</span>
              <button onClick={() => setSelectedPost(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">✕</button>
            </div>
            <div className="p-6">
              <div className="text-6xl mb-4 text-center">{selectedPost.image}</div>
              <h1 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{selectedPost.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <span>✍️ <span className="font-semibold text-gray-700">{selectedPost.author}</span></span>
                <span>·</span>
                <span>{selectedPost.authorRole}</span>
                <span>·</span>
                <span>{selectedPost.date}</span>
                <span>·</span>
                <span>⏱ {selectedPost.readTime}</span>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{selectedPost.content}</div>
              <div className="flex gap-2 flex-wrap mt-6 pt-6 border-t border-gray-100">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">#{tag}</span>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                <button className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors">Share Article</button>
                <button onClick={() => setSelectedPost(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
