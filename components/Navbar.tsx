'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = !scrolled;

  const navLinks = isAuthenticated
    ? [
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/transport', label: 'Transport' },
        { href: '/equipment', label: 'Equipment' },
        { href: '/orders', label: 'My Orders' },
        { href: '/dashboard', label: 'Dashboard' },
      ]
    : [
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/transport', label: 'Transport' },
        { href: '/equipment', label: 'Equipment' },
        { href: '/join', label: 'Join' },
      ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setOpen(false);
    router.push('/');
  };

  const roleLabel: Record<string, string> = {
    farmer: '🌾 Farmer',
    buyer: '🛒 Buyer',
    transporter: '🚛 Transporter',
    equipment_owner: '⚙️ Equipment Owner',
    investor: '💼 Investor',
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-tight flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm leading-none">FL</span>
          </div>
          <span className={`font-bold text-lg tracking-tight transition-colors ${isDark ? 'text-white' : 'text-ink'}`}>
            Farm<span className={isDark ? 'text-brand-300' : 'text-brand-600'}>Link</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand-400 ${
                isDark ? 'text-white/80' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart button */}
          <Link
            href="/cart"
            className={`relative p-2 rounded-lg transition-colors ${
              isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
            }`}
            aria-label="Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            /* User avatar menu */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-lg" />
                    : user.fullName?.charAt(0) || 'U'}
                </div>
                <span className={`text-sm font-medium max-w-[100px] truncate ${isDark ? 'text-white' : 'text-ink'}`}>
                  {user.fullName?.split(' ')[0] || 'Account'}
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/60' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-elevated overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="font-bold text-ink text-sm truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.phoneNumber}</p>
                    {user.role && (
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                        {roleLabel[user.role] || user.role}
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    {[
                      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
                      { href: '/orders', label: 'My Orders', icon: '📦' },
                      { href: '/cart', label: 'Cart', icon: '🛒', badge: count > 0 ? String(count) : undefined },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <span>{item.icon}</span> {item.label}
                        </span>
                        {item.badge && (
                          <span className="bg-brand-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-50 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span>🚪</span> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Auth CTAs */
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className={`text-sm font-medium transition-colors px-4 py-2 rounded-lg ${
                  isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-brand-600'
                }`}
              >
                Sign in
              </Link>
              <Link href="/join" className="btn-primary text-sm py-2.5 px-5">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/cart"
            className={`relative p-2 rounded-lg ${isDark ? 'text-white' : 'text-ink'}`}
            aria-label="Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-white' : 'text-ink'}`}
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
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container-tight py-4 flex flex-col gap-1">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-brand-50 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink text-sm truncate">{user.fullName}</p>
                  <p className="text-xs text-brand-600">{roleLabel[user.role || ''] || 'Member'}</p>
                </div>
              </div>
            )}

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-brand-600 py-2.5 px-3 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:bg-red-50 py-2.5 px-3 rounded-lg transition-colors text-left mt-1"
              >
                🚪 Sign out
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/auth" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700 hover:text-brand-600 py-2.5 px-3 rounded-lg hover:bg-brand-50 transition-colors text-center border border-gray-200">
                  Sign in
                </Link>
                <Link href="/join" onClick={() => setOpen(false)} className="btn-primary justify-center text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
