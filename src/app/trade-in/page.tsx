"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowRight, ShieldCheck, Upload, AlertCircle, RefreshCw, CheckCircle2 
} from 'lucide-react';

export default function TradeIn() {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [carBrand, setCarBrand] = useState('Chevrolet');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('2018');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val.startsWith('+998')) {
      setPhone('+998');
      return;
    }
    const suffix = val.substring(4);
    const digitsOnly = suffix.replace(/\D/g, '');
    const capped = digitsOnly.substring(0, 9);
    setPhone('+998' + capped);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);
  
  // Image upload simulator state
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [estimatedMin, setEstimatedMin] = useState<number | null>(null);
  const [estimatedMax, setEstimatedMax] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  // Simple valuation algorithm
  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carModel || !mileage) {
      alert("Iltimos, avtomobil modeli va bosib o'tgan masofasini kiriting");
      return;
    }
    
    setCalculating(true);
    setTimeout(() => {
      // Base valuation arithmetic
      const currentYear = new Date().getFullYear();
      const age = Math.max(0, currentYear - parseInt(carYear));
      const dist = parseFloat(mileage) || 50000;
      
      // Starting base value for mock Chevrolet calculations
      let baseVal = 15000;
      const modelLower = carModel.toLowerCase();
      if (modelLower.includes('cobalt')) baseVal = 11000;
      else if (modelLower.includes('gentra') || modelLower.includes('lacetti')) baseVal = 12500;
      else if (modelLower.includes('spark')) baseVal = 8500;
      else if (modelLower.includes('nexia')) baseVal = 7500;
      else if (modelLower.includes('malibu')) baseVal = 25000;
      else if (modelLower.includes('tracker')) baseVal = 18000;
      else if (modelLower.includes('captiva')) baseVal = 20000;

      // Depreciate based on age and mileage
      const ageDepreciation = age * 800; // $800 loss per year
      const mileageDepreciation = (dist / 10000) * 200; // $200 loss per 10k km
      
      let finalVal = baseVal - ageDepreciation - mileageDepreciation;
      // Cap at minimum value
      finalVal = Math.max(3000, finalVal);

      setEstimatedMin(Math.round(finalVal * 0.9));
      setEstimatedMax(Math.round(finalVal * 1.05));
      setCalculating(false);
    }, 1200);
  };

  // Submit Trade-In request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Iltimos, ismingiz va telefon raqamingizni kiriting");
      return;
    }
    if (!carModel || !mileage) {
      alert("Iltimos, avtomobil modelini va bosib o'tgan masofasini (probeg) kiriting.");
      return;
    }
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-trade-in',
          name,
          phone,
          carBrand,
          carModel,
          carYear: parseInt(carYear) || 2018,
          mileage: parseInt(mileage) || 0,
          notes: notes 
            ? `${notes} \n[User Email: ${user?.email || ''}]` 
            : `Saytdan Trade-In baholash arizasi \n[User Email: ${user?.email || ''}]`,
          images: []
        })
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setPhone('');
        setCarModel('');
        setMileage('');
        setNotes('');
        setUploadedFilesCount(0);
        setEstimatedMin(null);
        setEstimatedMax(null);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
      alert(t('error'));
    }
  };

  // Drag and drop simulator
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFilesCount(e.target.files.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('tradeInTitle')}</h1>
        <p className="text-sm text-neutral-400 mt-2">{t('tradeInSubtitle')}</p>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left column: Information & Calculator */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-foreground">Avtomobilingizni onlayn baholang</h2>
            <p className="text-foreground/80 leading-relaxed font-light">
              Buxoro Avto Magnat dilerlik markazida eski mashinangizni topshirib, yangi Chevrolet Malibu, Tracker yoki Onix olishingiz mumkin. Eski mashinangiz qiymati yangi avtomobil uchun boshlang'ich to'lov sifatida qabul qilinadi.
            </p>
          </div>

          <form onSubmit={handleEstimate} className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-lg">
            <h3 className="font-bold text-base border-b border-border pb-2">Ekspress baholash kalkulyatori</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('yourCarBrand')}</label>
                <select
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-sm text-foreground focus:outline-none focus:border-gold"
                >
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Lada">Lada</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Daewoo">Daewoo</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Model nomi</label>
                <input
                  type="text" required placeholder="Masalan: Cobalt, Gentra" value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-sm text-foreground focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('year')}</label>
                <select
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-sm text-foreground focus:outline-none focus:border-gold"
                >
                  {[...Array(15)].map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('yourCarMileage')}</label>
                <input
                  type="number" required placeholder="Masalan: 85000" value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-sm text-foreground focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calculating}
              className="w-full bg-foreground text-background hover:bg-gold hover:text-black py-2.5 rounded font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Hisoblanmoqda...</span>
                </>
              ) : (
                <span>{t('estimatePriceBtn')}</span>
              )}
            </button>
          </form>

          {/* Value result display */}
          {estimatedMin !== null && (
            <div className="bg-gold/10 border border-gold/30 p-6 rounded-xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-xs font-bold text-gold uppercase tracking-widest">{t('estimatedValue')}</h4>
              <p className="text-3xl font-black text-white">${estimatedMin.toLocaleString()} - ${estimatedMax?.toLocaleString()}</p>
              <p className="text-xs text-neutral-400 font-light mt-1">
                *Yakuniy narx dilerlik markazimizda bepul texnik va vizual diagnostikadan so'ng tasdiqlanadi.
              </p>
            </div>
          )}

        </div>

        {/* Right column: Application Forms */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
          <h3 className="font-extrabold text-xl border-b border-border pb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" />
            <span>{t('tradeInFormTitle')}</span>
          </h3>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-lg text-center font-bold">
              {t('tradeInSuccessMsg')}
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('name')}</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('phone')}</label>
                <input
                  type="text" required placeholder="+998" value={phone} onChange={handlePhoneChange}
                  className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* Upload Images Block */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('uploadCarImages')}</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-gold transition-colors relative cursor-pointer bg-black/[0.01]">
                  <input
                    type="file" multiple accept="image/*" onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs text-foreground/80 font-semibold">Mashinangizning rasmlarini yuklang</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Eksteryer, salon, dvigatel qismlari (Maks 6 ta rasm)</p>
                  {uploadedFilesCount > 0 && (
                    <div className="mt-3 bg-gold/10 text-gold px-3 py-1 rounded text-xs font-bold w-fit mx-auto border border-gold/30">
                      Yuklandi: {uploadedFilesCount} ta rasm
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Qo'shimcha izohlar (avariya, bo'yoq holati va h.k.)</label>
                <textarea
                  rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black font-extrabold py-3.5 rounded-lg text-sm shadow-lg shadow-gold/20 transition-all duration-300"
              >
                Trade-In arizasini topshirish
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
