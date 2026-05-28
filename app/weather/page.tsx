'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type WeatherTab = 'today' | 'forecast' | 'advisory' | 'alerts';

const WEEKLY_FORECAST = [
  { day: 'Thu', icon: '⛅', high: 34, low: 26, rain: 20 },
  { day: 'Fri', icon: '🌧️', high: 29, low: 24, rain: 80 },
  { day: 'Sat', icon: '🌧️', high: 27, low: 23, rain: 90 },
  { day: 'Sun', icon: '⛅', high: 32, low: 25, rain: 35 },
  { day: 'Mon', icon: '☀️', high: 36, low: 27, rain: 5 },
  { day: 'Tue', icon: '☀️', high: 37, low: 28, rain: 0 },
  { day: 'Wed', icon: '⛅', high: 33, low: 26, rain: 15 },
];

const HOURLY = [
  { time: '6AM', icon: '🌤️', temp: 26 },
  { time: '9AM', icon: '☀️', temp: 29 },
  { time: '12PM', icon: '☀️', temp: 34 },
  { time: '3PM', icon: '⛅', temp: 33 },
  { time: '6PM', icon: '🌦️', temp: 30 },
  { time: '9PM', icon: '🌙', temp: 27 },
  { time: '12AM', icon: '🌙', temp: 25 },
];

const CROP_ADVISORIES = [
  { crop: 'Tomatoes', icon: '🍅', status: 'good', advice: 'Ideal planting conditions. Moderate rainfall expected Friday. Harvest within 3 days or protect from excess moisture.', action: 'Harvest Now' },
  { crop: 'Onions', icon: '🧅', status: 'warning', advice: 'Weekend rain may cause bulb rot. Elevate beds and ensure proper drainage. Delay irrigation for 5 days.', action: 'Check Fields' },
  { crop: 'Maize', icon: '🌽', status: 'good', advice: 'Good growth conditions. Apply nitrogen fertilizer before Friday\'s rain for best absorption.', action: 'Apply Fertilizer' },
  { crop: 'Rice', icon: '🌾', status: 'great', advice: 'Excellent conditions for transplanting. The upcoming rain will reduce irrigation costs significantly.', action: 'Begin Planting' },
  { crop: 'Cassava', icon: '🥔', status: 'warning', advice: 'Hot dry spell predicted next Monday-Wednesday. Deep water the root zone before Sunday.', action: 'Pre-irrigate' },
];

