'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'ha' | 'yo' | 'ig' | 'fr';

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

export const LANG_OPTIONS: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ha', label: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', label: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', label: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
];
