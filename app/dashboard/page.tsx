'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardRouter() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/auth'); return; }
    const role = user?.role;
    if (role === 'farmer') router.replace('/dashboard/farmer');
    else if (role === 'transporter') router.replace('/dashboard/transporter');
    else if (role === 'equipment_owner') router.replace('/dashboard/equipment');
    else if (role === 'investor') router.replace('/dashboard/investor');
    else router.replace('/dashboard/buyer');
  }, [user, isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
