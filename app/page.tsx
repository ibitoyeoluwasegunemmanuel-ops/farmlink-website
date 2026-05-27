import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATS = [
  { value: '50,000+', label: 'Registered Farmers', sub: 'across 36 states' },
  { value: '₦12B+', label: 'Trade Volume', sub: 'and growing' },
  { value: '98.4%', label: 'Delivery Success', sub: 'escrow protected' },
  { value: '2.1M+', label: 'Transactions', sub: 'since launch' },
];

const FEATURES = [
  {
    icon: '🛒',
    title: 'Direct Farm Marketplace',
    desc: 'Skip the middlemen entirely. Buy fresh produce directly from verified Nigerian farmers at real farmgate prices.',
    accent: 'brand',
    tag: 'Core',
  },
  {
    icon: '🔒',
    title: 'Escrow Payment Protection',
    desc: 'Your money is held securely and only released after you confirm delivery. Zero fraud risk on every trade.',
    accent: 'blue',
    tag: 'Trust',
  },
  {
    icon: '🚚',
    title: 'Integrated Logistics',
    desc: 'Book verified trucks and drivers directly in-app. Real-time GPS tracking from farm gate to your warehouse.',
    accent: 'amber',
    tag: 'Logistics',
  },
  {
    icon: '🤖',
    title: 'AI Crop Scanner',
    desc: 'Point your phone at any crop. Instant disease detection, treatment recommendations, and yield forecasting.',
    accent: 'purple',
    tag: 'Intelligence',
  },
  {
    icon: '📈',
    title: 'Live Market Intelligence',
    desc: 'Real-time commodity prices from Mile 12, Bodija, Kasuwan Shanu and 40+ major markets — updated hourly.',
    accent: 'green',
    tag: 'Data',
  },
  {
    icon: '💳',
    title: 'Agricultural Finance',
    desc: 'Access micro-loans, government grants, equipment financing and crop insurance. All credit decisions in 24 hrs.',
    accent: 'rose',
    tag: 'Finance',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Create Your Account',
    desc: 'Sign up with your phone number in under 90 seconds. No email required. Choose your role and complete KYC — your identity is secure.',
    visual: '📱',
  },
  {
    number: '02',
    title: 'Browse or List',
    desc: 'Buyers search thousands of verified listings filtered by crop, state, price and freshness. Farmers post a harvest in 3 taps with photo and pricing.',
    visual: '🌾',
  },
  {
    number: '03',
    title: 'Trade Safely',
    desc: 'Buyer pays into escrow. Farmer gets notified. Goods ship with a verified driver. Buyer confirms delivery. Farmer gets paid. Simple.',
    visual: '🤝',
  },
];

const ROLES = [
  {
    emoji: '🌾',
    title: 'Farmers',
    headline: 'Earn 40% more. Sell direct.',
    desc: 'List your harvest in minutes, reach verified buyers across Nigeria, and get paid securely with zero market fraud.',
    color: 'from-brand-800 to-brand-600',
    stat: '12,000+ active',
    cta: 'Start selling →',
  },
  {
    emoji: '🏪',
    title: 'Buyers & Traders',
    headline: 'Fresh produce, fair prices.',
    desc: 'Source directly from farm, guaranteed quality, escrow protection on every order, and integrated delivery.',
    color: 'from-blue-800 to-blue-600',
    stat: '8,500+ buyers',
    cta: 'Browse produce →',
  },
  {
    emoji: '🚛',
    title: 'Transporters',
    headline: 'Earn more per trip.',
    desc: 'Accept farm delivery jobs matched to your location and truck type. Guaranteed payment on completion.',
    color: 'from-amber-700 to-amber-500',
    stat: '2,200+ drivers',
    cta: 'Start driving →',
  },
  {
    emoji: '💼',
    title: 'Investors',
    headline: 'Back verified farms.',
    desc: 'Fund verified farm operations, earn competitive returns, and build an agri-investment portfolio you can track live.',
    color: 'from-violet-800 to-violet-600',
    stat: '₦2B+ deployed',
    cta: 'Explore returns →',
  },
];

