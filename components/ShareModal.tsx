'use client';
import { useState } from 'react';

interface Props {
  url?: string;
  title: string;
  description?: string;
  onClose: () => void;
}

export default function ShareModal({ url, title, description, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const text = `${title}${description ? ' — ' + description : ''} on FarmLink Africa 🌾`;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`);
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`);
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  const shareTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-3xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900 text-lg">Share this listing</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">✕</button>
        </div>

        {/* Thumbnail */}
        <div className="bg-brand-50 rounded-2xl p-4 mb-5">
          <p className="font-bold text-gray-900 text-sm line-clamp-2">{title}</p>
          {description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{description}</p>}
          <p className="text-xs text-brand-600 mt-1 truncate">{shareUrl}</p>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
            WhatsApp
          </button>
          <button onClick={shareTwitter}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter / X
          </button>
          <button onClick={shareFacebook}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
          <button onClick={shareTelegram}
            className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#007ab8] text-white py-3 rounded-xl font-bold text-sm transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </button>
        </div>

        {/* Copy link */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 font-mono truncate">
            {shareUrl}
          </div>
          <button onClick={copy}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${copied ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
            {copied ? '✓' : '🔗 Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
