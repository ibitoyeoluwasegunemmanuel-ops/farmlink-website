'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type ShipmentStatus = 'pending' | 'picked_up' | 'in_transit' | 'at_hub' | 'out_for_delivery' | 'delivered' | 'returned';
type Tab = 'overview' | 'create' | 'track' | 'fleet' | 'partners';
type CreateStep = 1 | 2 | 3 | 4 | 5;

interface Shipment {
  id: string;
  trackingId: string;
  from: string;
  to: string;
  cargo: string;
  weight: string;
  status: ShipmentStatus;
  driver: string;
  vehicle: string;
  plateNo: string;
  eta: string;
  createdAt: string;
  amount: number;
  updates: { time: string; location: string; note: string }[];
  lat: number;
  lng: number;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  coverage: string[];
  rating: number;
  trips: number;
  pricePerKg: number;
  deliveryDays: string;
  verified: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SHIPMENTS: Shipment[] = [
  {
    id: 's1', trackingId: 'FL-2024-8821', from: 'Ibadan, Oyo', to: 'Lagos Island, Lagos',
    cargo: 'Fresh Tomatoes', weight: '500 kg', status: 'in_transit', driver: 'Chukwuemeka Obi',
    vehicle: 'Isuzu Truck', plateNo: 'LND-421-XK', eta: 'Today, 4:00 PM',
    createdAt: '2026-05-28', amount: 18500,
    updates: [
      { time: '08:00 AM', location: 'Ibadan Farm Gate', note: 'Cargo picked up, loading complete' },
      { time: '09:30 AM', location: 'Ibadan Toll Gate', note: 'Departed Ibadan' },
      { time: '11:15 AM', location: 'Sagamu Interchange', note: 'Checkpoint cleared' },
      { time: '12:40 PM', location: 'Lekki-Epe Expressway', note: 'En route to delivery' },
    ],
    lat: 6.45, lng: 3.39
  },
  {
    id: 's2', trackingId: 'FL-2024-7734', from: 'Kano, Kano', to: 'Abuja, FCT',
    cargo: 'Onions (Red)', weight: '1.2 tonnes', status: 'at_hub', driver: 'Ibrahim Yusuf',
    vehicle: 'DAF Truck', plateNo: 'KN-123-KA', eta: 'Tomorrow, 10:00 AM',
    createdAt: '2026-05-27', amount: 32000,
    updates: [
      { time: 'Yesterday 6:00 PM', location: 'Kano Farm', note: 'Cargo loaded' },
      { time: 'Yesterday 8:30 PM', location: 'Kano Outskirts', note: 'Departed Kano' },
      { time: 'Today 2:00 AM', location: 'Kaduna Hub', note: 'Arrived at transit hub — overnight rest' },
    ],
    lat: 10.52, lng: 7.44
  },
  {
    id: 's3', trackingId: 'FL-2024-6619', from: 'Enugu, Enugu', to: 'Portharcourt, Rivers',
    cargo: 'Cassava Flour', weight: '800 kg', status: 'delivered', driver: 'Nnamdi Chukwu',
    vehicle: 'Mitsubishi Canter', plateNo: 'EN-556-BD', eta: 'Delivered',
    createdAt: '2026-05-25', amount: 22000,
    updates: [
      { time: 'May 25, 7:00 AM', location: 'Enugu', note: 'Cargo picked up' },
      { time: 'May 25, 2:00 PM', location: 'Aba Junction', note: 'Checkpoint cleared' },
      { time: 'May 25, 5:30 PM', location: 'Port Harcourt', note: 'Delivered successfully ✓' },
    ],
    lat: 4.81, lng: 7.05
  },
];

const PARTNERS: Partner[] = [
  { id: 'p1', name: 'SwiftCargo Nigeria', logo: '🚛', coverage: ['Lagos', 'Abuja', 'PH', 'Ibadan', 'Kano'], rating: 4.8, trips: 2341, pricePerKg: 35, deliveryDays: '1-2 days', verified: true },
  { id: 'p2', name: 'AgroExpress Logistics', logo: '🌾', coverage: ['All Nigeria', 'Ghana', 'Benin'], rating: 4.6, trips: 1188, pricePerKg: 28, deliveryDays: '2-3 days', verified: true },
  { id: 'p3', name: 'FarmFreight Ltd', logo: '🚜', coverage: ['North Nigeria', 'Middle Belt'], rating: 4.5, trips: 876, pricePerKg: 22, deliveryDays: '3-4 days', verified: true },
  { id: 'p4', name: 'QuickHaul Africa', logo: '⚡', coverage: ['West Africa', '5 countries'], rating: 4.7, trips: 3102, pricePerKg: 42, deliveryDays: 'Same day', verified: true },
  { id: 'p5', name: 'GreenRoute Transport', logo: '🌿', coverage: ['South West Nigeria'], rating: 4.4, trips: 543, pricePerKg: 30, deliveryDays: '1-3 days', verified: false },
  { id: 'p6', name: 'SahelHaul', logo: '🐪', coverage: ['North Nigeria', 'Niger', 'Chad'], rating: 4.3, trips: 412, pricePerKg: 18, deliveryDays: '4-5 days', verified: false },
];

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  picked_up: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-brand-100 text-brand-700',
  at_hub: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  returned: 'bg-red-100 text-red-800',
};
const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: 'Pending', picked_up: 'Picked Up', in_transit: 'In Transit',
  at_hub: 'At Hub', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', returned: 'Returned',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Map Simulation (pure CSS) ─────────────────────────────────────────────────