const TESTIMONIALS = [
  {
    quote: "Before FarmLink I was selling at the roadside for ₦40,000/tonne. Now I get ₦65,000 directly from Lagos buyers. My family's life has genuinely changed.",
    name: 'Emeka Okafor',
    role: 'Maize Farmer · Kaduna',
    initials: 'EO',
    bg: 'bg-brand-700',
    stars: 5,
  },
  {
    quote: "The escrow system is incredible. I've completed 47 orders worth ₦18M and never lost a single naira to fraud. The logistics integration saves hours every week.",
    name: 'Fatima Abdullahi',
    role: 'Food Processor · Kano',
    initials: 'FA',
    bg: 'bg-blue-700',
    stars: 5,
  },
  {
    quote: 'I earn 3× more doing farm deliveries on FarmLink than general haulage. Job matching is instant, routes are optimized, and payments hit my account same day.',
    name: 'Chukwuemeka Eze',
    role: 'Truck Owner · Enugu',
    initials: 'CE',
    bg: 'bg-amber-600',
    stars: 5,
  },
];

const TICKER_ITEMS = [
  '🌽 White Maize — ₦55,000/tonne',
  '🍅 Tomatoes — ₦28,000/crate',
  '🧅 Red Onions — ₦42,000/bag',
  '🫘 Cowpea — ₦190,000/tonne',
  '🌾 Paddy Rice — ₦380,000/tonne',
  '🥬 Waterleaf — ₦4,500/bundle',
  '🥜 Groundnut — ₦320,000/tonne',
  '🍠 Yam — ₦1,800/tuber',
  '🫚 Palm Oil — ₦85,000/drum',
  '🌿 Cassava — ₦35,000/tonne',
];

