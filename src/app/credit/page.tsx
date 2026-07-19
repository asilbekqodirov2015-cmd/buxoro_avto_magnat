"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Percent, ShieldCheck, CheckCircle2, Calculator, Info, Landmark, HelpCircle 
} from 'lucide-react';

export default function Credit() {
  const { t } = useLanguage();

  const [cars, setCars] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for calculator workspace
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedCarPrice, setSelectedCarPrice] = useState(30000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [interestRate, setInterestRate] = useState(18);

  // Credit Request Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [successApply, setSuccessApply] = useState(false);

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
    async function loadData() {
      try {
        setLoading(true);
        // Load cars
        const carsRes = await fetch('/api/cars');
        if (carsRes.ok) {
          const carsData = await carsRes.json();
          setCars(carsData);
          if (carsData.length > 0) {
            setSelectedCarId(carsData[0].id);
            setSelectedCarPrice(carsData[0].price);
          }
        }
        
        // Load credit programs / banks
        const credRes = await fetch('/api/credit-programs');
        if (credRes.ok) {
          const credData = await credRes.json();
          setBanks(credData);
          if (credData.length > 0) {
            setSelectedBankId(credData[0].id);
            setInterestRate(credData[0].interestRate);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCarId(id);
    const carObj = cars.find(c => c.id === id);
    if (carObj) {
      setSelectedCarPrice(carObj.price - carObj.discount);
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedBankId(id);
    const bankObj = banks.find(b => b.id === id);
    if (bankObj) {
      setInterestRate(bankObj.minInterestRate || bankObj.interestRate);
      const maxTerm = bankObj.maxTermMonths || bankObj.termMonths || 60;
      const minTerm = bankObj.minTermMonths || 12;
      if (loanTermMonths > maxTerm) {
        setLoanTermMonths(maxTerm);
      } else if (loanTermMonths < minTerm) {
        setLoanTermMonths(minTerm);
      }
    }
  };

  const currentBank = banks.find(b => b.id === selectedBankId);

  // Calculations
  const downPaymentAmount = (selectedCarPrice * downPaymentPercent) / 100;
  const loanAmount = selectedCarPrice - downPaymentAmount;
  const monthlyRate = (interestRate / 12) / 100;
  const monthlyPayment = loanAmount > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
    : 0;
  const totalCost = downPaymentAmount + (monthlyPayment * loanTermMonths);
  const overpayment = totalCost - selectedCarPrice;

  // Submit credit request
  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Iltimos, ismingiz va telefon raqamingizni to'ldiring");
      return;
    }
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-credit',
          name,
          phone,
          carId: selectedCarId,
          bankId: selectedBankId,
          downPayment: `${downPaymentPercent}% (${downPaymentAmount.toLocaleString()} so'm)`,
          termMonths: loanTermMonths,
          monthlyPayment: Math.round(monthlyPayment)
        })
      });
      if (res.ok) {
        setSuccessApply(true);
        setName('');
        setPhone('');
        setTimeout(() => setSuccessApply(false), 5000);
      } else {
        alert("Serverda xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      alert("Ulanishda xatolik yuz berdi");
    }
  };

  if (loading) return <div className="text-center py-40 font-bold text-lg">{t('loading')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('navCredit')}</h1>
        <p className="text-sm text-neutral-400 mt-2">Buxoroda eng arzon yillik foiz va foizsiz muddatli to'lov dasturlari</p>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workspace: Calculator Inputs */}
        <div className="lg:col-span-2 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-border">
            <Calculator className="w-5 h-5 text-gold" />
            <span>Kalkulyator parametrlari</span>
          </h2>

          {/* Step 1: Select Car */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Avtomobilni tanlang</label>
            <select
              value={selectedCarId}
              onChange={handleCarChange}
              className="w-full bg-background border border-border px-4 py-3 rounded-lg text-sm text-foreground focus:outline-none focus:border-gold"
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} - {(car.price - car.discount).toLocaleString()} so'm
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Bank */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('bankSelect')}</label>
            <select
              value={selectedBankId}
              onChange={handleBankChange}
              className="w-full bg-background border border-border px-4 py-3 rounded-lg text-sm text-foreground focus:outline-none focus:border-gold"
            >
              {banks.map((bank) => {
                const minRate = bank.minInterestRate || bank.interestRate;
                const maxRate = bank.maxInterestRate;
                const rateStr = maxRate && maxRate !== minRate ? `${minRate}% - ${maxRate}%` : `${minRate}%`;
                const minT = bank.minTermMonths || 12;
                const maxT = bank.maxTermMonths || bank.termMonths || 60;
                return (
                  <option key={bank.id} value={bank.id}>
                    {bank.bankName} (Foiz: {rateStr}, Muddat: {minT}-{maxT} oy, Boshlang'ich: {bank.minDownPayment}%)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Interest Rate selector/slider if range exists */}
          {currentBank && currentBank.minInterestRate && currentBank.maxInterestRate && currentBank.minInterestRate !== currentBank.maxInterestRate ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Foiz stavkasi:</span>
                <span className="font-bold text-gold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={currentBank.minInterestRate}
                max={currentBank.maxInterestRate}
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Belgilangan yillik foiz:</span>
                <span className="font-bold text-gold">{interestRate}%</span>
              </div>
            </div>
          )}

          {/* Downpayment percent slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('downPayment')} ({downPaymentPercent}%):</span>
              <span className="font-bold text-gold">{downPaymentAmount.toLocaleString()} so'm</span>
            </div>
            <input
              type="range" min={currentBank?.minDownPayment || 10} max="80" step="5" value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          {/* Term months slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('loanTerm')}:</span>
              <span className="font-bold text-gold">{loanTermMonths} {t('months')}</span>
            </div>
            <input
              type="range"
              min={currentBank?.minTermMonths || 12}
              max={currentBank?.maxTermMonths || currentBank?.termMonths || 60}
              step="12"
              value={loanTermMonths}
              onChange={(e) => setLoanTermMonths(parseInt(e.target.value))}
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          {/* Overpayment & interest display */}
          <div className="grid grid-cols-2 gap-4 text-sm text-foreground/75 bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-xl border border-border/60">
            <div>
              <span>Kredit summasi:</span>
              <p className="font-bold text-foreground">{loanAmount.toLocaleString()} so'm</p>
            </div>
            <div>
              <span>Ortiqcha to'lov:</span>
              <p className="font-bold text-foreground">{Math.round(overpayment).toLocaleString()} so'm</p>
            </div>
          </div>

        </div>

        {/* Results & Application Panel */}
        <div className="space-y-6">
          
          {/* Oylik to'lov xulosasi */}
          <div className="bg-neutral-900 text-white border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="text-center pb-4 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{t('monthlyPayment')}</span>
              <p className="text-3xl font-black text-gold mt-1">{Math.round(monthlyPayment).toLocaleString()} so'm</p>
            </div>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between">
                <span>Avtomobil narxi:</span>
                <span className="text-white font-bold">{selectedCarPrice.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span>Boshlang'ich to'lov:</span>
                <span className="text-white font-bold">{downPaymentAmount.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span>Foiz stavkasi:</span>
                <span className="text-white font-bold">{interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Umumiy xarajat:</span>
                <span className="text-gold font-bold">{Math.round(totalCost).toLocaleString()} so'm</span>
              </div>
            </div>
          </div>

          {/* Ariza yuborish formasi */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold text-base mb-4 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-gold" />
              <span>Ariza topshirish</span>
            </h3>

            {successApply ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded text-center text-xs font-bold">
                Arizangiz qabul qilindi. 15 daqiqa ichida bank maslahatchisi siz bilan bog'lanadi.
              </div>
            ) : (
              <form onSubmit={handleCreditSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{t('fullName')}</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{t('phone')}</label>
                  <input
                    type="text"
                    required
                    placeholder="+998"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-hover text-black font-extrabold py-3 rounded text-sm transition-colors duration-300"
                >
                  Onlayn ariza yuborish
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Credit terms informational segment */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card border border-border p-6 rounded-xl flex items-start space-x-3">
          <ShieldCheck className="w-8 h-8 text-gold flex-shrink-0" />
          <div>
            <h4 className="font-bold text-base mb-1">Garov va sug'urta</h4>
            <p className="text-xs text-foreground/75 leading-relaxed">Kreditga olingan avtomobil to'liq to'langunga qadar bank garovida bo'ladi va KASKO sug'urtasi majburiydir.</p>
          </div>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl flex items-start space-x-3">
          <Percent className="w-8 h-8 text-gold flex-shrink-0" />
          <div>
            <h4 className="font-bold text-base mb-1">Foizsiz muddatli to'lov</h4>
            <p className="text-xs text-foreground/75 leading-relaxed">Aksiyalarimiz doirasida ba'zi modellarga 50% oldindan to'lov qilganda 12, 18 yoki 24 oylik foizsiz muddatli to'lovlar mavjud.</p>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex items-start space-x-3">
          <Landmark className="w-8 h-8 text-gold flex-shrink-0" />
          <div>
            <h4 className="font-bold text-base mb-1">Hamkor banklarimiz</h4>
            <p className="text-xs text-foreground/75 leading-relaxed">Biz Buxoroning barcha yirik banklari: Asaka, SQB, Anorbank, Davr Bank, Ipak Yo'li banklari bilan ishlaymiz.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
