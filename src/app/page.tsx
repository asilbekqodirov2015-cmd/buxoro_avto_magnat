"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/translations';
import { 
  ArrowRight, ShieldCheck, Zap, Percent, Wrench, ChevronDown, 
  MessageSquare, Star, Calculator, Award, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock hero slides
const slides = [
  {
    id: 'car-tahoe',
    titleUz: 'Chevrolet Tahoe',
    taglineUz: 'Afsonaviy premium yo‘ltanlamas. Qudrat va ulug‘vorlik ramzi.',
    titleRu: 'Chevrolet Tahoe',
    taglineRu: 'Легендарный премиальный внедорожник. Символ мощи.',
    titleEn: 'Chevrolet Tahoe',
    taglineEn: 'Legendary premium SUV. The ultimate symbol of power.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
    price: 95000
  },
  {
    id: 'car-malibu',
    titleUz: 'Chevrolet Malibu 2',
    taglineUz: 'Mukammal dinamika va premium qulaylik. Chegaralarni buzing.',
    titleRu: 'Chevrolet Malibu 2',
    taglineRu: 'Совершенная динамика и премиум комфорт. Выйдите за рамки.',
    titleEn: 'Chevrolet Malibu 2',
    taglineEn: 'Perfect dynamics and premium comfort. Break all boundaries.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
    price: 35000
  },
  {
    id: 'car-tracker',
    titleUz: 'Chevrolet Tracker 2',
    taglineUz: 'Zamonaviy shahar krossoveri. Har bir metrda erkinlik.',
    titleRu: 'Chevrolet Tracker 2',
    taglineRu: 'Современный городской кроссовер. Свобода в каждом метре.',
    titleEn: 'Chevrolet Tracker 2',
    taglineEn: 'Modern city crossover. Experience freedom at every mile.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
    price: 23200
  }
];

export default function Home() {
  const { t, language } = useLanguage();
  const { toggleWishlist, wishlist } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSlides, setActiveSlides] = useState<any[]>(slides);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Credit calculator local state
  const [calcCarPrice, setCalcCarPrice] = useState(300000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(18);

  // FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    // Fetch featured cars
    async function loadCars() {
      try {
        const res = await fetch('/api/cars');
        if (res.ok) {
          const data = await res.json();
          setCars(data.slice(0, 4)); // Get first 4 featured cars
          if (data.length > 0) {
            setCalcCarPrice(data[0].price);
            setSelectedCarId(data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Fetch promotions to override static hero slides
    async function loadPromotions() {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setActiveSlides(data.map((p: any) => ({
              id: p.id,
              titleUz: p.titleUz,
              taglineUz: p.descriptionUz,
              titleRu: p.titleRu,
              taglineRu: p.descriptionRu,
              titleEn: p.titleEn,
              taglineEn: p.descriptionEn,
              image: p.image
            })));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadCars();
    loadPromotions();
  }, []);

  // Auto hero rotation whenever activeSlides updates
  useEffect(() => {
    if (activeSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides]);

  // Credit calculation formula
  const downPaymentAmount = (calcCarPrice * downPaymentPercent) / 100;
  const loanAmount = calcCarPrice - downPaymentAmount;
  const monthlyInterestRate = (interestRate / 12) / 100;
  const monthlyPayment = loanAmount > 0
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
    : 0;
  const totalCost = downPaymentAmount + (monthlyPayment * loanTermMonths);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Ismingiz va telefon raqamingizni kiriting.");
      return;
    }
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-test-drive',
          carId: selectedCarId || cars[0]?.id || 'car-malibu',
          name,
          phone,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: notes 
            ? `${notes} \n[User Email: ${user?.email || ''}]` 
            : `Bosh sahifadan ariza \n[User Email: ${user?.email || ''}]`
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
        setName('');
        setPhone('');
        setNotes('');
        setTimeout(() => setBookingSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
      alert(t('error'));
    }
  };

  const faqItems = [
    {
      qUz: "Buxoro Avto Magnat dilerlik markazida avtomobillar kafolati qanday?",
      qRu: "Какова гарантия на автомобили в дилерском центре Buxoro Avto Magnat?",
      qEn: "What is the warranty policy for Chevrolet cars at Buxoro Avto Magnat?",
      aUz: "Barcha yangi Chevrolet avtomobillariga 3 yil yoki 100 000 km (qaysi biri oldin kelsa) rasmiy kafolat taqdim etiladi.",
      aRu: "На все новые автомобили Chevrolet предоставляется официальная гарантия 3 года или 100 000 км пробега.",
      aEn: "All new Chevrolet passenger vehicles carry a factory-backed official warranty for 3 years or 100,000 km."
    },
    {
      qUz: "Kredit yoki muddatli to'lov (rassrochka) uchun qanday hujjatlar kerak?",
      qRu: "Какие документы нужны для оформления кредита или рассрочки?",
      qEn: "What documents are required to apply for credit or installments?",
      aUz: "Odatda shaxsingizni tasdiqlovchi pasport yoki ID karta kifoya. Ba'zi banklar oxirgi 6 oylik ish haqi to'g'risidagi ma'lumotnomani so'rashi mumkin.",
      aRu: "Обычно достаточно паспорта или ID-карты. Некоторые банки могут запросить справку о доходах за последние 6 месяцев.",
      aEn: "Usually, just your national passport or ID card is enough. Certain commercial banks may require income proof for the last 6 months."
    },
    {
      qUz: "Trade-In dasturi bo'yicha eski mashinamni qayerda baholatsam bo'ladi?",
      qRu: "Где я могу оценить свой старый автомобиль по программе Трейд-ин?",
      qEn: "Where can I evaluate my trade-in vehicle?",
      aUz: "Bizning saytimizdagi 'Trade-In' sahifasida onlayn ariza qoldirib, taxminiy narxni bilishingiz mumkin yoki to'g'ridan-to'g'ri shourumimizga kelib, mutaxassis ko'rigidan bepul o'tkazishingiz mumkin.",
      aRu: "Вы можете отправить онлайн-заявку на нашем сайте в разделе «Трейд-Ин» для предварительной оценки или приехать к нам в шоурум для бесплатного техосмотра.",
      aEn: "You can submit an online request via the 'Trade-In' tab for an instant estimate, or visit our physical showroom in Bukhara for a free examination."
    }
  ];

  return (
    <div className="relative">
      
      {/* 1. Hero Slider Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeSlides[currentSlide]?.image || ''})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-left text-white space-y-6">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded"
                >
                  {t('heroSubtitle')}
                </motion.span>
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight"
                >
                  {language === 'ru' ? activeSlides[currentSlide]?.titleRu : language === 'en' ? activeSlides[currentSlide]?.titleEn : activeSlides[currentSlide]?.titleUz}
                </motion.h1>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg sm:text-xl text-gray-300 font-light"
                >
                  {language === 'ru' ? activeSlides[currentSlide]?.taglineRu : language === 'en' ? activeSlides[currentSlide]?.taglineEn : activeSlides[currentSlide]?.taglineUz}
                </motion.p>
                <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link href="/catalog" className="px-8 py-3 bg-gold hover:bg-gold-hover text-black font-extrabold text-center rounded-md shadow-lg shadow-gold/25 transition-all duration-300">
                    {t('heroBtnCatalog')}
                  </Link>
                  <a href="#test-drive-cta" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold border border-white/25 rounded-md text-center backdrop-blur transition-all duration-300">
                    {t('heroBtnBook')}
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-gold w-16' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Featured Cars Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('featuredCars')}
            </h2>
            <div className="w-16 h-1 bg-gold mt-3 rounded" />
          </div>
          <Link href="/catalog" className="text-gold flex items-center hover:underline mt-4 sm:mt-0 font-bold">
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-lg font-bold">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => {
              const isWishlisted = wishlist.includes(car.id);
              const discountPrice = car.price - car.discount;
              return (
                <div key={car.id} className="bg-card text-card-foreground border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative overflow-hidden h-48 bg-neutral-900">
                    <img 
                      src={car.mainImage} 
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    {car.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded">
                        -{formatPrice(car.discount)} so'm
                      </span>
                    )}
                    <button 
                      onClick={() => toggleWishlist(car.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
                        isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-5 flex-grow">
                    <span className="text-xs font-bold text-gold uppercase tracking-widest">{car.category?.nameUz}</span>
                    <h3 className="text-xl font-bold mt-1 group-hover:text-gold transition-colors duration-300">{car.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-y-2 mt-4 text-xs text-foreground/70">
                      <div>⚙️ {car.engine}</div>
                      <div>🕹️ {car.transmission === 'AUTOMATIC' ? 'Avtomat' : 'Mexanik'}</div>
                      <div>🐎 {car.horsepower} HP</div>
                      <div>📅 {car.year}-yil</div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-border mt-2 bg-black/[0.02] dark:bg-white/[0.01]">
                    <div className="flex justify-between items-center pt-4">
                      <div>
                        {car.discount > 0 ? (
                          <>
                            <p className="text-xs line-through text-neutral-500">{formatPrice(car.price)} so'm</p>
                            <p className="text-lg font-black text-gold">{formatPrice(discountPrice)} so'm</p>
                          </>
                        ) : (
                          <p className="text-lg font-black text-foreground">{formatPrice(car.price)} so'm</p>
                        )}
                      </div>
                      <Link 
                        href={`/catalog/${car.id}`}
                        className="p-2 bg-foreground hover:bg-gold hover:text-black rounded text-background font-bold transition-all duration-300 text-xs"
                      >
                        {t('details')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Dealer Advantages */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('advantagesTitle')}
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card border border-border p-6 rounded-xl text-center hover:border-gold/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('advantage1Title')}</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{t('advantage1Desc')}</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl text-center hover:border-gold/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('advantage2Title')}</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{t('advantage2Desc')}</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl text-center hover:border-gold/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('advantage3Title')}</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{t('advantage3Desc')}</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl text-center hover:border-gold/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('advantage4Title')}</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{t('advantage4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Credit Calculator Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Info Side */}
          <div className="space-y-6">
            <span className="text-gold uppercase tracking-widest text-sm font-extrabold flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {t('calcTitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Avtomobilni qulay shartlarda xarid qiling
            </h2>
            <p className="text-foreground/85 leading-relaxed font-light">
              Buxoro Avto Magnat hamkor banklar bilan birgalikda oylik to'lovi moslashuvchan, boshlang'ich to'lov 10% dan boshlanadigan muddatli avtokreditlarni taqdim etadi. O'zingizga mos oylik to'lovni kalkulyatorda hisoblang!
            </p>
            <div className="border border-border p-6 rounded-xl bg-card">
              <h4 className="font-bold text-gold text-lg mb-2">{t('installmentTitle')}</h4>
              <p className="text-sm text-foreground/75 leading-relaxed">{t('installmentDesc')}</p>
            </div>
            <Link 
              href="/credit" 
              className="inline-flex items-center space-x-2 bg-foreground text-background hover:bg-gold hover:text-black px-6 py-3 rounded-md font-bold transition-all duration-300"
            >
              <span>Barcha banklar shartlari</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Calculator workspace */}
          <div className="bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span>{t('calcTitle')}</span>
              <span className="text-xs bg-gold/10 text-gold px-2.5 py-1 rounded">12% - 24% yillik</span>
            </h3>

            {/* Select Car Value input */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Avtomobil narxi:</span>
                <span className="font-bold text-gold">{formatPrice(calcCarPrice)} so'm</span>
              </div>
              <input
                type="range"
                min="50000000"
                max="2000000000"
                step="5000000"
                value={calcCarPrice}
                onChange={(e) => setCalcCarPrice(parseInt(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>

            {/* Downpayment percent slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('downPayment')} ({downPaymentPercent}%):</span>
                <span className="font-bold text-gold">{formatPrice(downPaymentAmount)} so'm</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={downPaymentPercent}
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
                min="12"
                max="60"
                step="12"
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(parseInt(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('interestRate')}:</span>
                <span className="font-bold text-gold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="12"
                max="26"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>

            {/* Calculation Result Panel */}
            <div className="bg-foreground text-background dark:bg-neutral-900 dark:text-white p-5 rounded-xl grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 font-bold">{t('monthlyPayment')}</p>
                <p className="text-xl sm:text-2xl font-black text-gold">{formatPrice(monthlyPayment)} so'm</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold">{t('totalCost')}</p>
                <p className="text-lg font-bold">{formatPrice(totalCost)} so'm</p>
              </div>
            </div>

            <Link href="/credit" className="block text-center w-full bg-gold text-black py-3 rounded-md font-extrabold hover:bg-gold-hover transition-colors duration-300">
              {t('applyForLoan')}
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Customer Reviews Section */}
      <section className="py-20 bg-neutral-900 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {t('reviewsSubtitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              {t('reviewsTitle')}
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-neutral-800/60 p-8 rounded-xl border border-neutral-700 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed italic">
                "Buxoro Avto Magnat salonidan Chevrolet Malibu 2 sotib oldim. Hujjatlarni rasmiylashtirish bor-yo'g'i 3 soat vaqt oldi, trade-in bo'yicha Cobalt mashinamni juda yaxshi narxda baholab berishdi. Juda mamnunman!"
              </p>
              <div>
                <p className="font-bold text-white text-base">Sherzod Shodiyev</p>
                <p className="text-xs text-neutral-400">Tadbirkor, Buxoro sh.</p>
              </div>
            </div>

            <div className="bg-neutral-800/60 p-8 rounded-xl border border-neutral-700 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed italic">
                "Ushbu salondan Tracker sotib oldik. Kredit shartlari boshqa shourumlarga qaraganda juda ma'qul keldi. Oylik foizi past, bank bilan bog'liq ishlarni ham o'zlari hal qilib berishdi."
              </p>
              <div>
                <p className="font-bold text-white text-base">Laylo Hoshimova</p>
                <p className="text-xs text-neutral-400">O'qituvchi, G'ijduvon</p>
              </div>
            </div>

            <div className="bg-neutral-800/60 p-8 rounded-xl border border-neutral-700 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed italic">
                "Menga eng yoqqan tomoni - bu yerda mijozlarga bo'lgan hurmat va professional yondashuv. Savollarimga batafsil javob berishdi. Keyingi safar Cobalt sotib olmoqchimiz, albatta shu yerga murojaat qilamiz."
              </p>
              <div>
                <p className="font-bold text-white text-base">Alisher To'rayev</p>
                <p className="text-xs text-neutral-400">Arxitektor, Kogon</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t('faqTitle')}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded" />
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            const qText = language === 'ru' ? item.qRu : language === 'en' ? item.qEn : item.qUz;
            const aText = language === 'ru' ? item.aRu : language === 'en' ? item.aEn : item.aUz;
            return (
              <div key={idx} className="border border-border bg-card rounded-lg overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center font-bold text-left hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300 text-sm sm:text-base"
                >
                  <span>{qText}</span>
                  <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border px-6 py-4 text-sm text-foreground/80 leading-relaxed bg-black/[0.01] dark:bg-white/[0.01]"
                    >
                      {aText}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Interactive Booking Form CTA */}
      <section id="test-drive-cta" className="py-20 bg-neutral-950 text-white relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200')` }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {t('ctaSubtitle')}
            </p>
            <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
          </div>

          <form onSubmit={handleSubmitBooking} className="bg-neutral-900 border border-neutral-800 p-8 sm:p-10 rounded-2xl space-y-6">
            {bookingSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-lg text-center font-bold">
                {t('successBooking')}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('name')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('ctaPlaceholderName')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('phone')}</label>
                    <input
                      type="text"
                      required
                      placeholder="+998901234567"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val.startsWith('+998')) {
                          setPhone('+998');
                          return;
                        }
                        const suffix = val.substring(4);
                        const digitsOnly = suffix.replace(/\D/g, '');
                        const capped = digitsOnly.substring(0, 9);
                        setPhone('+998' + capped);
                      }}
                      className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Avtomobil modeli</label>
                    <select
                      value={selectedCarId}
                      onChange={(e) => setSelectedCarId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-gold"
                    >
                      {cars.map((car) => (
                        <option key={car.id} value={car.id} className="bg-neutral-950 text-white">
                          {car.name}
                        </option>
                      ))}
                      {cars.length === 0 && <option value="car-malibu">Chevrolet Malibu 2</option>}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Qo'shimcha istaklar (shart emas)</label>
                    <input
                      type="text"
                      placeholder="Masalan: Test-drayv vaqti, shourumga kelish"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-hover text-black py-4 rounded font-extrabold text-center shadow-lg shadow-gold/25 transition-all duration-300"
                >
                  {t('ctaSend')}
                </button>
              </>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}