export default function LandingPage() {
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col bg-brand-950 overflow-hidden">
        {/* Mesh gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,168,69,0.35) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 60%, rgba(17,107,44,0.25) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 10% 80%, rgba(13,81,34,0.3) 0%, transparent 60%)
            `,
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative flex-1 flex items-center container-tight pt-28 pb-16 md:pt-36">
          <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 bg-brand-800/60 border border-brand-600/40 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-400" />
                </span>
                <span className="text-brand-200 text-sm font-medium">Live in all 36 Nigerian states</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Africa&apos;s{' '}
                <br />
                <span className="gradient-text">Agricultural</span>
                <br />
                Operating System
              </h1>

              <p className="text-brand-100/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg">
                Buy fresh produce directly from verified farmers. Escrow-protected payments, integrated logistics, and AI-powered farm tools — all in one app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/marketplace"
                  className="btn-primary text-base py-3.5 px-7"
                >
                  Browse Marketplace
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-secondary text-base py-3.5 px-7"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-5">
                {[
                  { icon: '🔒', label: 'Escrow Protected' },
                  { icon: '✅', label: 'Verified Farmers' },
                  { icon: '⚡', label: 'Instant Payments' },
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-2">
                    <span className="text-base">{t.icon}</span>
                    <span className="text-brand-300/80 text-sm font-medium">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product cards */}
            <div className="hidden lg:block relative">
              {/* Main card */}
              <div className="relative z-10 bg-white rounded-3xl shadow-elevated p-6 max-w-sm mx-auto animate-float">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                  <span className="text-gray-400 text-xs ml-1">4.9 (312 reviews)</span>
                </div>
                <div className="flex items-start gap-3 mt-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl flex-shrink-0">🌽</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink text-lg leading-tight">Premium White Maize</p>
                    <p className="text-gray-500 text-sm">Emeka Farms · Kaduna State</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        ✅ Verified
                      </span>
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="text-gray-400 text-xs">200 bags left</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-brand-700 text-2xl">₦55K</p>
                    <p className="text-gray-400 text-xs">per tonne</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-brand-500 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400">60% claimed</span>
                </div>

                <button className="mt-4 w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <span>🔒</span> Buy with Escrow
                </button>
              </div>

              {/* Floating pill — payment secured */}
              <div className="absolute top-2 -right-8 z-20 glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2.5 animate-float-delayed shadow-elevated">
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Payment secured</p>
                  <p className="text-gray-400 text-xs">₦380,000 in escrow</p>
                </div>
              </div>

              {/* Floating pill — driver assigned */}
              <div className="absolute -bottom-4 -left-8 z-20 glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-elevated">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-white text-xs font-semibold">Driver assigned!</p>
                  <p className="text-brand-300 text-xs">ETA: 4 hrs 20 min</p>
                </div>
              </div>

              {/* Floating stat */}
              <div className="absolute top-1/2 -right-16 z-20 bg-white rounded-2xl px-4 py-3 shadow-elevated">
                <p className="font-black text-brand-700 text-xl stat-number">₦12B+</p>
                <p className="text-gray-400 text-xs">Total traded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────── */}
      <div className="bg-brand-600 border-y border-brand-500 py-3 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {tickerContent.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-white/90 text-sm font-medium mx-8">
                {item}
                <span className="text-brand-300 text-xs">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-tight">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">By The Numbers</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-ink">
              Nigeria's largest agricultural platform
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div
                key={s.label}
                className="group relative bg-brand-950 rounded-2xl p-7 text-center overflow-hidden cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-3xl sm:text-4xl font-black text-white stat-number mb-1">{s.value}</p>
                <p className="text-brand-200 font-semibold text-sm mb-0.5">{s.label}</p>
                <p className="text-brand-400/70 text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-canvas">
        <div className="container-tight">
          <div className="max-w-2xl mb-16">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Platform</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-ink leading-tight">
              One platform.<br />Every farm need.
            </h2>
            <p className="mt-4 text-gray-500 text-lg leading-relaxed">
              From listing your harvest to releasing escrow — FarmLink handles the full agricultural value chain so you can focus on farming.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">
                    {f.icon}
                  </div>
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 rounded-full px-2.5 py-1">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-ink text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1 text-brand-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-brand-950 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(31,168,69,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="container-tight relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">Process</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white">
              Trade in 3 steps
            </h2>
            <p className="mt-4 text-brand-200/60 text-lg max-w-xl mx-auto">
              We designed FarmLink to be simple enough for a first-time smartphone user — and powerful enough for a ₦500M/year trader.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 opacity-30" />

            {STEPS.map((s, i) => (
              <div key={s.number} className="relative text-center group">
                <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-brand-700/40 animate-pulse-slow" />
                  <div className="w-24 h-24 rounded-full bg-brand-800/60 border border-brand-600/30 flex flex-col items-center justify-center">
                    <span className="text-3xl">{s.visual}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                    <span className="text-white font-black text-xs">{s.number}</span>
                  </div>
                </div>
                <h3 className="font-black text-white text-xl mb-3">{s.title}</h3>
                <p className="text-brand-200/60 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/marketplace" className="btn-primary text-base py-3.5 px-8 inline-flex">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOR FARMERS (alt feature section) ───────────────────────── */}
      <section id="for-farmers" className="py-24 bg-white overflow-hidden">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">For Farmers</span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-ink leading-tight">
                Grow more.<br />Earn more.<br />
                <span className="gradient-text">Worry less.</span>
              </h2>
              <p className="mt-5 text-gray-500 text-lg leading-relaxed">
                FarmLink gives every Nigerian farmer the same tools that large agribusinesses use — at zero monthly cost. Post your harvest, get discovered by thousands of buyers, and get paid on your terms.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: '📸', text: 'List your harvest in 3 taps with photos and pricing' },
                  { icon: '💰', text: 'Receive secure payments — no more payment delays' },
                  { icon: '🤖', text: 'AI crop scanner diagnoses disease before it spreads' },
                  { icon: '📊', text: 'Real-time market prices — know when to sell' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-gray-700 text-sm font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex gap-4">
                <Link href="#download" className="btn-primary">Join as a Farmer →</Link>
                <a href="#how-it-works" className="btn-outline">See how it works</a>
              </div>
            </div>

            {/* Right: income comparison card */}
            <div className="relative">
              <div className="bg-brand-950 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
                <h3 className="text-white font-bold text-xl mb-6">Average Farmer Income Comparison</h3>

                <div className="space-y-5">
                  {[
                    { label: 'Roadside market', pct: 45, amount: '₦40K', color: 'bg-gray-600' },
                    { label: 'Middleman broker', pct: 62, amount: '₦55K', color: 'bg-brand-700' },
                    { label: 'FarmLink direct', pct: 100, amount: '₦88K', color: 'bg-brand-400' },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-brand-200/80 text-sm">{row.label}</span>
                        <span className="text-white font-bold text-sm">{row.amount}<span className="text-brand-400 text-xs ml-1">/tonne</span></span>
                      </div>
                      <div className="h-2.5 bg-brand-800/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${row.color} rounded-full`}
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-brand-800 pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-brand-200/60 text-xs">Average uplift with FarmLink</p>
                    <p className="text-white font-black text-3xl mt-1">+38% <span className="text-brand-400 text-lg font-bold">income</span></p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-3xl">📈</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-canvas">
        <div className="container-tight">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Built For Everyone</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-ink">
              Who is FarmLink for?
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Four roles. One connected ecosystem. Every stakeholder in Nigeria&apos;s food supply chain wins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLES.map(r => (
              <div
                key={r.title}
                className={`group relative rounded-2xl bg-gradient-to-br ${r.color} p-7 text-white overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 translate-y-8" />
                <span className="text-4xl block mb-4">{r.emoji}</span>
                <div className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-2.5 py-1 mb-3">
                  <span className="text-xs font-semibold text-white/90">{r.stat}</span>
                </div>
                <h3 className="font-black text-xl mb-1">{r.title}</h3>
                <p className="text-xs font-semibold text-white/70 mb-3">{r.headline}</p>
                <p className="text-white/65 text-sm leading-relaxed mb-5">{r.desc}</p>
                <span className="text-xs font-bold text-white/90 group-hover:text-white transition-colors flex items-center gap-1">
                  {r.cta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container-tight">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Social Proof</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-ink">
              Real people. Real results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="group bg-canvas rounded-2xl p-7 border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 relative">
                  <span className="absolute -top-2 -left-1 text-brand-200 text-5xl font-serif leading-none select-none">&ldquo;</span>
                  <span className="relative">{t.quote}</span>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ─────────────────────────────────────────────── */}
      <section id="download" className="py-24 bg-brand-950 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(31,168,69,0.18) 0%, transparent 70%)',
          }}
        />
        <div className="container-tight relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-600/30 rounded-full px-4 py-2 mb-7">
            <span className="text-brand-400 text-sm font-medium">📱 App available on Android</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-5">
            Start trading<br />
            <span className="gradient-text">in minutes.</span>
          </h2>

          <p className="text-brand-200/60 text-lg max-w-xl mx-auto mb-12">
            Free to join. No monthly fees. Pay only a 2% platform fee on successful trades — nothing else, ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#"
              className="flex items-center gap-4 bg-white rounded-2xl px-7 py-4 hover:bg-gray-50 transition-colors group shadow-elevated"
            >
              <span className="text-3xl">🤖</span>
              <div className="text-left">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Get it on</p>
                <p className="text-ink font-bold text-lg group-hover:text-brand-700 transition-colors">Google Play</p>
              </div>
            </a>

            <Link
              href="/marketplace"
              className="flex items-center gap-4 bg-brand-600 hover:bg-brand-500 rounded-2xl px-7 py-4 transition-colors group"
            >
              <span className="text-3xl">🌐</span>
              <div className="text-left">
                <p className="text-brand-200/70 text-xs uppercase tracking-wide">Or browse on</p>
                <p className="text-white font-bold text-lg">Web Marketplace</p>
              </div>
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {[
              { value: '50K+', label: 'Downloads' },
              { value: '4.8★', label: 'App Rating' },
              { value: '₦0', label: 'Monthly Fee' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-white font-black text-2xl">{item.value}</p>
                <p className="text-brand-300/60 text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
