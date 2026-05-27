'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const ID_TYPES = [
  { id: 'nin', label: 'NIN (National ID)', icon: '🪪', countries: ['Nigeria'] },
  { id: 'voters', label: "Voter's Card", icon: '🗳️', countries: ['Nigeria', 'Ghana'] },
  { id: 'passport', label: 'International Passport', icon: '📘', countries: ['All countries'] },
  { id: 'drivers', label: "Driver's Licence", icon: '🚗', countries: ['All countries'] },
  { id: 'ghana_card', label: 'Ghana Card', icon: '🪪', countries: ['Ghana'] },
  { id: 'national_id', label: 'National ID Card', icon: '🪪', countries: ['Kenya', 'South Africa', 'Others'] },
];

export default function VerifyPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState('');
  const [idFront, setIdFront] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [farmPhoto, setFarmPhoto] = useState<string | null>(null);
  const [gps, setGps] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const frontRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const farmRef = useRef<HTMLInputElement>(null);

  const isFarmer = user?.role === 'farmer';
  const totalSteps = isFarmer ? 5 : 4;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onload = ev => setter(ev.target?.result as string); r.readAsDataURL(f); }
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-bounce">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Submitted for Review!</h2>
          <p className="text-gray-500 mb-2">Your verification documents have been received.</p>
          <p className="text-sm text-gray-400 mb-6">Usually takes <span className="font-bold text-gray-700">2–24 hours</span>. You'll get notified when approved.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-700">
            <p className="font-bold mb-1">While you wait:</p>
            <p>You can still browse, buy, and list products. The ✓ Verified badge will appear on your profile once approved.</p>
          </div>
          <Link href="/dashboard" className="inline-block bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">Back to Dashboard</Link>
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
          <div className="mb-8 pt-4">
            <Link href="/profile" className="text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1 mb-4">← Back to Profile</Link>
            <h1 className="text-2xl font-black text-gray-900">Identity Verification</h1>
            <p className="text-gray-500 text-sm mt-1">Get your ✓ Verified badge and unlock all FarmLink features</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? 'bg-brand-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 -mt-6 mb-8 text-right">Step {step} of {totalSteps}</p>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">

            {/* Step 1: Choose ID type */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Choose your ID type</h2>
                <p className="text-sm text-gray-500 mb-5">Select the government-issued ID you want to use for verification</p>
                <div className="grid grid-cols-2 gap-3">
                  {ID_TYPES.map(id => (
                    <button key={id.id} onClick={() => setIdType(id.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${idType === id.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="text-2xl mb-2">{id.icon}</div>
                      <p className="font-bold text-sm text-gray-900">{id.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{id.countries.join(', ')}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} disabled={!idType}
                  className="w-full mt-6 bg-brand-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Upload ID front */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Upload your ID</h2>
                <p className="text-sm text-gray-500 mb-5">Take a clear photo of the <span className="font-bold">front</span> of your {ID_TYPES.find(i => i.id === idType)?.label}</p>
                <input ref={frontRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e, setIdFront)} />
                {!idFront ? (
                  <button onClick={() => frontRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all">
                    <div className="text-5xl">📷</div>
                    <p className="font-semibold text-gray-700">Click to upload or take photo</p>
                    <p className="text-xs text-gray-400">JPG, PNG · Max 5MB · Must be clear and readable</p>
                  </button>
                ) : (
                  <div className="relative">
                    <img src={idFront} alt="ID front" className="w-full h-48 object-cover rounded-2xl" />
                    <button onClick={() => setIdFront(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm hover:bg-red-600 transition-colors">✕</button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Uploaded</div>
                  </div>
                )}
                <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                  <p className="font-bold mb-1">Tips for a good photo:</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>All 4 corners of the ID must be visible</li>
                    <li>No glare or shadows on the ID</li>
                    <li>Text must be clearly readable</li>
                  </ul>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">← Back</button>
                  <button onClick={() => setStep(3)} disabled={!idFront}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3: Selfie with ID */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Selfie holding your ID</h2>
                <p className="text-sm text-gray-500 mb-5">Take a photo of yourself holding the ID next to your face. Both must be clearly visible.</p>
                <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden" onChange={e => handleFile(e, setSelfie)} />
                {!selfie ? (
                  <button onClick={() => selfieRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all">
                    <div className="text-5xl">🤳</div>
                    <p className="font-semibold text-gray-700">Take selfie with ID</p>
                    <p className="text-xs text-gray-400">Face + ID must both be visible and clear</p>
                  </button>
                ) : (
                  <div className="relative">
                    <img src={selfie} alt="Selfie" className="w-full h-48 object-cover rounded-2xl" />
                    <button onClick={() => setSelfie(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm">✕</button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Uploaded</div>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">← Back</button>
                  <button onClick={() => setStep(isFarmer ? 4 : 5)} disabled={!selfie}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* Step 4 (Farmers only): Farm photo */}
            {step === 4 && isFarmer && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Farm Verification</h2>
                <p className="text-sm text-gray-500 mb-5">Upload a photo of your farm AND/OR enter your farm's GPS coordinates</p>
                <input ref={farmRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e, setFarmPhoto)} />
                {!farmPhoto ? (
                  <button onClick={() => farmRef.current?.click()}
                    className="w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-brand-400 hover:bg-brand-50 transition-all mb-4">
                    <div className="text-4xl">🌾</div>
                    <p className="font-semibold text-gray-700 text-sm">Upload farm photo (optional)</p>
                  </button>
                ) : (
                  <div className="relative mb-4">
                    <img src={farmPhoto} alt="Farm" className="w-full h-36 object-cover rounded-2xl" />
                    <button onClick={() => setFarmPhoto(null)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm">✕</button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">✓ Uploaded</div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">GPS Coordinates (optional)</label>
                  <input value={gps} onChange={e => setGps(e.target.value)} placeholder="e.g. 7.3775° N, 3.9470° E"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  <p className="text-xs text-gray-400 mt-1">You can get this from Google Maps by long-pressing your farm location</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">← Back</button>
                  <button onClick={() => setStep(5)} className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === (isFarmer ? 5 : 4) && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Review & Submit</h2>
                <p className="text-sm text-gray-500 mb-5">Please confirm all your information is correct before submitting</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <span className="text-sm text-gray-600">ID Type</span>
                    <span className="font-bold text-gray-900 text-sm">{ID_TYPES.find(i => i.id === idType)?.label}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <span className="text-sm text-gray-600">ID Document</span>
                    {idFront ? <span className="font-bold text-green-600 text-sm">✓ Uploaded</span> : <span className="text-red-500 text-sm">Missing</span>}
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <span className="text-sm text-gray-600">Selfie with ID</span>
                    {selfie ? <span className="font-bold text-green-600 text-sm">✓ Uploaded</span> : <span className="text-red-500 text-sm">Missing</span>}
                  </div>
                  {isFarmer && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <span className="text-sm text-gray-600">Farm Evidence</span>
                      <span className="font-bold text-gray-900 text-sm">{farmPhoto || gps ? '✓ Provided' : 'Skipped'}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <span className="text-sm text-gray-600">Name on Account</span>
                    <span className="font-bold text-gray-900 text-sm">{user?.fullName || 'Not set'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 mb-6">
                  <p className="font-bold mb-1">By submitting, you confirm that:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>The ID belongs to you and is valid</li>
                    <li>All information is accurate and truthful</li>
                    <li>FarmLink may contact you to verify details</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(isFarmer ? 4 : 3)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">← Back</button>
                  <button onClick={handleSubmit} disabled={!idFront || !selfie}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Submit for Review</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
