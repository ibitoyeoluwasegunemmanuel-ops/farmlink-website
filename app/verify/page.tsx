'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const ID_TYPES = [
  { id: 'nin',        label: 'NIN (National ID Number)', icon: '🪪', hint: '11-digit number on your NIN slip',           countries: ['Nigeria'] },
  { id: 'bvn',        label: 'BVN (Bank Verification)',  icon: '🏦', hint: '11-digit number linked to your bank',        countries: ['Nigeria'] },
  { id: 'voters',     label: "Voter's Card",             icon: '🗳️', hint: 'INEC-issued card with voter number',        countries: ['Nigeria', 'Ghana'] },
  { id: 'passport',   label: 'International Passport',   icon: '📘', hint: 'Biometric passport with photo page',         countries: ['All countries'] },
  { id: 'drivers',    label: "Driver's Licence",         icon: '🚗', hint: 'Valid national driver\'s licence',           countries: ['All countries'] },
  { id: 'ghana_card', label: 'Ghana Card',               icon: '🪪', hint: 'Ghana NIA national ID card',                 countries: ['Ghana'] },
  { id: 'national',   label: 'National ID Card',         icon: '🪪', hint: 'Government-issued national ID',              countries: ['Kenya', 'SA', 'Ethiopia', 'Others'] },
];

const ADDR_TYPES = [
  { id: 'utility',  label: 'Utility Bill',        icon: '💡', hint: 'NEPA/EKEDC/water bill — not older than 3 months' },
  { id: 'bank',     label: 'Bank Statement',      icon: '🏦', hint: 'Official statement with your address' },
  { id: 'tenancy',  label: 'Tenancy Agreement',   icon: '🏠', hint: 'Signed rent agreement with your address' },
  { id: 'govt',     label: 'Govt. Letter/Tax',    icon: '📜', hint: 'Official correspondence showing your address' },
];

const STEPS = [
  { label: 'Personal Info',   icon: '👤' },
  { label: 'ID Document',     icon: '🪪' },
  { label: 'Face Verify',     icon: '🤳' },
  { label: 'Proof of Address',icon: '🏠' },
  { label: 'Farm Evidence',   icon: '🌾' }, // farmers only
  { label: 'Review',          icon: '✅' },
];

