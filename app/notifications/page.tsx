'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  id: string;
  type: 'order' | 'payment' | 'investment' | 'price' | 'system' | 'message' | 'verification';
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
  icon: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'Order Delivered!', body: 'Your order #txn_b2c3d4 (White Maize 100kg) has been delivered. Confirm receipt to release payment to the farmer.', time: '2 mins ago', read: false, link: '/orders/txn_b2c3d4', icon: '📦' },
  { id: '2', type: 'payment', title: 'Payment Released', body: '₦358,050 has been successfully released to Emeka Okafor for order #txn_a1b2c3. Transaction complete!', time: '1 hour ago', read: false, link: '/orders/txn_a1b2c3', icon: '💸' },
  { id: '3', type: 'investment', title: 'Investment Milestone Reached', body: 'Great news! Your Maize Farm investment reached 60% progress. On track for a 22% return in 3 months.', time: '3 hours ago', read: false, link: '/invest', icon: '📈' },
  { id: '4', type: 'price', title: '🔥 Tomatoes Prices Up 12%', body: 'Tomato prices in Lagos have jumped 12% today. Buy now before prices rise further. 14 farmers have fresh stock.', time: '5 hours ago', read: true, link: '/marketplace', icon: '🍅' },
  { id: '5', type: 'order', title: 'Driver Assigned', body: 'Musa Sule has been assigned to your order #txn_c3d4e5. Vehicle: Mitsubishi Canter LG-567-BC. Expected pickup: Tomorrow 7AM.', time: 'Yesterday', read: true, link: '/orders/txn_c3d4e5', icon: '🚛' },
  { id: '6', type: 'verification', title: 'Account Verified ✓', body: 'Your FarmLink account has been verified. You can now post listings, book transport, and access premium features.', time: '2 days ago', read: true, link: '/profile', icon: '✅' },
  { id: '7', type: 'message', title: 'New message from Emeka Okafor', body: '"Hello, your tomatoes are ready for pickup. I have added 2 extra kg at no charge. Please confirm your address." — Emeka', time: '2 days ago', read: true, link: '/marketplace', icon: '💬' },
  { id: '8', type: 'investment', title: 'New Investment Opportunity', body: 'Greenhouse Tomato Farm (Plateau State) is now available. 26% projected return, Low risk. ₦50K minimum. Only 3 slots left!', time: '3 days ago', read: true, link: '/invest', icon: '🌿' },
  { id: '9', type: 'payment', title: 'Withdrawal Successful', body: 'Your withdrawal of ₦50,000 to GTBank ****7821 was processed. Funds should arrive within 24 hours.', time: '4 days ago', read: true, link: '/wallet', icon: '🏦' },
  { id: '10', type: 'price', title: 'Price Alert: Rice', body: 'Rice (50kg bag) price in Kano has dropped 5.3% to ₦38,000. Good time to stock up.', time: '5 days ago', read: true, link: '/market-prices', icon: '🍚' },
  { id: '11', type: 'system', title: 'Welcome to FarmLink! 🌾', body: 'You\'re now part of Africa\'s largest agricultural marketplace. Browse fresh produce, book transport, invest in farms, and more.', time: '1 week ago', read: true, link: '/', icon: '🎉' },
];

const TYPE_COLORS: Record<string, string> = {
  order: 'bg-blue-50',
  payment: 'bg-green-50',
  investment: 'bg-purple-50',
  price: 'bg-amber-50',
  system: 'bg-gray-50',
  message: 'bg-indigo-50',
  verification: 'bg-teal-50',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'order', label: 'Orders' },
  { key: 'payment', label: 'Payments' },
  { key: 'investment', label: 'Investments' },
  { key: 'price', label: 'Price Alerts' },
  { key: 'message', label: 'Messages' },
];

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-ink">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none mb-5 pb-1">
            {FILTERS.map(f => {
              const count = f.key === 'all' ? unreadCount : notifications.filter(n => n.type === f.key && !n.read).length;
              return (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${filter === f.key ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>
                  {f.label}
                  {count > 0 && (
                    <span className={`text-xs font-black w-4 h-4 rounded-full flex items-center justify-center ${filter === f.key ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <div className="text-5xl mb-4">🔔</div>
              <p className="font-bold text-ink">No notifications here</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(notif => (
                <div key={notif.id}
                  className={`rounded-2xl border transition-all ${notif.read ? 'bg-white border-gray-100' : 'bg-brand-50 border-brand-100 shadow-sm'}`}>
                  <div className="flex items-start gap-3 p-4">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${TYPE_COLORS[notif.type]}`}>
                      {notif.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-bold leading-snug ${notif.read ? 'text-ink' : 'text-brand-900'}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notif.read && (
                            <span className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                          <button onClick={() => deleteNotif(notif.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors text-xs p-1">
                            ✕
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{notif.time}</span>
                        {notif.link && (
                          <Link href={notif.link} onClick={() => markRead(notif.id)}
                            className="text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings link */}
          <div className="mt-8 text-center">
            <Link href="/profile#notifications" className="text-sm text-gray-400 hover:text-brand-600 transition-colors">
              ⚙️ Manage notification preferences
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </>
  );
}