function LiveMapSim({ shipment }: { shipment: Shipment }) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 3), 1000);
    return () => clearInterval(t);
  }, []);

  const routePoints = [
    { x: 10, y: 70, label: 'Origin', done: true },
    { x: 28, y: 55, label: 'Checkpoint 1', done: true },
    { x: 50, y: 40, label: 'En Route', done: shipment.status === 'in_transit' || shipment.status === 'delivered' },
    { x: 72, y: 30, label: 'Near Dest', done: shipment.status === 'out_for_delivery' || shipment.status === 'delivered' },
    { x: 90, y: 20, label: 'Destination', done: shipment.status === 'delivered' },
  ];

  // Truck position
  const truckIdx = shipment.status === 'delivered' ? 4 : shipment.status === 'out_for_delivery' ? 3 : shipment.status === 'in_transit' ? 2 : 1;
  const truck = routePoints[truckIdx];

  return (
    <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl h-52 overflow-hidden border border-gray-100">
      {/* Grid lines */}
      {[20, 40, 60, 80].map(x => (
        <div key={x} className="absolute top-0 bottom-0 border-l border-green-100 opacity-50" style={{ left: `${x}%` }} />
      ))}
      {[25, 50, 75].map(y => (
        <div key={y} className="absolute left-0 right-0 border-t border-green-100 opacity-50" style={{ top: `${y}%` }} />
      ))}

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <polyline
          points={routePoints.map(p => `${p.x}% ${p.y}%`).join(' ')}
          fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 3"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
        {/* Completed route */}
        <polyline
          points={routePoints.slice(0, truckIdx + 1).map(p => `${p.x}% ${p.y}%`).join(' ')}
          fill="none" stroke="#15803d" strokeWidth="3"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
      </svg>

      {/* Route points */}
      {routePoints.map((pt, i) => (
        <div key={i} className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
          <div className={`w-3 h-3 rounded-full border-2 border-white shadow ${pt.done ? 'bg-green-600' : 'bg-gray-300'}`} />
        </div>
      ))}

      {/* Truck icon */}
      <div className="absolute z-20 -translate-x-1/2 -translate-y-full"
        style={{ left: `${truck.x}%`, top: `${truck.y}%` }}>
        <div className="relative">
          {shipment.status !== 'delivered' && (
            <div className={`absolute -inset-2 rounded-full bg-brand-400 opacity-${pulse === 0 ? '60' : pulse === 1 ? '30' : '10'} transition-opacity duration-1000`} />
          )}
          <div className="text-2xl">🚛</div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-3 z-10">
        <p className="text-xs font-semibold text-green-800">{shipment.from.split(',')[0]}</p>
      </div>
      <div className="absolute top-2 right-3 z-10">
        <p className="text-xs font-semibold text-green-800">{shipment.to.split(',')[0]}</p>
      </div>

      {/* ETA badge */}
      <div className="absolute bottom-2 right-3 bg-white rounded-xl px-3 py-1 shadow z-10">
        <p className="text-xs text-gray-500">ETA</p>
        <p className="text-xs font-bold text-brand-700">{shipment.eta}</p>
      </div>
    </div>
  );
}