export default function VerifyPage() {
  const { user } = useAuth();
  const isFarmer = user?.role === 'farmer';
  const totalSteps = isFarmer ? 6 : 5;

  const [step, setStep] = useState(1);

  // Step 1 — Personal info
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [dob, setDob] = useState('');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [bvn, setBvn] = useState('');
  const [country, setCountry] = useState('Nigeria');

  // Step 2 — ID upload
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  // Step 3 — Face verification
  const [selfie, setSelfie] = useState<string | null>(null);
  const [faceMode, setFaceMode] = useState<'selfie' | 'withid'>('selfie');
  const selfieRef = useRef<HTMLInputElement>(null);

  // Step 4 — Proof of address
  const [addrType, setAddrType] = useState('');
  const [addrDoc, setAddrDoc] = useState<string | null>(null);
  const addrRef = useRef<HTMLInputElement>(null);

  // Step 5 — Farm evidence (farmers only)
  const [farmPhoto, setFarmPhoto] = useState<string | null>(null);
  const [gps, setGps] = useState('');
  const farmRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setter(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const visibleSteps = isFarmer ? STEPS : STEPS.filter(s => s.label !== 'Farm Evidence');
  const stepLabel = visibleSteps[step - 1]?.label;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (submitted) return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
            <span className="animate-bounce inline-block">✅</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Submitted for Review!</h2>
          <p className="text-gray-500 mb-2">Your KYC documents have been received.</p>
          <p className="text-sm text-gray-400 mb-6">
            Usually takes <span className="font-bold text-gray-700">2–24 hours</span>. You'll get an SMS when approved.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-700 text-left">
            <p className="font-bold mb-2">What happens next:</p>
            <ul className="space-y-1 text-xs list-none">
              <li>✦ FarmLink reviews your documents manually</li>
              <li>✦ If anything is unclear, we'll send you an SMS</li>
              <li>✦ Once approved, the ✓ Verified badge appears on your profile</li>
              <li>✦ Verified users get higher trust ratings and sell faster</li>
            </ul>
          </div>
          <Link href="/dashboard" className="inline-block bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-xl">
          {/* Header */}
          <div className="mb-6 pt-4">
            <Link href="/profile" className="text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1 mb-4">← Back to Profile</Link>
            <h1 className="text-2xl font-black text-gray-900">Identity Verification (KYC)</h1>
            <p className="text-gray-500 text-sm mt-1">Get your ✓ Verified badge and unlock all FarmLink features</p>
          </div>

          {/* Step progress */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              {visibleSteps.map((s, i) => (
                <div key={s.label} className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? 'bg-brand-600' : 'bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Step {step} of {totalSteps}: <span className="font-bold text-gray-600">{stepLabel}</span></p>
              <div className="flex gap-1">
                {visibleSteps.map((s, i) => (
                  <div key={s.label} title={s.label}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${i < step ? 'bg-brand-600 text-white' : i === step - 1 ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300' : 'bg-gray-100 text-gray-400'}`}>
                    {i < step - 1 ? '✓' : s.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Personal Information</h2>
                <p className="text-sm text-gray-500 mb-5">Confirm your details and enter your ID number</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Legal Name *</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} required
                      placeholder="As it appears on your ID"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
                    <p className="text-xs text-gray-400 mt-1">Must match your government-issued ID exactly</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date of Birth *</label>
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Country *</label>
                      <select value={country} onChange={e => setCountry(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400">
                        {['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Senegal', 'Tanzania', 'Uganda', 'Other'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">ID Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ID_TYPES.filter(t => country === 'Nigeria' ? true : t.countries.includes(country) || t.countries.includes('All countries') || t.countries.includes('Others')).map(id => (
                        <button key={id.id} onClick={() => setIdType(id.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${idType === id.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="text-xl mb-1">{id.icon}</div>
                          <p className="font-bold text-xs text-gray-900 leading-tight">{id.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{id.hint}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {idType && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                        {ID_TYPES.find(t => t.id === idType)?.label} Number *
                      </label>
                      <input value={idNumber} onChange={e => setIdNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder={idType === 'nin' ? '12345678901 (11 digits)' : idType === 'bvn' ? '12345678901 (11 digits)' : 'Enter your ID number'}
                        maxLength={idType === 'nin' || idType === 'bvn' ? 11 : 30}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 font-mono tracking-widest" />
                      {(idType === 'nin' || idType === 'bvn') && idNumber.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 11 }).map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i < idNumber.length ? 'bg-brand-500' : 'bg-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{idNumber.length}/11</span>
                        </div>
                      )}
                    </div>
                  )}

                  {country === 'Nigeria' && idType !== 'bvn' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">BVN (optional but recommended)</label>
                      <input value={bvn} onChange={e => setBvn(e.target.value.replace(/\D/g, ''))}
                        placeholder="11-digit bank verification number"
                        maxLength={11}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 font-mono tracking-widest" />
                      <p className="text-xs text-gray-400 mt-1">Adding your BVN speeds up verification and unlocks instant escrow payments.</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-xl p-3 mt-5 text-xs text-blue-700">
                  <p className="font-bold mb-1">🔒 Your data is secure</p>
                  <p>Your NIN/BVN is encrypted and only used for identity verification. FarmLink does not sell or share your personal data.</p>
                </div>

                <button onClick={nextStep}
                  disabled={!fullName || !dob || !idType || !idNumber}
                  className="w-full mt-6 bg-brand-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">
                  Continue →
                </button>
              </div>
            )}

            {/* ── STEP 2: ID Document Upload ── */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Upload Your ID Document</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Take a clear photo of your <span className="font-bold">{ID_TYPES.find(i => i.id === idType)?.label}</span>
                </p>

                <input ref={frontRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e, setIdFront)} />
                <input ref={backRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e, setIdBack)} />

                <div className="space-y-4">
                  {/* Front */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Front of ID *</label>
                    {!idFront ? (
                      <button onClick={() => frontRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-brand-400 hover:bg-brand-50 transition-all">
                        <div className="text-4xl">📷</div>
                        <p className="font-semibold text-gray-700 text-sm">Tap to photograph front</p>
                        <p className="text-xs text-gray-400">Must show all 4 corners · No glare · Clear text</p>
                      </button>
                    ) : (
                      <div className="relative">
                        <img src={idFront} alt="ID front" className="w-full h-40 object-cover rounded-2xl" />
                        <button onClick={() => setIdFront(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm hover:bg-red-600">✕</button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Front uploaded</div>
                      </div>
                    )}
                  </div>

                  {/* Back (optional for some IDs) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Back of ID <span className="text-gray-400 font-normal normal-case">(optional — if double-sided)</span>
                    </label>
                    {!idBack ? (
                      <button onClick={() => backRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 hover:bg-gray-50 transition-all">
                        <div className="text-3xl opacity-50">📷</div>
                        <p className="text-gray-400 text-sm">Tap to add back of ID</p>
                      </button>
                    ) : (
                      <div className="relative">
                        <img src={idBack} alt="ID back" className="w-full h-32 object-cover rounded-2xl" />
                        <button onClick={() => setIdBack(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm">✕</button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Back uploaded</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                  <p className="font-bold mb-1">Tips for a valid photo:</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>Lay the ID flat on a dark surface</li>
                    <li>All 4 corners and the full card must be visible</li>
                    <li>No glare, reflections, or shadows</li>
                    <li>All text must be clearly readable</li>
                  </ul>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={prevStep} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50">← Back</button>
                  <button onClick={nextStep} disabled={!idFront}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Face Verification ── */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Face Verification</h2>
                <p className="text-sm text-gray-500 mb-4">We need to confirm that you are the person in the ID document</p>

                {/* Mode toggle */}
                <div className="flex gap-2 mb-5">
                  {[
                    { id: 'selfie', label: 'Selfie Only', icon: '🤳', desc: 'Just your face, no ID needed' },
                    { id: 'withid', label: 'Selfie with ID', icon: '🪪', desc: 'Face + ID in same photo' },
                  ].map(m => (
                    <button key={m.id} onClick={() => setFaceMode(m.id as 'selfie' | 'withid')}
                      className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${faceMode === m.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200'}`}>
                      <div className="text-xl mb-1">{m.icon}</div>
                      <p className="font-bold text-xs text-gray-900">{m.label}</p>
                      <p className="text-[10px] text-gray-400">{m.desc}</p>
                    </button>
                  ))}
                </div>

                <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden" onChange={e => handleFile(e, setSelfie)} />
                {!selfie ? (
                  <button onClick={() => selfieRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all">
                    <div className="text-5xl">🤳</div>
                    <p className="font-semibold text-gray-700">
                      {faceMode === 'withid' ? 'Take photo: face + ID visible' : 'Take a selfie (front camera)'}
                    </p>
                    <p className="text-xs text-gray-400">Look directly at the camera · Good lighting · No sunglasses</p>
                  </button>
                ) : (
                  <div className="relative">
                    <img src={selfie} alt="Selfie" className="w-full h-48 object-cover rounded-2xl" />
                    <button onClick={() => setSelfie(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm">✕</button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Face captured</div>
                  </div>
                )}

                <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                  <p className="font-bold mb-1">What we check:</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>Your face must match the ID photo</li>
                    <li>No filters, masks, or heavy makeup</li>
                    <li>Face clearly visible and well-lit</li>
                    {faceMode === 'withid' && <li>ID number must be readable in the photo</li>}
                  </ul>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={prevStep} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">← Back</button>
                  <button onClick={nextStep} disabled={!selfie}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Proof of Address ── */}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Proof of Address</h2>
                <p className="text-sm text-gray-500 mb-5">Upload a document that shows your current address (not older than 3 months)</p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {ADDR_TYPES.map(at => (
                    <button key={at.id} onClick={() => setAddrType(at.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${addrType === at.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="text-xl mb-1">{at.icon}</div>
                      <p className="font-bold text-xs text-gray-900">{at.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{at.hint}</p>
                    </button>
                  ))}
                </div>

                <input ref={addrRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleFile(e, setAddrDoc)} />
                {addrType && (
                  <>
                    {!addrDoc ? (
                      <button onClick={() => addrRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all">
                        <div className="text-4xl">📄</div>
                        <p className="font-semibold text-gray-700 text-sm">Upload {ADDR_TYPES.find(a => a.id === addrType)?.label}</p>
                        <p className="text-xs text-gray-400">JPG, PNG, or PDF · Max 5MB</p>
                      </button>
                    ) : (
                      <div className="relative">
                        <img src={addrDoc} alt="Address doc" className="w-full h-40 object-cover rounded-2xl" />
                        <button onClick={() => setAddrDoc(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm">✕</button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Document uploaded</div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                  <p className="font-bold mb-1">Document must show:</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>Your full name</li>
                    <li>Your current residential address</li>
                    <li>Issue date within the last 3 months</li>
                  </ul>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={prevStep} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">← Back</button>
                  <button onClick={nextStep} disabled={!addrType || !addrDoc}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Farm Evidence (Farmers only) ── */}
            {step === 5 && isFarmer && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Farm Verification</h2>
                <p className="text-sm text-gray-500 mb-2">Help buyers trust your farm by providing evidence</p>
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-5 text-xs text-brand-700">
                  <span className="font-bold">Why this matters:</span> Verified farmers sell 3× faster on FarmLink and get access to the investment fund.
                </div>

                <input ref={farmRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e, setFarmPhoto)} />
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Farm Photo <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  {!farmPhoto ? (
                    <button onClick={() => farmRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-brand-400 hover:bg-brand-50 transition-all">
                      <div className="text-4xl">🌾</div>
                      <p className="font-semibold text-gray-700 text-sm">Photograph your farm</p>
                      <p className="text-xs text-gray-400">Crops, field, greenhouse — any farm evidence</p>
                    </button>
                  ) : (
                    <div className="relative">
                      <img src={farmPhoto} alt="Farm" className="w-full h-36 object-cover rounded-2xl" />
                      <button onClick={() => setFarmPhoto(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm">✕</button>
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Farm photo added</div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Farm GPS Coordinates <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  <input value={gps} onChange={e => setGps(e.target.value)} placeholder="e.g. 7.3775° N, 3.9470° E"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400" />
                  <p className="text-xs text-gray-400 mt-1">Open Google Maps → long-press your farm location → copy the coordinates shown</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={prevStep} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">← Back</button>
                  <button onClick={nextStep}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* ── REVIEW STEP (step 5 for non-farmers, step 6 for farmers) ── */}
            {step === totalSteps && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Review & Submit</h2>
                <p className="text-sm text-gray-500 mb-5">Confirm all information before submitting for review</p>

                <div className="space-y-2 mb-6">
                  {[
                    { label: 'Full Name',       value: fullName,                            ok: !!fullName },
                    { label: 'Date of Birth',   value: dob,                                 ok: !!dob },
                    { label: 'Country',         value: country,                             ok: true },
                    { label: 'ID Type',         value: ID_TYPES.find(i => i.id === idType)?.label, ok: !!idType },
                    { label: 'ID Number',       value: idNumber ? '•'.repeat(idNumber.length - 4) + idNumber.slice(-4) : '—', ok: !!idNumber },
                    { label: 'BVN',             value: bvn ? 'Provided' : 'Not provided',  ok: true },
                    { label: 'ID Document',     value: idFront ? 'Front uploaded' + (idBack ? ' + Back' : '') : 'Missing', ok: !!idFront },
                    { label: 'Face Verification',value: selfie ? `Selfie captured (${faceMode === 'withid' ? 'with ID' : 'face only'})` : 'Missing', ok: !!selfie },
                    { label: 'Proof of Address',value: addrDoc ? ADDR_TYPES.find(a => a.id === addrType)?.label + ' uploaded' : 'Missing', ok: !!addrDoc },
                    ...(isFarmer ? [{ label: 'Farm Evidence', value: farmPhoto || gps ? 'Provided' : 'Skipped (optional)', ok: true }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                      <span className="text-sm text-gray-600">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.ok ? 'text-gray-900' : 'text-red-500'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 mb-6">
                  <p className="font-bold mb-1">By submitting, you confirm that:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>All submitted information is accurate and truthful</li>
                    <li>The ID belongs to you and is currently valid</li>
                    <li>You consent to FarmLink verifying your documents</li>
                    <li>Submitting false information may result in account suspension</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button onClick={prevStep} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">← Back</button>
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={!idFront || !selfie || !addrDoc}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors"
                  >
                    Submit for Review ✓
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security note */}
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 justify-center">
            <span>🔒</span>
            <span>256-bit encrypted · Documents auto-deleted after review · NDPR compliant</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
