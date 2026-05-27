'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'equipment_owner' | 'investor';

export interface AuthUser {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  isVerified?: boolean;
  profileComplete?: boolean;
  state?: string;
  farmName?: string;
  bio?: string;
  rating?: number;
  totalTransactions?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; isNewUser?: boolean; userId?: string }>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean; userId?: string; token?: string }>;
  setupProfile: (userId: string, data: Partial<AuthUser>) => Promise<boolean>;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  refreshUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('fl_token');
      const storedUser = localStorage.getItem('fl_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // corrupted storage — clear it
      localStorage.removeItem('fl_token');
      localStorage.removeItem('fl_user');
    }
    setLoading(false);
  }, []);

  const sendOTP = async (phoneNumber: string) => {
    const res = await fetch(`${API}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, isNewUser: data.isNewUser, userId: data.userId };
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    const res = await fetch(`${API}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    const data = await res.json();
    if (data.token && data.user && !data.isNewUser) {
      login(data.user, data.token);
    }
    return {
      success: data.success ?? res.ok,
      isNewUser: data.isNewUser,
      userId: data.userId || data.user?.id,
      token: data.token,
    };
  };

  const setupProfile = async (userId: string, profileData: Partial<AuthUser>) => {
    const res = await fetch(`${API}/auth/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...profileData }),
    });
    if (!res.ok) return false;
    const profileRes = await fetch(`${API}/auth/profile/${userId}`);
    const profileJson = await profileRes.json();
    if (profileJson.user) {
      const pendingToken = localStorage.getItem('fl_pending_token') || '';
      login(profileJson.user, pendingToken);
      localStorage.removeItem('fl_pending_token');
    }
    return true;
  };

  const login = (authUser: AuthUser, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    localStorage.setItem('fl_token', authToken);
    localStorage.setItem('fl_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fl_token');
    localStorage.removeItem('fl_user');
  };

  const refreshUser = async (userId: string) => {
    try {
      const res = await fetch(`${API}/auth/profile/${userId}`);
      const data = await res.json();
      if (data.user) {
        const updated = { ...user, ...data.user };
        setUser(updated);
        localStorage.setItem('fl_user', JSON.stringify(updated));
      }
    } catch { /* silently fail */ }
  };

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated: !!user, loading,
      sendOTP, verifyOTP, setupProfile, login, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