// ─── Tab: Overview ─────────────────────────────────────────────────────────────
function OverviewTab({ shipments, onTrack, onCreate }: { shipments: Shipment[]; onTrack: (s: Shipment) => void; onCreate: () => void }) {
  const active = shipments.filter(s => s.status !== 'delivered' && s.status !== 'returned');
  const delivered = shipments.filter(s => s.status === 'delivered');

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="🚚" label="Active Shipments" value={String(active.length)} sub="right now" />
        <StatCard icon="✅" label="Delivered" value={String(delivered.length)} sub="this month" />
        <StatCard icon="⭐" label="On-Time Rate" value="96%" sub="last 30 days" />
        <StatCard icon="💰" label="Total Freight" value="₦72,500" sub="this month" />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '📦', label: 'Create Shipment', action: onCreate },
            { icon: '🔍', label: 'Track Package', action: () => {} },
            { icon: '🤝', label: 'Book a Driver', link: '/transport' },
            { icon: '📊', label: 'View Reports', action: () => {} },
          ].map((qa, i) => (
            qa.link
              ? <Link key={i} href={qa.link} className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 hover:border-brand-300 hover:shadow-sm transition text-center">
                  <span className="text-3xl">{qa.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{qa.label}</span>
                </Link>
              : <button key={i} onClick={qa.action} className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 hover:border-brand-300 hover:shadow-sm transition text-center">
                  <span className="text-3xl">{qa.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{qa.label}</span>
                </button>
          ))}
        </div>
      </div>

      {/* Active shipments */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Active Shipments</h3>
        <div className="space-y-3">
          {active.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{s.trackingId}</p>
                  <p className="text-xs text-gray-500">{s.cargo} · {s.weight}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <span className="font-medium">{s.from}</span>
                <span>→</span>
                <span className="font-medium">{s.to}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🚛 {s.driver} · {s.plateNo}</span>
                <span>ETA: <strong className="text-brand-700">{s.eta}</strong></span>
              </div>
              <button onClick={() => onTrack(s)}
                className="mt-3 w-full bg-brand-50 text-brand-700 text-xs font-semibold py-2 rounded-xl hover:bg-brand-100 transition">
                Live Track →
              </button>
            </div>
          ))}
          {active.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">📦</p>
              <p>No active shipments. <button onClick={onCreate} className="text-brand-600 underline">Create one →</button></p>
            </div>
          )}
        </div>
      </div>

      {/* Recent history */}
      {delivered.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Recent Deliveries</h3>
          <div className="space-y-2">
            {delivered.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">✅</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.cargo}</p>
                  <p className="text-xs text-gray-500">{s.from} → {s.to} · {s.createdAt}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">₦{s.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Create Shipment ──────────────────────────────────────────────────────
function CreateTab({ onCreated }: { onCreated: () => void }) {
  const [step, setStep] = useState<CreateStep>(1);
  const [form, setForm] = useState({
    fromCity: '', fromAddress: '', toCity: '', toAddress: '',
    cargo: '', weight: '', unit: 'kg', fragile: false, refrigerated: false,
    vehicleType: '', partnerId: '',
    pickupDate: '', deliveryNote: '',
    senderName: '', senderPhone: '', recipientName: '', recipientPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const estimatedCost = form.weight ? Math.round(Number(form.weight) * (form.vehicleType === 'bike' ? 12 : form.vehicleType === 'van' ? 25 : 35)) : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setDone(true);
  };

  if (done) return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Created!</h2>
      <p className="text-gray-500 mb-1">Tracking ID: <strong className="text-brand-700">FL-2024-{Math.floor(Math.random() * 9000 + 1000)}</strong></p>
      <p className="text-sm text-gray-400 mb-6">A driver will be assigned shortly. You&apos;ll get an SMS confirmation.</p>
      <button onClick={onCreated} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-700 transition">
        View Dashboard
      </button>
    </div>
  );

  const steps = ['Route', 'Cargo', 'Vehicle', 'Contact', 'Review'];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
              ${i + 1 < step ? 'bg-brand-600 text-white' : i + 1 === step ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-brand-700 font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i + 1 < step ? 'bg-brand-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Route */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Pickup & Delivery Route</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">📍 Pickup City *</label>
            <input value={form.fromCity} onChange={e => set('fromCity', e.target.value)}
              placeholder="e.g. Ibadan, Oyo State"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">📍 Pickup Address</label>
            <input value={form.fromAddress} onChange={e => set('fromAddress', e.target.value)}
              placeholder="Street address / farm name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">🏁 Delivery City *</label>
            <input value={form.toCity} onChange={e => set('toCity', e.target.value)}
              placeholder="e.g. Lagos Island, Lagos"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">🏁 Delivery Address</label>
            <input value={form.toAddress} onChange={e => set('toAddress', e.target.value)}
              placeholder="Street address / market"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">📅 Pickup Date *</label>
            <input type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <button disabled={!form.fromCity || !form.toCity || !form.pickupDate}
            onClick={() => setStep(2)}
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Cargo */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Cargo Details</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">📦 Cargo Type *</label>
            <select value={form.cargo} onChange={e => set('cargo', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
              <option value="">Select cargo type</option>
              {['Fresh Vegetables', 'Fresh Fruits', 'Grains & Cereals', 'Livestock', 'Processed Food', 'Farm Equipment', 'Fertilizers & Inputs', 'Seedlings', 'Poultry & Eggs', 'Fish & Seafood', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">⚖️ Weight *</label>
              <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
                placeholder="e.g. 500"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Unit</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="kg">kg</option>
                <option value="tonnes">tonnes</option>
                <option value="bags">bags</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.fragile} onChange={e => set('fragile', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600" />
              <span className="text-sm text-gray-700">🥚 Fragile cargo (extra care required)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.refrigerated} onChange={e => set('refrigerated', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600" />
              <span className="text-sm text-gray-700">🧊 Refrigeration required</span>
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">📝 Special Instructions</label>
            <textarea value={form.deliveryNote} onChange={e => set('deliveryNote', e.target.value)}
              placeholder="Any notes for the driver..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">← Back</button>
            <button disabled={!form.cargo || !form.weight} onClick={() => setStep(3)} className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-40">Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3: Vehicle */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Choose Vehicle Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'bike', icon: '🛵', label: 'Bike / Courier', cap: 'Up to 50kg', note: 'Fastest' },
              { key: 'van', icon: '🚐', label: 'Van / Mini Truck', cap: '50–500kg', note: 'City runs' },
              { key: 'truck', icon: '🚛', label: 'Large Truck', cap: '500kg+', note: 'Bulk/Interstate' },
            ].map(v => (
              <button key={v.key} onClick={() => set('vehicleType', v.key)}
                className={`p-4 rounded-2xl border-2 text-center transition ${form.vehicleType === v.key ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
                <div className="text-3xl mb-1">{v.icon}</div>
                <p className="text-xs font-bold text-gray-800">{v.label}</p>
                <p className="text-xs text-gray-500">{v.cap}</p>
                <span className="text-xs text-brand-600 font-medium">{v.note}</span>
              </button>
            ))}
          </div>
          {form.weight && form.vehicleType && (
            <div className="bg-brand-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Estimated freight cost</p>
              <p className="text-2xl font-bold text-brand-700">₦{estimatedCost.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Based on {form.weight} {form.unit} · Final price may vary</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">← Back</button>
            <button disabled={!form.vehicleType} onClick={() => setStep(4)} className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-40">Continue →</button>
          </div>
        </div>
      )}

      {/* Step 4: Contact */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Sender & Recipient Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><p className="text-sm font-bold text-gray-700 mb-2">📤 Sender</p></div>
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input value={form.senderName} onChange={e => set('senderName', e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Phone</label>
              <input value={form.senderPhone} onChange={e => set('senderPhone', e.target.value)}
                placeholder="+234..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mt-1" />
            </div>
            <div className="col-span-2 pt-2"><p className="text-sm font-bold text-gray-700 mb-2">📥 Recipient</p></div>
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input value={form.recipientName} onChange={e => set('recipientName', e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Phone</label>
              <input value={form.recipientPhone} onChange={e => set('recipientPhone', e.target.value)}
                placeholder="+234..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 mt-1" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">← Back</button>
            <button onClick={() => setStep(5)} className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition">Review →</button>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Review & Confirm</h3>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
            <Row label="Route" value={`${form.fromCity} → ${form.toCity}`} />
            <Row label="Pickup Date" value={form.pickupDate} />
            <Row label="Cargo" value={`${form.cargo} · ${form.weight} ${form.unit}`} />
            <Row label="Vehicle" value={{ bike: '🛵 Bike/Courier', van: '🚐 Van', truck: '🚛 Large Truck' }[form.vehicleType] || ''} />
            <Row label="Sender" value={`${form.senderName} · ${form.senderPhone}`} />
            <Row label="Recipient" value={`${form.recipientName} · ${form.recipientPhone}`} />
            {form.deliveryNote && <Row label="Note" value={form.deliveryNote} />}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Estimated Cost</span>
                <span className="font-bold text-brand-700 text-lg">₦{estimatedCost.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Paid to driver after delivery confirmation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(4)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">← Back</button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-60">
              {submitting ? 'Creating...' : '🚀 Confirm Shipment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

// ─── Tab: Track ────────────────────────────────────────────────────────────────
function TrackTab({ initial }: { initial: Shipment | null }) {
  const [query, setQuery] = useState(initial?.trackingId ?? '');
  const [found, setFound] = useState<Shipment | null>(initial);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async () => {
    setSearching(true);
    setNotFound(false);
    await new Promise(r => setTimeout(r, 800));
    const result = SHIPMENTS.find(s => s.trackingId.toLowerCase() === query.toLowerCase());
    setFound(result ?? null);
    setNotFound(!result);
    setSearching(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Shipment</h3>
        <div className="flex gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Enter tracking ID (e.g. FL-2024-8821)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <button onClick={search} disabled={!query || searching}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition text-sm disabled:opacity-40">
            {searching ? '...' : 'Track'}
          </button>
        </div>
        {notFound && <p className="text-sm text-red-500 mt-2">No shipment found with that tracking ID.</p>}
      </div>

      {found && (
        <div className="space-y-5">
          {/* Map */}
          <LiveMapSim shipment={found} />

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">Tracking ID</p>
                <p className="font-bold text-gray-900">{found.trackingId}</p>
              </div>
              <StatusBadge status={found.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div><p className="text-xs text-gray-400">Cargo</p><p className="font-medium">{found.cargo} · {found.weight}</p></div>
              <div><p className="text-xs text-gray-400">ETA</p><p className="font-medium text-brand-700">{found.eta}</p></div>
              <div><p className="text-xs text-gray-400">Driver</p><p className="font-medium">{found.driver}</p></div>
              <div><p className="text-xs text-gray-400">Vehicle</p><p className="font-medium">{found.vehicle} · {found.plateNo}</p></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <span>📍 {found.from}</span>
              <span className="text-gray-400">→</span>
              <span>🏁 {found.to}</span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Shipment Timeline</h4>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
              {found.updates.map((u, i) => (
                <div key={i} className="relative mb-4">
                  <div className={`absolute -left-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ${i === found.updates.length - 1 ? 'bg-brand-600' : 'bg-green-500'}`} />
                  <p className="text-xs text-gray-400 mb-0.5">{u.time} · {u.location}</p>
                  <p className="text-sm font-medium text-gray-800">{u.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact driver button */}
          {found.status !== 'delivered' && found.status !== 'returned' && (
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold py-3 rounded-xl text-sm hover:bg-green-100 transition">
                📞 Call Driver
              </button>
              <button className="flex items-center justify-center gap-2 bg-brand-50 text-brand-700 font-semibold py-3 rounded-xl text-sm hover:bg-brand-100 transition">
                💬 WhatsApp Driver
              </button>
            </div>
          )}

          {found.status === 'delivered' && (
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-bold text-green-800">Delivered Successfully!</p>
              <p className="text-sm text-green-600">Your cargo has been received. Rate this delivery:</p>
              <div className="flex justify-center gap-1 mt-2 text-2xl">
                {[1,2,3,4,5].map(s => <button key={s} className="hover:scale-110 transition-transform">⭐</button>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sample IDs */}
      {!found && !notFound && (
        <div className="bg-brand-50 rounded-2xl p-4">
          <p className="text-sm font-semibold text-brand-700 mb-2">Try these demo IDs:</p>
          <div className="space-y-1">
            {SHIPMENTS.map(s => (
              <button key={s.id} onClick={() => { setQuery(s.trackingId); setFound(s); }}
                className="block text-sm text-brand-600 hover:underline">
                {s.trackingId} — {s.cargo} ({STATUS_LABELS[s.status]})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Fleet / Dashcam ──────────────────────────────────────────────────────
function FleetTab() {
  const [selected, setSelected] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'cam'>('map');

  const fleet = [
    { name: 'Chukwuemeka Obi', plate: 'LND-421-XK', vehicle: 'Isuzu Truck', status: 'moving', cargo: 'Tomatoes 500kg', speed: '72 km/h', location: 'Lagos–Ibadan Expressway', fuel: 68, temp: 28, cam: '🎥 Live — Exterior Front' },
    { name: 'Ibrahim Yusuf', plate: 'KN-123-KA', vehicle: 'DAF Truck', status: 'parked', cargo: 'Onions 1.2T', speed: '0 km/h', location: 'Kaduna Hub — Bay 3', fuel: 45, temp: 31, cam: '📷 Live — Cab Interior' },
    { name: 'Adaeze Okafor', plate: 'ABJ-009-FC', vehicle: 'Toyota Hilux', status: 'moving', cargo: 'Vegetables 200kg', speed: '55 km/h', location: 'Airport Road, Abuja', fuel: 82, temp: 26, cam: '🎥 Live — Cargo Bay' },
  ];
  const d = fleet[selected];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Fleet & Dashcam Monitor</h3>
        <p className="text-sm text-gray-500">Real-time vehicle tracking and camera feeds for your logistics fleet.</p>
      </div>

      {/* Fleet list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fleet.map((f, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`p-3 rounded-2xl border-2 text-left transition ${selected === i ? 'border-brand-500 bg-brand-50' : 'border-gray-100 bg-white hover:border-brand-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${f.status === 'moving' ? 'bg-green-500' : 'bg-yellow-400'}`} />
              <span className="text-xs font-bold text-gray-800 truncate">{f.name}</span>
            </div>
            <p className="text-xs text-gray-500">{f.vehicle} · {f.plate}</p>
            <p className="text-xs text-gray-600 mt-1 truncate">{f.location}</p>
          </button>
        ))}
      </div>

      {/* Live view toggle */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        <button onClick={() => setViewMode('map')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
          🗺️ Live Map
        </button>
        <button onClick={() => setViewMode('cam')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'cam' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
          📷 Dashcam
        </button>
      </div>

      {/* Map view */}
      {viewMode === 'map' && (
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl h-56 overflow-hidden">
          {/* Dark map simulation */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute border-slate-500 border" style={{
                left: `${(i * 13) % 100}%`, top: 0, bottom: 0, borderRight: '1px solid'
              }} />
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute border-slate-500 border" style={{
                top: `${i * 18}%`, left: 0, right: 0, borderBottom: '1px solid'
              }} />
            ))}
          </div>
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <line x1="0" y1="40%" x2="100%" y2="60%" stroke="#64748b" strokeWidth="4" />
            <line x1="20%" y1="0" x2="30%" y2="100%" stroke="#64748b" strokeWidth="3" />
            <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#64748b" strokeWidth="3" />
          </svg>
          {/* Truck markers */}
          {fleet.map((f, i) => (
            <div key={i} className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${selected === i ? 'z-20 scale-125' : 'z-10'}`}
              style={{ left: `${25 + i * 30}%`, top: `${35 + i * 15}%` }}>
              <div className={`text-2xl ${selected === i ? 'drop-shadow-lg' : 'opacity-70'}`}>
                {f.status === 'moving' ? '🚛' : '🅿️'}
              </div>
              {selected === i && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg px-2 py-1 text-xs font-bold text-gray-800 whitespace-nowrap shadow">
                  {f.speed}
                </div>
              )}
            </div>
          ))}
          {/* Info overlay */}
          <div className="absolute bottom-3 left-3 bg-black/60 rounded-xl px-3 py-2">
            <p className="text-white text-xs font-bold">{d.name}</p>
            <p className="text-gray-300 text-xs">{d.location}</p>
            <p className="text-green-400 text-xs">{d.speed}</p>
          </div>
        </div>
      )}

      {/* Dashcam view */}
      {viewMode === 'cam' && (
        <div className="relative bg-black rounded-2xl h-56 overflow-hidden border border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            {/* Simulated road view */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-gray-700 to-gray-600" />
              {/* Road lines */}
              {[-20, 0, 20].map((x, i) => (
                <div key={i} className="absolute bottom-0 border-l-2 border-dashed border-yellow-400 opacity-60"
                  style={{ left: `calc(50% + ${x}%)`, height: '50%', transform: `perspective(100px) rotateX(10deg)` }} />
              ))}
              {/* Trees */}
              <div className="absolute left-4 bottom-1/3 text-4xl">🌳</div>
              <div className="absolute right-4 bottom-1/3 text-4xl">🌳</div>
              <div className="absolute left-12 bottom-2/5 text-3xl opacity-60">🌿</div>
            </div>
          </div>
          {/* HUD overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-3 bg-black/70 rounded-lg px-2 py-1">
              <p className="text-green-400 text-xs font-mono">● REC {d.cam}</p>
            </div>
            <div className="absolute top-2 right-3 bg-black/70 rounded-lg px-2 py-1">
              <p className="text-white text-xs font-mono">{new Date().toLocaleTimeString()}</p>
            </div>
            <div className="absolute bottom-2 left-3 bg-black/70 rounded-lg px-3 py-1.5 space-y-0.5">
              <p className="text-white text-xs font-mono">SPD: {d.speed}</p>
              <p className="text-yellow-400 text-xs font-mono">GPS: {d.location}</p>
            </div>
            <div className="absolute bottom-2 right-3 bg-black/70 rounded-lg px-3 py-1.5 space-y-0.5">
              <p className="text-white text-xs font-mono">FUEL: {d.fuel}%</p>
              <p className="text-orange-400 text-xs font-mono">TEMP: {d.temp}°C</p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle stats */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-gray-900">{d.vehicle} · {d.plate}</p>
            <p className="text-xs text-gray-500">{d.cargo}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.status === 'moving' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {d.status === 'moving' ? '🟢 Moving' : '🟡 Parked'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">Fuel Level</p>
            <div className="mt-1 bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full ${d.fuel > 50 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${d.fuel}%` }} />
            </div>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{d.fuel}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Cargo Temp</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{d.temp}°C</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Speed</p>
            <p className="text-sm font-bold text-gray-800">{d.speed}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="text-xs font-medium text-gray-700">{d.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Partners ─────────────────────────────────────────────────────────────
function PartnersTab() {
  const [filter, setFilter] = useState('');
  const filtered = PARTNERS.filter(p => !filter || p.coverage.some(c => c.toLowerCase().includes(filter.toLowerCase())) || p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Logistics Partners</h3>
        <p className="text-sm text-gray-500">Verified freight and haulage partners across Africa</p>
      </div>
      <input value={filter} onChange={e => setFilter(e.target.value)}
        placeholder="Search by city, region, or partner name..."
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{p.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900">{p.name}</p>
                  {p.verified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>⭐ {p.rating}</span>
                  <span>·</span>
                  <span>{p.trips.toLocaleString()} trips</span>
                  <span>·</span>
                  <span>{p.deliveryDays}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.coverage.slice(0, 3).map(c => (
                    <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                  {p.coverage.length > 3 && <span className="text-xs text-gray-400">+{p.coverage.length - 3}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-brand-700">₦{p.pricePerKg}/kg</p>
                <button className="mt-2 text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition">Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LogisticsPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [trackTarget, setTrackTarget] = useState<Shipment | null>(null);

  const handleTrack = (s: Shipment) => {
    setTrackTarget(s);
    setTab('track');
  };
  const handleCreate = () => setTab('create');

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'create', icon: '📦', label: 'New Shipment' },
    { key: 'track', icon: '🔍', label: 'Track' },
    { key: 'fleet', icon: '📡', label: 'Fleet & Cams' },
    { key: 'partners', icon: '🤝', label: 'Partners' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pb-24">
        {/* Header */}
        <div className="pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Logistics</h1>
          <p className="text-gray-500 text-sm mt-1">Ship cargo, track deliveries, monitor your fleet</p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap
                ${tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
              <span>{t.icon}</span>
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'overview' && <OverviewTab shipments={SHIPMENTS} onTrack={handleTrack} onCreate={handleCreate} />}
        {tab === 'create' && <CreateTab onCreated={() => setTab('overview')} />}
        {tab === 'track' && <TrackTab initial={trackTarget} />}
        {tab === 'fleet' && <FleetTab />}
        {tab === 'partners' && <PartnersTab />}
      </main>
      <Footer />
    </div>
  );
}
