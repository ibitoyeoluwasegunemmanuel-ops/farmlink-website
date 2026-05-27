'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

const AFRICAN_COUNTRIES = [
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', digitCount: 10 },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭', digitCount: 9 },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪', digitCount: 9 },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', digitCount: 9 },
  { code: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹', digitCount: 9 },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿', digitCount: 9 },
  { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬', digitCount: 9 },
  { code: 'RW', name: 'Rwanda', dial: '+250', flag: '🇷🇼', digitCount: 9 },
  { code: 'CM', name: 'Cameroon', dial: '+237', flag: '🇨🇲', digitCount: 9 },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225', flag: '🇨🇮', digitCount: 10 },
  { code: 'SN', name: 'Senegal', dial: '+221', flag: '🇸🇳', digitCount: 9 },
  { code: 'ZM', name: 'Zambia', dial: '+260', flag: '🇿🇲', digitCount: 9 },
  { code: 'ZW', name: 'Zimbabwe', dial: '+263', flag: '🇿🇼', digitCount: 9 },
  { code: 'MZ', name: 'Mozambique', dial: '+258', flag: '🇲🇿', digitCount: 9 },
  { code: 'MG', name: 'Madagascar', dial: '+261', flag: '🇲🇬', digitCount: 9 },
  { code: 'AO', name: 'Angola', dial: '+244', flag: '🇦🇴', digitCount: 9 },
  { code: 'CD', name: 'DR Congo', dial: '+243', flag: '🇨🇩', digitCount: 9 },
  { code: 'CG', name: 'Republic of Congo', dial: '+242', flag: '🇨🇬', digitCount: 9 },
  { code: 'GA', name: 'Gabon', dial: '+241', flag: '🇬🇦', digitCount: 8 },
  { code: 'GQ', name: 'Equatorial Guinea', dial: '+240', flag: '🇬🇶', digitCount: 9 },
  { code: 'CF', name: 'Central African Republic', dial: '+236', flag: '🇨🇫', digitCount: 8 },
  { code: 'TD', name: 'Chad', dial: '+235', flag: '🇹🇩', digitCount: 8 },
  { code: 'SD', name: 'Sudan', dial: '+249', flag: '🇸🇩', digitCount: 9 },
  { code: 'SS', name: 'South Sudan', dial: '+211', flag: '🇸🇸', digitCount: 9 },
  { code: 'ER', name: 'Eritrea', dial: '+291', flag: '🇪🇷', digitCount: 7 },
  { code: 'DJ', name: 'Djibouti', dial: '+253', flag: '🇩🇯', digitCount: 8 },
  { code: 'SO', name: 'Somalia', dial: '+252', flag: '🇸🇴', digitCount: 8 },
  { code: 'MW', name: 'Malawi', dial: '+265', flag: '🇲🇼', digitCount: 9 },
  { code: 'BW', name: 'Botswana', dial: '+267', flag: '🇧🇼', digitCount: 8 },
  { code: 'NA', name: 'Namibia', dial: '+264', flag: '🇳🇦', digitCount: 9 },
  { code: 'LS', name: 'Lesotho', dial: '+266', flag: '🇱🇸', digitCount: 8 },
  { code: 'SZ', name: 'Eswatini', dial: '+268', flag: '🇸🇿', digitCount: 8 },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪', digitCount: 8 },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱', digitCount: 8 },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫', digitCount: 8 },
  { code: 'GN', name: 'Guinea', dial: '+224', flag: '🇬🇳', digitCount: 9 },
  { code: 'SL', name: 'Sierra Leone', dial: '+232', flag: '🇸🇱', digitCount: 8 },
  { code: 'LR', name: 'Liberia', dial: '+231', flag: '🇱🇷', digitCount: 8 },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬', digitCount: 8 },
  { code: 'BJ', name: 'Benin', dial: '+229', flag: '🇧🇯', digitCount: 8 },
  { code: 'GW', name: 'Guinea-Bissau', dial: '+245', flag: '🇬🇼', digitCount: 7 },
  { code: 'CV', name: 'Cape Verde', dial: '+238', flag: '🇨🇻', digitCount: 7 },
  { code: 'ST', name: 'São Tomé and Príncipe', dial: '+239', flag: '🇸🇹', digitCount: 7 },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦', digitCount: 9 },
  { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿', digitCount: 9 },
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳', digitCount: 8 },
  { code: 'LY', name: 'Libya', dial: '+218', flag: '🇱🇾', digitCount: 9 },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬', digitCount: 10 },
  { code: 'MR', name: 'Mauritania', dial: '+222', flag: '🇲🇷', digitCount: 8 },
  { code: 'KM', name: 'Comoros', dial: '+269', flag: '🇰🇲', digitCount: 7 },
  { code: 'MU', name: 'Mauritius', dial: '+230', flag: '🇲🇺', digitCount: 8 },
  { code: 'SC', name: 'Seychelles', dial: '+248', flag: '🇸🇨', digitCount: 7 },
  { code: 'GM', name: 'Gambia', dial: '+220', flag: '🇬🇲', digitCount: 7 },
];

