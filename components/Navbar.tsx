'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/#for-farmers', label: 'For Farmers' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-tight flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm leading-none">FL</span>
          </div>
          <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? 'text-ink' : 'text-white'}`}>
            Farm<span className={scrolled ? 'text-brand-600' : 'text-brand-300'}>Link</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand-400 ${
                scrolled ? 'text-gray-600' : 'text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/marketplace"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-gray-600 hover:text-brand-600' : 'text-white/80 hover:text-white'
            }`}
          >
            Browse market
          </Link>
          <Link href="#download" className="btn-primary text-sm py-2.5 px-5">
            Download App
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-ink' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container-tight py-4 flex flex-col gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-brand-600 py-2.5 px-3 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#download"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 justify-center text-sm"
            >
              Download App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
