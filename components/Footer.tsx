import Link from 'next/link';

const PLATFORM_LINKS = ['Marketplace', 'Logistics', 'Escrow Payments', 'AI Crop Scanner', 'Market Prices', 'Weather Alerts'];
const USER_LINKS = ['For Farmers', 'For Buyers', 'For Transporters', 'For Investors'];
const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-tight relative z-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">FL</span>
              </div>
              <span className="font-bold text-xl">Farm<span className="text-brand-300">Link</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Africa&apos;s agricultural operating system. Connecting farmers, buyers, and transporters with transparent, escrow-protected trade.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'X', href: '#' },
                { label: 'in', href: '#' },
                { label: 'ig', href: '#' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-600 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white transition-all duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-5 opacity-60">Platform</h3>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-brand-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Users */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-5 opacity-60">Who It&apos;s For</h3>
            <ul className="space-y-3">
              {USER_LINKS.map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-brand-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Download */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-5 opacity-60">Contact</h3>
            <ul className="space-y-3 mb-7">
              {[
                { icon: '📍', text: 'Lagos, Nigeria' },
                { icon: '✉️', text: 'hello@farmlink.ng' },
                { icon: '📱', text: '+234 800 FARMLINK' },
              ].map(c => (
                <li key={c.text} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <span className="mt-0.5 text-base">{c.icon}</span>
                  {c.text}
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-3">Download App</p>
            <a
              href="#download"
              className="flex items-center gap-3 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl px-4 py-3 transition-all duration-200 group"
            >
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-xs text-gray-400">Get it on</p>
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">Google Play</p>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FarmLink Technologies Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map(item => (
              <a key={item} href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