const AFRICAN_STATES: Record<string, string[]> = {
  NG: ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'],
  GH: ['Ashanti','Brong-Ahafo','Central','Eastern','Greater Accra','Northern','Upper East','Upper West','Volta','Western'],
  KE: ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Nyeri','Kakamega','Meru','Thika','Malindi'],
  ZA: ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'],
  ET: ['Addis Ababa','Oromia','Amhara','Tigray','SNNPR','Harari','Dire Dawa'],
  TZ: ['Dar es Salaam','Arusha','Mwanza','Mbeya','Dodoma','Tanga','Zanzibar'],
  UG: ['Central','Eastern','Northern','Western','Kampala'],
  RW: ['Kigali','Eastern','Western','Northern','Southern'],
  CM: ['Littoral','Centre','Adamawa','Far North','East','North','Northwest','South','Southwest','West'],
  CI: ['Abidjan','Bouaké','Daloa','Korhogo','Man','San-Pédro'],
  SN: ['Dakar','Thiès','Diourbel','Fatick','Kaolack','Kolda','Louga','Matam','Saint-Louis','Tambacounda'],
  ZM: ['Lusaka','Copperbelt','Eastern','Luapula','Northern','North-Western','Southern','Western','Muchinga'],
  ZW: ['Harare','Bulawayo','Manicaland','Mashonaland Central','Mashonaland East','Mashonaland West','Masvingo','Matabeleland North','Matabeleland South','Midlands'],
  MZ: ['Cabo Delgado','Gaza','Inhambane','Manica','Maputo','Nampula','Niassa','Sofala','Tete','Zambézia'],
  MG: ['Analamanga','Atsimo-Andrefana','Diana','Haute Matsiatra','Itasy','Sofia','Vatovavy-Fitovinany'],
  AO: ['Bengo','Benguela','Bié','Cabinda','Cuando Cubango','Cunene','Huambo','Huíla','Luanda','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire'],
  CD: ['Kinshasa','Katanga','Équateur','Orientale','Kasaï-Occidental','Kasaï-Oriental','Maniema','Nord-Kivu','Sud-Kivu','Bas-Congo','Bandundu'],
  CG: ['Brazzaville','Pointe-Noire','Bouenza','Cuvette','Lékoumou','Likouala','Niari','Plateaux','Pool','Sangha'],
  MA: ['Casablanca-Settat','Rabat-Salé-Kénitra','Fès-Meknès','Marrakech-Safi','Souss-Massa','Tanger-Tétouan-Al Hoceïma','Drâa-Tafilalet','Béni Mellal-Khénifra','Oriental','Guelmim-Oued Noun','Laâyoune-Sakia El Hamra','Dakhla-Oued Ed-Dahab'],
  DZ: ['Adrar','Chlef','Laghouat','Oum el Bouaghi','Batna','Béjaïa','Biskra','Alger','Annaba','Constantine','Oran','Sétif','Tlemcen'],
  TN: ['Ariana','Béja','Ben Arous','Bizerte','Gabès','Gafsa','Jendouba','Kairouan','Kasserine','Kébili','Kef','Mahdia','Manouba','Médenine','Monastir','Nabeul','Sfax','Sidi Bouzid','Siliana','Sousse','Tataouine','Tozeur','Tunis','Zaghouan'],
  LY: ['Tripoli','Benghazi','Misrata','Zawiya','Zliten','Sirte','Sabha','Al Kufra'],
  EG: ['Cairo','Alexandria','Giza','Shubra El-Kheima','Port Said','Suez','Luxor','Asyut','Al Mansoura','Tanta','Ismailia','Faiyum','Zagazig','Damietta','Aswan','Minya','Damanhur','Al Minya','Beni Suef','Qena'],
  SD: ['Khartoum','Omdurman','Kassala','Port Sudan','Wad Madani','El Obeid','Al Fasher','Gedaref'],
  SS: ['Juba','Wau','Malakal','Yei','Aweil','Torit','Bor'],
  GA: ['Estuaire','Haut-Ogooué','Moyen-Ogooué','Ngounié','Nyanga','Ogooué-Ivindo','Ogooué-Lolo','Ogooué-Maritime','Woleu-Ntem'],
  BW: ['Central','Ghanzi','Kgalagadi','Kgatleng','Kweneng','North East','North West','South East','Southern'],
  NA: ['Erongo','Hardap','Karas','Kavango East','Kavango West','Khomas','Kunene','Ohangwena','Omaheke','Omusati','Oshana','Oshikoto','Otjozondjupa','Zambezi'],
  MW: ['Central Region','Northern Region','Southern Region'],
  NE: ['Agadez','Diffa','Dosso','Maradi','Niamey','Tahoua','Tillabéri','Zinder'],
  ML: ['Bamako','Gao','Kayes','Kidal','Koulikoro','Mopti','Ségou','Sikasso','Tombouctou'],
  BF: ['Boucle du Mouhoun','Cascades','Centre','Centre-Est','Centre-Nord','Centre-Ouest','Centre-Sud','Est','Hauts-Bassins','Nord','Plateau-Central','Sahel','Sud-Ouest'],
  GN: ['Conakry','Boké','Faranah','Kankan','Kindia','Labé','Mamou','Nzérékoré'],
  SL: ['Eastern Province','Northern Province','Southern Province','Western Area'],
  LR: ['Bomi','Bong','Gbarpolu','Grand Bassa','Grand Cape Mount','Grand Gedeh','Grand Kru','Lofa','Margibi','Maryland','Montserrado','Nimba','River Cess','River Gee','Sinoe'],
  TG: ['Centrale','Kara','Maritime','Plateaux','Savanes'],
  BJ: ['Alibori','Atacora','Atlantique','Borgou','Collines','Donga','Kouffo','Littoral','Mono','Ouémé','Plateau','Zou'],
  GW: [],
  CV: [],
  ST: [],
  GQ: [],
  CF: [],
  TD: [],
  ER: [],
  DJ: [],
  SO: [],
  LS: [],
  SZ: [],
  MR: [],
  KM: [],
  MU: [],
  SC: [],
  GM: [],
};