const ALERTS = [
  { id: 'a1', type: 'rain', severity: 'moderate', title: 'Heavy Rain Alert', desc: 'Expect 60–90mm rainfall across Lagos, Ogun, Oyo states on Friday–Saturday. Protect stored harvests.', time: 'Fri–Sat', icon: '🌧️', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'a2', type: 'pest', severity: 'high', title: 'Armyworm Warning', desc: 'Fall armyworm activity reported in Benue, Kogi, and Nasarawa states. Check maize and sorghum fields immediately.', time: 'Active Now', icon: '🐛', color: 'bg-red-50 border-red-200 text-red-800' },
  { id: 'a3', type: 'heat', severity: 'low', title: 'Heat Advisory', desc: 'Above-normal temperatures (37–40°C) expected Mon–Wed in Sokoto, Kebbi, Zamfara. Ensure livestock water supply.', time: 'Mon–Wed', icon: '🌡️', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { id: 'a4', type: 'flood', severity: 'moderate', title: 'Flood Risk — River Niger', desc: 'Flood advisories issued for riverside farming areas in Delta, Anambra, and Kogi states. Move livestock.', time: 'Next 7 days', icon: '🌊', color: 'bg-cyan-50 border-cyan-200 text-cyan-800' },
];

const STATUS_COLORS = {
  good: 'bg-green-100 text-green-700',
  great: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-orange-100 text-orange-700',
  bad: 'bg-red-100 text-red-700',
};

export default function WeatherPage() {
  const [tab, setTab] = useState<WeatherTab>('today');
  const [location, setLocation] = useState('Ibadan, Oyo State');
  const [locationInput, setLocationInput] = useState('');
  const [showLocSearch, setShowLocSearch] = useState(false);

  const tabs: { key: WeatherTab; icon: string; label: string }[] = [
    { key: 'today', icon: '☀️', label: 'Today' },
    { key: 'forecast', icon: '📅', label: '7-Day' },
    { key: 'advisory', icon: '🌱', label: 'Crop Guide' },
    { key: 'alerts', icon: '⚠️', label: 'Alerts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-24">
        {/* Header */}
        <div className="pt-5 pb-3">
          <h1 className="text-2xl font-bold text-gray-900">Weather & Crop Advisory</h1>
          <button onClick={() => setShowLocSearch(!showLocSearch)}
            className="flex items-center gap-1.5 text-sm text-brand-600 font-medium mt-1 hover:underline">
            📍 {location} ▾
          </button>
          {showLocSearch && (
            <div className="mt-2 flex gap-2">
              <input value={locationInput} onChange={e => setLocationInput(e.target.value)}
                placeholder="Enter city or LGA..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              <button onClick={() => { if (locationInput) { setLocation(locationInput); setLocationInput(''); setShowLocSearch(false); } }}
                className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
                Go
              </button>
            </div>
          )}
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

        {/* Today */}
        {tab === 'today' && (
          <div className="space-y-4">
            {/* Main weather card */}
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 rounded-3xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-80 mb-1">{location}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-7xl font-thin">34°</p>
                  <p className="text-lg opacity-90">Partly Cloudy</p>
                  <p className="text-sm opacity-70 mt-1">Feels like 37° · H:36° L:26°</p>
                </div>
                <div className="text-8xl">⛅</div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { icon: '💧', val: '72%', label: 'Humidity' },
                  { icon: '🌬️', val: '18km/h', label: 'Wind' },
                  { icon: '☔', val: '20%', label: 'Rain' },
                  { icon: '👁️', val: '10km', label: 'Visibility' },
                ].map((m, i) => (
                  <div key={i}>
                    <p className="text-xl mb-0.5">{m.icon}</p>
                    <p className="text-sm font-bold">{m.val}</p>
                    <p className="text-xs opacity-70">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-gray-800 mb-3">Hourly Forecast</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {HOURLY.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[52px]">
                    <p className="text-xs text-gray-400">{h.time}</p>
                    <p className="text-2xl">{h.icon}</p>
                    <p className="text-sm font-bold text-gray-800">{h.temp}°</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming conditions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-gray-800 mb-3">🌾 Today&apos;s Farming Conditions</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🌱', label: 'Planting', status: 'Favorable', color: 'text-green-600' },
                  { icon: '💧', label: 'Irrigation', status: 'Not needed', color: 'text-blue-600' },
                  { icon: '🚜', label: 'Field Work', status: 'Possible', color: 'text-yellow-600' },
                  { icon: '🌾', label: 'Harvest', status: 'Ideal', color: 'text-green-600' },
                ].map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{c.label}</p>
                      <p className={`text-sm font-bold ${c.color}`}>{c.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soil moisture */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-gray-800 mb-3">🌍 Soil Moisture Index</p>
              {[
                { label: 'Topsoil (0–20cm)', val: 65, color: 'bg-green-500' },
                { label: 'Mid layer (20–50cm)', val: 48, color: 'bg-yellow-500' },
                { label: 'Deep (50cm+)', val: 72, color: 'bg-blue-500' },
              ].map((s, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{s.label}</span>
                    <span className="font-semibold">{s.val}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className={`${s.color} h-2 rounded-full transition-all`} style={{ width: `${s.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {tab === 'forecast' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-5 text-white text-center shadow">
              <p className="text-sm opacity-80 mb-1">7-Day Outlook · {location}</p>
              <p className="text-lg font-bold">Rainy Weekend, Dry Week Ahead</p>
              <p className="text-sm opacity-80 mt-1">Total rain this week: ~75mm · Avg high: 32°C</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {WEEKLY_FORECAST.map((d, i) => (
                <div key={i} className={`flex items-center gap-4 px-4 py-3 ${i < WEEKLY_FORECAST.length - 1 ? 'border-b border-gray-50' : ''} ${i === 0 ? 'bg-brand-50' : ''}`}>
                  <p className={`w-8 text-sm font-bold ${i === 0 ? 'text-brand-700' : 'text-gray-600'}`}>{d.day}</p>
                  <p className="text-2xl">{d.icon}</p>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${d.rain}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">💧 {d.rain}% rain chance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{d.high}°</p>
                    <p className="text-xs text-gray-400">{d.low}°</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crop Advisory */}
        {tab === 'advisory' && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-sm font-bold text-green-800">🌱 AI-powered crop advice based on your location&apos;s weather</p>
              <p className="text-xs text-green-600 mt-0.5">Updated daily · {location}</p>
            </div>
            {CROP_ADVISORIES.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{c.crop}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status as keyof typeof STATUS_COLORS]}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)} Conditions
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{c.advice}</p>
                <button className="bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand-700 transition">
                  → {c.action}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Alerts */}
        {tab === 'alerts' && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-2xl p-3 border border-red-100 flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <p className="text-sm font-semibold text-red-800">{ALERTS.length} active alerts in your region</p>
            </div>
            {ALERTS.map(a => (
              <div key={a.id} className={`rounded-2xl border p-4 ${a.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{a.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm">{a.title}</p>
                      <span className="text-xs opacity-70">· {a.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{a.desc}</p>
                    <button className="mt-3 bg-white/60 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/80 transition">
                      See Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-gray-800 mb-2">🔔 Alert Notifications</p>
              <p className="text-xs text-gray-500 mb-3">Get SMS and push alerts for your crops and location</p>
              <button className="w-full bg-brand-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
                Enable Weather Alerts
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
