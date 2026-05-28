'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

type SettingsTab = 'notifications' | 'privacy' | 'security' | 'appearance' | 'account';

interface ToggleSetting {
  key: string;
  label: string;
  desc: string;
  value: boolean;
}

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('notifications');
  const [saved, setSaved] = useState(false);

  // Notification settings
  const [notifs, setNotifs] = useState<ToggleSetting[]>([
    { key: 'orders', label: 'Order Updates', desc: 'New orders, delivery confirmations, disputes', value: true },
    { key: 'messages', label: 'Messages', desc: 'New chats and replies', value: true },
    { key: 'prices', label: 'Price Alerts', desc: 'Market price changes for your crops', value: true },
    { key: 'community', label: 'Community Activity', desc: 'Replies, mentions in groups', value: false },
    { key: 'marketing', label: 'Promotions & News', desc: 'FarmLink deals, events, updates', value: false },
    { key: 'sms', label: 'SMS Notifications', desc: 'Receive SMS for critical alerts', value: true },
    { key: 'email', label: 'Email Digest', desc: 'Weekly summary to your email', value: false },
  ]);

  // Privacy settings
  const [privacy, setPrivacy] = useState<ToggleSetting[]>([
    { key: 'profile_public', label: 'Public Profile', desc: 'Anyone can view your farm profile', value: true },
    { key: 'show_location', label: 'Show Location', desc: 'Show your farm location on map', value: true },
    { key: 'show_phone', label: 'Show Phone Number', desc: 'Buyers can see your phone number', value: false },
    { key: 'allow_messages', label: 'Allow Direct Messages', desc: 'Anyone can message you', value: true },
    { key: 'share_data', label: 'Analytics & Insights', desc: 'Help improve FarmLink with anonymous data', value: true },
  ]);

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('NGN');

  // Security
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const toggleNotif = (key: string) => setNotifs(ns => ns.map(n => n.key === key ? { ...n, value: !n.value } : n));
  const togglePrivacy = (key: string) => setPrivacy(ps => ps.map(p => p.key === key ? { ...p, value: !p.value } : p));

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { key: SettingsTab; icon: string; label: string }[] = [
    { key: 'notifications', icon: '🔔', label: 'Alerts' },
    { key: 'privacy', icon: '🔒', label: 'Privacy' },
    { key: 'security', icon: '🛡️', label: 'Security' },
    { key: 'appearance', icon: '🎨', label: 'Display' },
    { key: 'account', icon: '👤', label: 'Account' },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-brand-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-24">
        {/* Header */}
        <div className="pt-5 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your preferences</p>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              ✓ Saved
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-5 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Notifications */}
        {tab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {notifs.map(n => (
              <div key={n.key} className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{n.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                </div>
                <Toggle value={n.value} onChange={() => toggleNotif(n.key)} />
              </div>
            ))}
            <div className="p-4">
              <button onClick={handleSave} className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
                Save Notification Settings
              </button>
            </div>
          </div>
        )}

        {/* Privacy */}
        {tab === 'privacy' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {privacy.map(p => (
                <div key={p.key} className="flex items-center gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
                  </div>
                  <Toggle value={p.value} onChange={() => togglePrivacy(p.key)} />
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
              <p className="text-sm font-bold text-yellow-800">🔐 Your data is protected under NDPR</p>
              <p className="text-xs text-yellow-700 mt-1">FarmLink complies with the Nigeria Data Protection Regulation. We never sell your data to third parties.</p>
              <button className="mt-2 text-xs text-yellow-800 underline font-semibold">Read our Privacy Policy →</button>
            </div>
            <button onClick={handleSave} className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
              Save Privacy Settings
            </button>
          </div>
        )}

        {/* Security */}
        {tab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-400 mt-0.5">Require OTP on every login</p>
                </div>
                <Toggle value={twoFA} onChange={() => setTwoFA(!twoFA)} />
              </div>
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Biometric Login</p>
                  <p className="text-xs text-gray-400 mt-0.5">Use fingerprint or face ID</p>
                </div>
                <Toggle value={biometric} onChange={() => setBiometric(!biometric)} />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Session Timeout</p>
                <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                  {[['15', '15 minutes'], ['30', '30 minutes'], ['60', '1 hour'], ['240', '4 hours'], ['0', 'Never']].map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-900 text-left">Change Phone Number</p>
                  <p className="text-xs text-gray-400">Current: +234 *** **** ***</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-900 text-left">Login Activity</p>
                  <p className="text-xs text-gray-400">See all active sessions</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-red-600 text-left">Sign Out of All Devices</p>
                  <p className="text-xs text-gray-400">Revoke all active sessions</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
            <button onClick={handleSave} className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
              Save Security Settings
            </button>
          </div>
        )}

        {/* Appearance */}
        {tab === 'appearance' && (
          <div className="space-y-4">
            {/* Dark mode */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-400">Easier on eyes at night</p>
                </div>
                <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-xl h-16 bg-white border-2 flex items-center justify-center text-xs font-bold transition ${!darkMode ? 'border-brand-500 text-brand-700' : 'border-gray-200 text-gray-400'}`}>
                  ☀️ Light
                </div>
                <div className={`rounded-xl h-16 bg-gray-900 border-2 flex items-center justify-center text-xs font-bold transition ${darkMode ? 'border-brand-500 text-white' : 'border-gray-200 text-gray-500'}`}>
                  🌙 Dark
                </div>
              </div>
            </div>

            {/* Font size */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Text Size</p>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className={`py-2 rounded-xl border-2 text-xs font-semibold transition capitalize ${fontSize === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {s === 'small' ? 'Aa' : s === 'medium' ? 'AA' : '𝐀𝐀'} {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Language</p>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="en">🇬🇧 English</option>
                <option value="ha">Hausa 🇳🇬</option>
                <option value="yo">Yoruba 🇳🇬</option>
                <option value="ig">Igbo 🇳🇬</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="sw">Swahili 🇹🇿</option>
                <option value="ar">العربية 🇪🇬</option>
                <option value="am">አማርኛ 🇪🇹</option>
              </select>
            </div>

            {/* Currency */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Display Currency</p>
              <select value={currency} onChange={e => setCurrency(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="NGN">🇳🇬 Nigerian Naira (₦)</option>
                <option value="GHS">🇬🇭 Ghanaian Cedi (₵)</option>
                <option value="KES">🇰🇪 Kenyan Shilling (KSh)</option>
                <option value="ZAR">🇿🇦 South African Rand (R)</option>
                <option value="ETB">🇪🇹 Ethiopian Birr (Br)</option>
                <option value="USD">🇺🇸 US Dollar ($)</option>
              </select>
            </div>

            <button onClick={handleSave} className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
              Save Appearance
            </button>
          </div>
        )}

        {/* Account */}
        {tab === 'account' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              <Link href="/profile" className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <p className="text-sm font-semibold text-gray-900">Edit Profile</p>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/verify" className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Identity Verification</p>
                    <p className="text-xs text-gray-400">KYC — NIN, face verification</p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/wallet" className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <p className="text-sm font-semibold text-gray-900">Wallet & Payments</p>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/referral" className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎁</span>
                  <p className="text-sm font-semibold text-gray-900">Referral Program</p>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/support" className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <p className="text-sm font-semibold text-gray-900">Help &amp; Support</p>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition">
                <span className="text-xl">📄</span>
                <p className="text-sm font-semibold text-gray-900">Terms of Service</p>
              </button>
              <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition">
                <span className="text-xl">🔐</span>
                <p className="text-sm font-semibold text-gray-900">Privacy Policy</p>
              </button>
              <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition">
                <span className="text-xl">ℹ️</span>
                <p className="text-sm text-gray-500">FarmLink v2.4.1 · Made with ❤️ in Africa</p>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-red-100 shadow-sm divide-y divide-red-50">
              <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 transition">
                <span className="text-xl">🚪</span>
                <p className="text-sm font-semibold text-red-600">Sign Out</p>
              </button>
              <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 transition">
                <span className="text-xl">🗑️</span>
                <div>
                  <p className="text-sm font-semibold text-red-600">Delete Account</p>
                  <p className="text-xs text-gray-400">Permanently remove your data</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
