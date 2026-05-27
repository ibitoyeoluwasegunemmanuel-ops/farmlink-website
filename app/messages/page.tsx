'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface Message { id: string; from: 'me' | 'them'; text: string; time: string; read: boolean; }
interface Conversation {
  id: string; name: string; role: string; avatar: string; online: boolean;
  lastMessage: string; lastTime: string; unread: number;
  messages: Message[];
}

const CONVOS: Conversation[] = [
  {
    id: 'c1', name: 'Emeka Okafor', role: 'Farmer · Ogun State', avatar: 'EO', online: true,
    lastMessage: "Thanks for the order, I'll prepare by tomorrow morning", lastTime: '2m ago', unread: 2,
    messages: [
      { id: '1', from: 'me', text: 'Hello Emeka, I placed an order for 5 bags of tomatoes. When can you prepare it?', time: '10:30 AM', read: true },
      { id: '2', from: 'them', text: 'Hello! I received your order. Everything looks good.', time: '10:35 AM', read: true },
      { id: '3', from: 'them', text: "Thanks for the order, I'll prepare it by tomorrow morning and the driver will pick it up by 7AM.", time: '10:36 AM', read: false },
      { id: '4', from: 'me', text: 'Perfect, thank you! Please make sure the tomatoes are fresh Grade A.', time: '10:40 AM', read: true },
      { id: '5', from: 'them', text: "Of course! All my tomatoes are Grade A, harvested this week. You'll love them. 🍅", time: '10:42 AM', read: false },
    ],
  },
  {
    id: 'c2', name: 'Musa Sule', role: 'Driver · Toyota Hiace', avatar: 'MS', online: true,
    lastMessage: "I'm 30 minutes away from delivery", lastTime: '15m ago', unread: 1,
    messages: [
      { id: '1', from: 'them', text: 'Good morning, I picked up your order from Emeka Farms in Ogun.', time: '8:00 AM', read: true },
      { id: '2', from: 'me', text: 'Great! What time will you arrive in Lagos?', time: '8:05 AM', read: true },
      { id: '3', from: 'them', text: "I'm on the expressway now. Should be at your address around 2PM.", time: '11:00 AM', read: true },
      { id: '4', from: 'them', text: "I'm 30 minutes away from delivery. Please be available to receive.", time: '1:30 PM', read: false },
    ],
  },
  {
    id: 'c3', name: 'Fatima Usman', role: 'Buyer · Abuja', avatar: 'FU', online: false,
    lastMessage: 'How much for 10 bags of maize?', lastTime: '2h ago', unread: 0,
    messages: [
      { id: '1', from: 'them', text: 'Hello, I saw your maize listing on FarmLink. Is it still available?', time: 'Yesterday 3:00 PM', read: true },
      { id: '2', from: 'me', text: 'Yes! 200 bags available. Grade A white maize, ₦55,000/bag.', time: 'Yesterday 3:05 PM', read: true },
      { id: '3', from: 'them', text: 'How much for 10 bags? Can you do a discount?', time: '2h ago', read: true },
      { id: '4', from: 'me', text: 'For 10 bags I can do ₦52,000/bag — that saves you ₦30,000. Shall I reserve them?', time: '1h ago', read: true },
    ],
  },
  {
    id: 'c4', name: 'Kola Fresh Farms', role: 'Farmer · Lagos', avatar: 'KF', online: false,
    lastMessage: 'We have fresh tomatoes available — just harvested!', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: '1', from: 'them', text: 'Hello! We have fresh Roma tomatoes available — just harvested this morning. 80 crates.', time: 'Yesterday 9:00 AM', read: true },
      { id: '2', from: 'me', text: 'Thanks for reaching out. What is the price per crate?', time: 'Yesterday 9:30 AM', read: true },
      { id: '3', from: 'them', text: '₦12,000 per crate. Minimum order 5 crates. Delivery available to Lagos area.', time: 'Yesterday 9:45 AM', read: true },
    ],
  },
];

const STORAGE_KEY = 'fl_messages';

export default function MessagesPage() {
  const { isAuthenticated } = useAuth();
  const [convos, setConvos] = useState<Conversation[]>(() => {
    if (typeof window === 'undefined') return CONVOS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : CONVOS;
    } catch { return CONVOS; }
  });
  const [active, setActive] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Persist conversations to localStorage whenever they change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(convos)); } catch { /* ignore */ }
  }, [convos]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active]);

  const openChat = (c: Conversation) => {
    setActive(c);
    setMobileView('chat');
    setConvos(prev => prev.map(x => x.id === c.id ? { ...x, unread: 0 } : x));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !active) return;
    const msg: Message = { id: Date.now().toString(), from: 'me', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true };
    const updated = convos.map(c => c.id === active.id ? { ...c, messages: [...c.messages, msg], lastMessage: input.trim(), lastTime: 'Just now' } : c);
    setConvos(updated);
    setActive(updated.find(c => c.id === active.id) || null);
    setInput('');
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Sign in to view messages</h2>
          <Link href="/auth" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );

  const totalUnread = convos.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16" style={{ height: 'calc(100vh - 0px)' }}>
        <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">

          {/* Sidebar */}
          <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex-shrink-0`}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-lg font-black text-gray-900">Messages {totalUnread > 0 && <span className="ml-1 bg-green-600 text-white text-xs font-black px-1.5 py-0.5 rounded-full">{totalUnread}</span>}</h1>
                <button onClick={() => setShowNew(true)} className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg hover:bg-green-700 transition-colors">+</button>
              </div>
              <input placeholder="Search conversations..." className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {convos.map(c => (
                <button key={c.id} onClick={() => openChat(c)} className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${active?.id === c.id ? 'bg-green-50' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-green-700 flex items-center justify-center text-white font-black text-sm">{c.avatar}</div>
                    {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                      <span className="text-xs text-gray-400">{c.lastTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{c.role}</p>
                    <p className="text-xs text-gray-600 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">{c.unread}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white`}>
            {active ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
                  <button onClick={() => setMobileView('list')} className="md:hidden text-gray-500 mr-1">←</button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-black text-sm">{active.avatar}</div>
                    {active.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{active.name}</p>
                    <p className="text-xs text-gray-500">{active.online ? '🟢 Online' : '⚫ Offline'} · {active.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href="tel:+2348030000000" className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors">📞</a>
                    <Link href="/orders" className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors">📦</Link>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {active.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === 'me' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-white/60 text-right' : 'text-gray-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..."
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  <button type="submit" disabled={!input.trim()}
                    className="w-11 h-11 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">Select a conversation</h3>
                  <p className="text-gray-500 text-sm mb-6">Chat with farmers, drivers, and buyers before ordering</p>
                  <button onClick={() => setShowNew(true)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">+ New Message</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New message modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 text-lg mb-4">New Message</h3>
            <input placeholder="Search farmers, drivers..." autoFocus className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 mb-4" />
            <p className="text-xs text-gray-400 mb-3">SUGGESTED</p>
            <div className="space-y-2">
              {CONVOS.map(c => (
                <button key={c.id} onClick={() => { openChat(c); setShowNew(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white font-black text-xs">{c.avatar}</div>
                  <div><p className="font-semibold text-sm text-gray-900">{c.name}</p><p className="text-xs text-gray-500">{c.role}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
