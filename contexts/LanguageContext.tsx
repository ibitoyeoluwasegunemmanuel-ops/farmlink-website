'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'ha' | 'yo' | 'ig' | 'fr' | 'sw' | 'ar' | 'am' | 'zu' | 'tw' | 'wo';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    marketplace: 'Marketplace', transport: 'Transport', equipment: 'Equipment',
    invest: 'Invest', land: 'Land', blog: 'Blog', orders: 'My Orders',
    dashboard: 'Dashboard', signIn: 'Sign In', getStarted: 'Get Started',
    search: 'Search', cart: 'Cart', notifications: 'Notifications',
    wallet: 'Wallet', profile: 'My Profile', messages: 'Messages',
    referral: 'Referral & Earn', signOut: 'Sign out',
    buyWithEscrow: 'Buy with Escrow', addToCart: 'Add to Cart',
    viewDetails: 'View Details', loading: 'Loading...', back: 'Back',
    continueBtn: 'Continue', submit: 'Submit', cancel: 'Cancel',
    save: 'Save Changes', saved: 'Saved!', welcome: 'Welcome',
    freshProduce: 'Fresh Produce', directFromFarm: 'Direct from farm',
  },
  ha: {
    marketplace: 'Kasuwa', transport: 'Sufuri', equipment: 'Kayan aiki',
    invest: 'Zuba jari', land: 'Ƙasa', blog: 'Labari', orders: 'Odiyana na',
    dashboard: 'Allon sarrafawa', signIn: 'Shiga', getStarted: 'Fara',
    search: 'Nema', cart: 'Kwando', notifications: 'Sanarwa',
    wallet: 'Walat', profile: 'Bayanan ni', messages: 'Saƙonni',
    referral: 'Kira abokai', signOut: 'Fita',
    buyWithEscrow: 'Saya da aminci', addToCart: 'Ƙara zuwa kwando',
    viewDetails: 'Duba cikakken bayani', loading: 'Ana loda...', back: 'Koma',
    continueBtn: 'Ci gaba', submit: 'Aika', cancel: 'Soke',
    save: 'Adana canje-canje', saved: 'An adana!', welcome: 'Barka da zuwa',
    freshProduce: 'Kayan lambu na fresh', directFromFarm: 'Kai tsaye daga gonar',
  },
  yo: {
    marketplace: 'Ọjà', transport: 'Gbigbe', equipment: 'Ohun elo',
    invest: 'Idoko-owó', land: 'Ilẹ̀', blog: 'Ìròyìn', orders: 'Àwọn àṣẹ mi',
    dashboard: 'Pánẹ́ẹ̀lì', signIn: 'Wọlé', getStarted: 'Bẹ̀rẹ̀',
    search: 'Wá', cart: 'Àgbọ̀n', notifications: 'Ìwífún',
    wallet: 'Àpamọ́wọ́', profile: 'Ìsọmọbáyẹ̀wí mi', messages: 'Àwọn ìfọ̀rọ̀wérọ̀',
    referral: 'Pe àwọn ọ̀rẹ́', signOut: 'Jáde',
    buyWithEscrow: 'Ra pẹ̀lú ààbò', addToCart: 'Fi sí àgbọ̀n',
    viewDetails: 'Wo àlàyé', loading: 'Ń kó...', back: 'Padà',
    continueBtn: 'Tẹ̀síwájú', submit: 'Fi sílẹ̀', cancel: 'Fagilé',
    save: 'Fi àyípadà pamọ́', saved: 'Ti fipamọ́!', welcome: 'Káàbọ̀',
    freshProduce: 'Èso tuntun', directFromFarm: 'Tààrà láti oko',
  },
  ig: {
    marketplace: 'Ahịa', transport: 'Nnyefe', equipment: 'Ngwá ọrụ',
    invest: 'Itinye ego', land: 'Ala', blog: 'Akụkọ ihe mere eme', orders: 'Ọrụ m',
    dashboard: 'Pẹnẹl njikwa', signIn: 'Banye', getStarted: 'Bido',
    search: 'Chọọ', cart: 'Ọkpọ', notifications: 'Ọkwa',
    wallet: 'Akpa ego', profile: 'Profaịlụ m', messages: 'Ozi',
    referral: 'Kpọọ ndị ọbịa', signOut: 'Pụọ',
    buyWithEscrow: 'Zụta nke nchedo', addToCart: 'Tinye n\'ọkpọ',
    viewDetails: 'Lee nkọwa', loading: 'Na-ebugharị...', back: 'Laghachi',
    continueBtn: 'Gaa n\'ihu', submit: 'Ziga', cancel: 'Kagbuo',
    save: 'Chekwaa mgbanwe', saved: 'Echekwara!', welcome: 'Nnọọ',
    freshProduce: 'Ihe ọkụkụ ọhụrụ', directFromFarm: 'Ozugbo site n\'ọhịa',
  },
  fr: {
    marketplace: 'Marché', transport: 'Transport', equipment: 'Équipement',
    invest: 'Investir', land: 'Terrain', blog: 'Blog', orders: 'Mes commandes',
    dashboard: 'Tableau de bord', signIn: 'Se connecter', getStarted: 'Commencer',
    search: 'Rechercher', cart: 'Panier', notifications: 'Notifications',
    wallet: 'Portefeuille', profile: 'Mon profil', messages: 'Messages',
    referral: 'Parrainage', signOut: 'Déconnexion',
    buyWithEscrow: 'Acheter en sécurité', addToCart: 'Ajouter au panier',
    viewDetails: 'Voir détails', loading: 'Chargement...', back: 'Retour',
    continueBtn: 'Continuer', submit: 'Soumettre', cancel: 'Annuler',
    save: 'Enregistrer', saved: 'Enregistré!', welcome: 'Bienvenue',
    freshProduce: 'Produits frais', directFromFarm: 'Directement de la ferme',
  },
  // East Africa — 200M+ speakers
  sw: {
    marketplace: 'Soko', transport: 'Usafiri', equipment: 'Vifaa',
    invest: 'Uwekezaji', land: 'Ardhi', blog: 'Blogu', orders: 'Maagizo yangu',
    dashboard: 'Dashibodi', signIn: 'Ingia', getStarted: 'Anza',
    search: 'Tafuta', cart: 'Kikapu', notifications: 'Arifa',
    wallet: 'Pochi', profile: 'Wasifu wangu', messages: 'Ujumbe',
    referral: 'Mwaliko wa rafiki', signOut: 'Toka',
    buyWithEscrow: 'Nunua kwa usalama', addToCart: 'Ongeza kwenye kikapu',
    viewDetails: 'Angalia maelezo', loading: 'Inapakia...', back: 'Rudi',
    continueBtn: 'Endelea', submit: 'Wasilisha', cancel: 'Ghairi',
    save: 'Hifadhi mabadiliko', saved: 'Imehifadhiwa!', welcome: 'Karibu',
    freshProduce: 'Mazao mapya', directFromFarm: 'Moja kwa moja kutoka shambani',
  },
  // North Africa
  ar: {
    marketplace: 'السوق', transport: 'النقل', equipment: 'المعدات',
    invest: 'الاستثمار', land: 'الأرض', blog: 'المدونة', orders: 'طلباتي',
    dashboard: 'لوحة التحكم', signIn: 'تسجيل الدخول', getStarted: 'ابدأ',
    search: 'بحث', cart: 'سلة التسوق', notifications: 'الإشعارات',
    wallet: 'المحفظة', profile: 'ملفي الشخصي', messages: 'الرسائل',
    referral: 'الإحالة', signOut: 'تسجيل الخروج',
    buyWithEscrow: 'شراء آمن', addToCart: 'أضف إلى السلة',
    viewDetails: 'عرض التفاصيل', loading: 'جاري التحميل...', back: 'رجوع',
    continueBtn: 'متابعة', submit: 'إرسال', cancel: 'إلغاء',
    save: 'حفظ التغييرات', saved: 'تم الحفظ!', welcome: 'مرحباً',
    freshProduce: 'منتجات طازجة', directFromFarm: 'مباشرة من المزرعة',
  },
  // Ethiopia
  am: {
    marketplace: 'ገበያ', transport: 'ትራንስፖርት', equipment: 'መሳሪያ',
    invest: 'ኢንቨስትመንት', land: 'መሬት', blog: 'ብሎግ', orders: 'ትዕዛዞቼ',
    dashboard: 'ዳሽቦርድ', signIn: 'ግባ', getStarted: 'ጀምር',
    search: 'ፈልግ', cart: 'ቅርጫት', notifications: 'ማሳወቂያ',
    wallet: 'ዋሌት', profile: 'መረጃዬ', messages: 'መልዕክቶች',
    referral: 'ጋብዝ', signOut: 'ውጣ',
    buyWithEscrow: 'ከደህንነት ጋር ይግዙ', addToCart: 'ወደ ቅርጫት ጨምር',
    viewDetails: 'ዝርዝሮቹን ይመልከቱ', loading: 'በመጫን ላይ...', back: 'ተመለስ',
    continueBtn: 'ቀጥል', submit: 'አስረክብ', cancel: 'ሰርዝ',
    save: 'ለውጦችን አስቀምጥ', saved: 'ተቀምጧል!', welcome: 'እንኳን ደህና መጡ',
    freshProduce: 'ትኩስ ምርቶች', directFromFarm: 'ቀጥታ ከእርሻ',
  },
  // South Africa
  zu: {
    marketplace: 'Imakethe', transport: 'Izithuthi', equipment: 'Izinto',
    invest: 'Ukutshala imali', land: 'Umhlaba', blog: 'Ibhulogi', orders: 'Izinto zami',
    dashboard: 'Ideshibhodi', signIn: 'Ngena', getStarted: 'Qala',
    search: 'Sesha', cart: 'Inkalo', notifications: 'Izaziso',
    wallet: 'Isikhwama', profile: 'Iphrofayili yami', messages: 'Imiyalezo',
    referral: 'Mema', signOut: 'Phuma',
    buyWithEscrow: 'Thenga ngokuphepha', addToCart: 'Engeza',
    viewDetails: 'Buka imininingwane', loading: 'Iyalayisha...', back: 'Buya',
    continueBtn: 'Qhubeka', submit: 'Thumela', cancel: 'Khansela',
    save: 'Gcina izinguquko', saved: 'Kugcinwe!', welcome: 'Wamukelekile',
    freshProduce: 'Izithelo ezintsha', directFromFarm: 'Ngokuqondile eplasini',
  },
  // Ghana
  tw: {
    marketplace: 'Dwam', transport: 'Kwan so kɔ', equipment: 'Adwuma nhyehyɛe',
    invest: 'Toɔ sika', land: 'Asaase', blog: 'Asɛnka', orders: 'Me adwuma',
    dashboard: 'Adwumadie', signIn: 'Wo bra', getStarted: 'Hyɛ ase',
    search: 'Hwehwɛ', cart: 'Kɛtɛ', notifications: 'Nhyɛso',
    wallet: 'Sikakyɛm', profile: 'Me ho asɛm', messages: 'Nkradie',
    referral: 'Frɛ wo nnamfonom', signOut: 'Pue',
    buyWithEscrow: 'Tɔ ne banbɔ', addToCart: 'Ka ho kɛtɛ mu',
    viewDetails: 'Hwɛ nsɛnkyerɛnne', loading: 'Ɛreload...', back: 'San kɔ',
    continueBtn: 'Tɔ so', submit: 'Soma', cancel: 'Gyae',
    save: 'Sie nsesa', saved: 'Asie!', welcome: 'Akwaaba',
    freshProduce: 'Afurow foforo', directFromFarm: 'Teeɛ afurow ho',
  },
  // West Africa (Senegal/Gambia)
  wo: {
    marketplace: 'Marché bi', transport: 'Transport bi', equipment: 'Jumtukaay yi',
    invest: 'Tëj', land: 'Dëkk bi', blog: 'Blog bi', orders: 'Commande yi',
    dashboard: 'Tableau bi', signIn: 'Dugg', getStarted: 'Jël',
    search: 'Seet', cart: 'Panier bi', notifications: 'Xam-xam yi',
    wallet: 'Portafey bi', profile: 'Sa profil', messages: 'Téere yi',
    referral: 'Yëgël say xarit', signOut: 'Génn',
    buyWithEscrow: 'Jënde ak sécurité', addToCart: 'Yégël ci panier bi',
    viewDetails: 'Xool détails yi', loading: 'Dafa jël...', back: 'Dellu',
    continueBtn: 'Dem', submit: 'Yónnee', cancel: 'Déglu',
    save: 'Musal', saved: 'Musaloo!', welcome: 'Dalal ak jamm',
    freshProduce: 'Légume yi', directFromFarm: 'Tee ci kaw kër gi',
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('fl_lang') as Lang | null;
    if (stored && TRANSLATIONS[stored]) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('fl_lang', l);
  };

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export const LANG_OPTIONS: { code: Lang; label: string; native: string; flag: string; region: string }[] = [
  { code: 'en', label: 'English',  native: 'English',     flag: '🇬🇧', region: 'Global' },
  { code: 'fr', label: 'French',   native: 'Français',    flag: '🇫🇷', region: 'West/Central' },
  { code: 'ar', label: 'Arabic',   native: 'العربية',     flag: '🇪🇬', region: 'North Africa' },
  { code: 'sw', label: 'Swahili',  native: 'Kiswahili',   flag: '🇹🇿', region: 'East Africa' },
  { code: 'am', label: 'Amharic',  native: 'አማርኛ',        flag: '🇪🇹', region: 'East Africa' },
  { code: 'zu', label: 'Zulu',     native: 'isiZulu',     flag: '🇿🇦', region: 'Southern' },
  { code: 'ha', label: 'Hausa',    native: 'Hausa',       flag: '🇳🇬', region: 'West Africa' },
  { code: 'yo', label: 'Yoruba',   native: 'Yorùbá',      flag: '🇳🇬', region: 'West Africa' },
  { code: 'ig', label: 'Igbo',     native: 'Igbo',        flag: '🇳🇬', region: 'West Africa' },
  { code: 'tw', label: 'Twi',      native: 'Twi (Akan)',  flag: '🇬🇭', region: 'West Africa' },
  { code: 'wo', label: 'Wolof',    native: 'Wolof',       flag: '🇸🇳', region: 'West Africa' },
];