type Step = 'phone' | 'otp' | 'profile';

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get('role') || 'buyer';
  const { sendOTP, verifyOTP, setupProfile } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [country, setCountry] = useState(AFRICAN_COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [profile, setProfile] = useState({ fullName: '', state: '', farmName: '', country: 'NG' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleLabel: Record<string, string> = {
    farmer: 'Farmer', buyer: 'Buyer / Trader', transporter: 'Transporter',
    equipment: 'Equipment Owner', investor: 'Investor',
  };

  const getFullPhone = () => {
    const stripped = phone.replace(/^0/, '');
    return country.dial + stripped;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '').replace(/^0/, '');
    if (digits.length < 7) {
      setError(`Enter a valid phone number for ${country.name}`);
      return;
    }
    setLoading(true);
    try {
      const res = await sendOTP(getFullPhone()) as any;
      if (res.success) {
        if (res.userId) setUserId(res.userId);
        if (res._demo) setIsDemo(true);
        localStorage.setItem('fl_pending_role', role);
        setStep('otp');
      } else {
        setError('Could not send code. Check your number and try again.');
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
    try {
      const res = await verifyOTP(getFullPhone(), otp);
      if (res.success) {
        if (res.userId) setUserId(res.userId);
        if (res.isNewUser) {
          if (res.token) localStorage.setItem('fl_pending_token', res.token);
          setStep('profile');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError('Invalid code. Please check and try again.');
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
      const ok = await setupProfile(userId, { ...profile, role: role as any, country: country.code } as any);
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

  const stateList = AFRICAN_STATES[country.code] || [];

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(31,168,69,0.1) 0%, transparent 70%)' }} />

      <div className="relative bg-white rounded-3xl shadow-elevated p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
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
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s ? 'bg-brand-600 text-white' :
                  (['phone', 'otp', 'profile'].indexOf(s) < ['phone', 'otp', 'profile'].indexOf(step) ? 'bg-brand-200 text-brand-700' : 'bg-gray-100 text-gray-400')
                }`}>{i + 1}</div>
                {i < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-black text-ink mt-4">
            {step === 'phone' ? 'Enter your phone number' : step === 'otp' ? 'Enter verification code' : 'Complete your profile'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 'phone' ? 'Available across Africa — select your country' :
             step === 'otp' ? `Code sent to ${country.dial} ${phone}` :
             'Almost done! Tell us about yourself.'}
          </p>
        </div>

        {/* Demo mode notice */}
        {isDemo && step === 'otp' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl mb-4">
            <p className="font-bold mb-0.5">Demo Mode Active</p>
            <p className="text-xs">Backend not connected. Enter any 4–6 digit code to continue.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <span>⚠️</span>{error}
          </div>
        )}

        {/* ── STEP 1: Phone ── */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Country</label>
              <div className="relative">
                <button type="button" onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-brand-400 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                    <span className="text-gray-400">{country.dial}</span>
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCountryPicker && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-elevated z-20 max-h-52 overflow-y-auto">
                    {AFRICAN_COUNTRIES.map(c => (
                      <button key={c.code} type="button"
                        onClick={() => { setCountry(c); setShowCountryPicker(false); setProfile(p => ({ ...p, country: c.code })); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-brand-50 transition-colors text-left ${country.code === c.code ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-700'}`}>
                        <span className="text-lg">{c.flag}</span>
                        <span className="flex-1">{c.name}</span>
                        <span className="text-gray-400">{c.dial}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
              <div className="flex">
                <div className="bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl px-4 flex items-center text-sm text-gray-600 font-semibold flex-shrink-0 gap-1.5">
                  <span>{country.flag}</span>
                  <span>{country.dial}</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={country.code === 'NG' ? '08012345678' : '712345678'}
                  className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter your local number (with or without leading 0)</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Send Verification Code →'}
            </button>
            <p className="text-center text-gray-400 text-xs">By continuing, you agree to FarmLink&apos;s Terms and Privacy Policy</p>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isDemo ? 'Enter any 4–6 digit code' : '6-Digit Verification Code'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
              {isDemo && (
                <p className="text-xs text-amber-600 mt-1 text-center">Try: 1234 or 123456</p>
              )}
            </div>
            <button type="submit" disabled={loading || otp.length < 4}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Code →'}
            </button>
            <button type="button" onClick={() => { setStep('phone'); setOtp(''); setIsDemo(false); }}
              className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors">
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                State / Region
              </label>
              {stateList.length > 0 ? (
                <select
                  value={profile.state}
                  onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">Select your state/region</option>
                  {stateList.map(s => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={profile.state}
                  onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                  placeholder="Your state or region"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              )}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
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
