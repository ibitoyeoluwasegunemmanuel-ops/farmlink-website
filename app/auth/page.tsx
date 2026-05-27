'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT',
];

type Step = 'phone' | 'otp' | 'profile';

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get('role') || 'buyer';
  const { sendOTP, verifyOTP, setupProfile } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState({ fullName: '', state: '', farmName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleLabel: Record<string, string> = {
    farmer: 'Farmer', buyer: 'Buyer / Trader', transporter: 'Transporter',
    equipment: 'Equipment Owner', investor: 'Investor',
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.match(/^(\+234|0)[0-9]{10}$/)) {
      setError('Enter a valid Nigerian phone number (e.g. 08012345678)');
      return;
    }
    setLoading(true);
    try {
      const formatted = phone.startsWith('0') ? '+234' + phone.slice(1) : phone;
      const res = await sendOTP(formatted);
      if (res.success) {
        if (res.userId) setUserId(res.userId);
        if (res.isNewUser !== undefined) localStorage.setItem('fl_pending_role', role);
        setStep('otp');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Network error. Check your connection.');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formatted = phone.startsWith('0') ? '+234' + phone.slice(1) : phone;
    try {
      const res = await verifyOTP(formatted, otp);
      if (res.success) {
        if (res.userId) setUserId(res.userId);
        if (res.isNewUser) {
          if (res.token) localStorage.setItem('fl_pending_token', res.token);
          setStep('profile');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError('Invalid OTP. Please check and try again.');
      }
    } catch {
      setError('Verification failed. Try again.');
    }
    setLoading(false);
  };

  const handleSetupProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!profile.fullName.trim()) { setError('Please enter your full name.'); return; }
    setLoading(true);
    try {
      const ok = await setupProfile(userId, { ...profile, role: role as any });
      if (ok) {
        router.push('/dashboard');
      } else {
        setError('Failed to save profile. Try again.');
      }
    } catch {
      setError('Network error. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(31,168,69,0.1) 0%, transparent 70%)' }} />

      <div className="relative bg-white rounded-3xl shadow-elevated p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center"><span className="text-white font-black">FL</span></div>
            <span className="font-bold text-xl text-ink">Farm<span className="text-brand-600">Link</span></span>
          </Link>
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Joining as {roleLabel[role] || 'User'}
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {(['phone', 'otp', 'profile'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === s ? 'bg-brand-600 text-white' : (['otp', 'profile'].indexOf(s) <= ['phone', 'otp', 'profile'].indexOf(step) ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400')}`}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-black text-ink mt-4">
            {step === 'phone' ? 'Enter your phone number' : step === 'otp' ? 'Enter verification code' : 'Complete your profile'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 'phone' ? 'We\'ll send a one-time code to verify your number' :
             step === 'otp' ? `Code sent to ${phone}` :
             'Almost done! Tell us a bit about yourself.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <span>⚠️</span>{error}
          </div>
        )}

        {/* ── STEP 1: Phone ── */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
              <div className="flex">
                <div className="bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl px-3 flex items-center text-sm text-gray-500 font-medium">🇳🇬 +234</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Verification Code →'}
            </button>
            <p className="text-center text-gray-400 text-xs">By continuing, you agree to FarmLink&apos;s Terms and Privacy Policy</p>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">6-Digit Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading || otp.length < 4} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Code →'}
            </button>
            <button type="button" onClick={() => setStep('phone')} className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors">
              ← Change phone number
            </button>
          </form>
        )}

        {/* ── STEP 3: Profile ── */}
        {step === 'profile' && (
          <form onSubmit={handleSetupProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
            </div>
            {role === 'farmer' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Farm Name</label>
                <input
                  type="text"
                  value={profile.farmName}
                  onChange={e => setProfile(p => ({ ...p, farmName: e.target.value }))}
                  placeholder="e.g. Emeka Farms"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State</label>
              <select
                value={profile.state}
                onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Select your state</option>
                {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Setup →'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          Already registered?{' '}
          <Link href="/auth" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
