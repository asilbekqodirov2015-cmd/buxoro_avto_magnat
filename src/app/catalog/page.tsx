"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../lib/translations';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, Heart, ArrowLeftRight, 
  Trash2, X, AlertCircle, Sparkles, Check
} from 'lucide-react';

function CatalogContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isCompareView = searchParams.get('compare') === 'true';

  const { wishlist, compareList, toggleWishlist, toggleCompare, clearCompareList } = useApp();

  const [cars, setCars] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedTrans, setSelectedTrans] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('priceAsc');
  
  // Layout State: 'grid' | 'list'
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function initCatalog() {
      try {
        setLoading(true);
        // Load categories and colors
        const [catsRes, colsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/colors')
        ]);
        if (catsRes.ok) setCategories(await catsRes.json());
        if (colsRes.ok) setColors(await colsRes.json());

        // Load cars with params (ignore filters if we are in comparison view to load all cars)
        const params = new URLSearchParams();
        if (!isCompareView) {
          if (search) params.append('search', search);
          if (selectedCat !== 'all') params.append('category', selectedCat);
          if (selectedTrans !== 'all') params.append('transmission', selectedTrans);
          if (selectedFuel !== 'all') params.append('fuelType', selectedFuel);
          if (minPrice) params.append('minPrice', minPrice);
          if (maxPrice) params.append('maxPrice', maxPrice);
          params.append('sort', sort);
        }

        const carsRes = await fetch(`/api/cars?${params.toString()}`);
        if (carsRes.ok) {
          setCars(await carsRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initCatalog();
  }, [search, selectedCat, selectedTrans, selectedFuel, minPrice, maxPrice, sort, isCompareView]);

  // AI recommendations trigger
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecResult, setAiRecResult] = useState<any>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiBudget, setAiBudget] = useState('30000');
  const [aiPurpose, setAiPurpose] = useState('city');

  const triggerAIRecommendation = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: aiBudget,
          purpose: aiPurpose,
          lang: language
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiRecResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // List of compared cars details
  const comparedCars = cars.filter(c => compareList.includes(c.id));

  // Render Compare workspace
  if (isCompareView) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t('compareTitle')}</h1>
            <p className="text-sm text-neutral-400 mt-1">Siz tanlagan modellarning texnik solishtiruvi</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={clearCompareList} 
              className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded text-sm font-semibold transition-all duration-300"
            >
              Tozalash
            </button>
            <button 
              onClick={() => router.push('/catalog')} 
              className="px-4 py-2 bg-gold text-black rounded text-sm font-bold shadow hover:bg-gold-hover transition-all duration-300"
            >
              {t('backToCatalog')}
            </button>
          </div>
        </div>

        {comparedCars.length === 0 ? (
          <div className="border border-border p-12 text-center rounded-xl bg-card">
            <AlertCircle className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
            <p className="font-bold text-lg text-neutral-400">{t('compareEmpty')}</p>
            <Link href="/catalog" className="text-gold underline text-sm mt-2 inline-block font-semibold">
              Katalogdan avtomobillar tanlang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            
            {/* Legend Column */}
            <div className="hidden md:block bg-card/40 border border-border/80 rounded-xl p-5 mt-[250px] space-y-6 text-sm text-foreground/70">
              <div className="pb-4 border-b border-border/50 font-bold text-foreground">Xususiyatlar</div>
              <div className="h-10 flex items-center">Narxi</div>
              <div className="h-10 flex items-center">{t('year')}</div>
              <div className="h-10 flex items-center">{t('engine')}</div>
              <div className="h-10 flex items-center">{t('transmissionType')}</div>
              <div className="h-10 flex items-center">{t('fuel')}</div>
              <div className="h-10 flex items-center">{t('horsepower')}</div>
              <div className="h-10 flex items-center">VIN Kod</div>
            </div>

            {/* Cars Columns */}
            {comparedCars.map(car => (
              <div key={car.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 relative">
                <button 
                  onClick={() => toggleCompare(car.id)}
                  className="absolute top-3 right-3 p-1.5 bg-black/80 hover:bg-red-600 rounded-full text-white z-10 transition-colors duration-200"
                  title="Taqqoslashdan o'chirish"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="h-44 bg-neutral-900 overflow-hidden relative">
                  <img src={car.mainImage} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-xs text-gold font-bold uppercase tracking-wider">{car.category?.nameUz}</span>
                    <h3 className="text-lg font-bold text-foreground truncate">{car.name}</h3>
                  </div>

                  {/* Mobil Specs (shows under image if column) */}
                  <div className="space-y-2 text-sm">
                    <div className="flex md:block justify-between border-b border-border/40 pb-2">
                      <span className="md:hidden text-xs text-neutral-400">Narxi:</span>
                      <p className="font-extrabold text-gold text-base">{formatPrice(car.price)} so'm</p>
                    </div>
                    <div className="flex md:block justify-between border-b border-border/40 pb-2 h-10 items-center">
                      <span className="md:hidden text-xs text-neutral-400">{t('year')}:</span>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                    <div className="flex md:block justify-between border-b border-border/40 pb-2 h-10 items-center">
                      <span className="md:hidden text-xs text-neutral-400">{t('engine')}:</span>
                      <p>{car.engine}</p>
                    </div>
                    <div className="flex md:block justify-between border-b border-border/40 pb-2 h-10 items-center">
                      <span className="md:hidden text-xs text-neutral-400">Kutisi:</span>
                      <p>{car.transmission === 'AUTOMATIC' ? 'Avtomat' : 'Mexanik'}</p>
                    </div>
                    <div className="flex md:block justify-between border-b border-border/40 pb-2 h-10 items-center">
                      <span className="md:hidden text-xs text-neutral-400">{t('fuel')}:</span>
                      <p>{car.fuelType}</p>
                    </div>
                    <div className="flex md:block justify-between border-b border-border/40 pb-2 h-10 items-center">
                      <span className="md:hidden text-xs text-neutral-400">Quvvat:</span>
                      <p>{car.horsepower} ot kuchi</p>
                    </div>
                    <div className="flex md:block justify-between h-10 items-center">
                      <span className="md:hidden text-xs text-neutral-400">VIN:</span>
                      <p className="text-[10px] uppercase font-mono truncate">{car.vin}</p>
                    </div>
                  </div>

                  <Link 
                    href={`/catalog/${car.id}`}
                    className="block text-center w-full bg-foreground text-background py-2 rounded text-xs font-bold hover:bg-gold hover:text-black transition-all duration-300"
                  >
                    Batafsil ma'lumot
                  </Link>
                </div>
              </div>
            ))}

            {/* Empty columns slots */}
            {[...Array(3 - comparedCars.length)].map((_, i) => (
              <div key={i} className="hidden md:flex flex-col items-center justify-center border border-dashed border-border rounded-xl h-[450px] bg-card/10 text-neutral-500">
                <ArrowLeftRight className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-xs text-center px-4 font-semibold">Taqqoslash uchun yana avtomobil qo'shing</p>
                <Link href="/catalog" className="text-xs text-gold underline font-bold mt-2">Katalogga o'tish</Link>
              </div>
            ))}

          </div>
        )}
      </div>
    );
  }

  // Regular Catalog View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Catalog Title + AI Advice trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('navCatalog')}</h1>
          <div className="w-16 h-1 bg-gold mt-2 rounded" />
        </div>
        
        {/* Premium AI Recommender button */}
        <button
          onClick={() => setAiOpen(true)}
          className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black px-5 py-2.5 rounded-lg text-sm font-extrabold shadow-lg shadow-yellow-500/20 active:scale-95 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 text-black fill-current animate-pulse" />
          <span>AI Avto Maslahatchi</span>
        </button>
      </div>

      {/* Grid: Filters Panel & Car Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="bg-card border border-border p-6 rounded-xl space-y-6 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <h2 className="font-extrabold text-lg flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold" />
              <span>{t('filterTitle')}</span>
            </h2>
            <button 
              onClick={() => {
                setSearch(''); setSelectedCat('all'); setSelectedTrans('all');
                setSelectedFuel('all'); setMinPrice(''); setMaxPrice('');
              }}
              className="text-xs text-neutral-500 hover:text-gold hover:underline"
            >
              Tozalash
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded-md text-sm text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
          </div>

          {/* Body Style Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Toifa</label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 rounded-md text-sm text-foreground focus:outline-none focus:border-gold"
            >
              <option value="all">{t('categoryAll')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ru' ? c.nameRu : language === 'en' ? c.nameEn : c.nameUz}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('transmission')}</label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'AUTOMATIC', 'MANUAL'].map((tType) => (
                <button
                  key={tType}
                  onClick={() => setSelectedTrans(tType)}
                  className={`py-1.5 rounded-md text-xs font-semibold border ${
                    selectedTrans === tType 
                      ? 'border-gold bg-gold/10 text-gold font-bold' 
                      : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-900 text-foreground'
                  }`}
                >
                  {tType === 'all' ? 'Barchasi' : tType === 'AUTOMATIC' ? 'Avtomat' : 'Mexanik'}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('fuelType')}</label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 rounded-md text-sm text-foreground focus:outline-none focus:border-gold"
            >
              <option value="all">Barchasi</option>
              <option value="PETROL">Petrol (Benzin)</option>
              <option value="GAS">Gas (Metan/Propan)</option>
              <option value="ELECTRIC">Electric (Elektr)</option>
              <option value="HYBRID">Hybrid (Gibrid)</option>
            </select>
          </div>

          {/* Price ranges */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('priceRange')}</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 bg-background border border-border px-2 py-1.5 rounded text-sm text-foreground focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 bg-background border border-border px-2 py-1.5 rounded text-sm text-foreground focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('sortBy')}</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 rounded-md text-sm text-foreground focus:outline-none focus:border-gold"
            >
              <option value="priceAsc">{t('sortPriceAsc')}</option>
              <option value="priceDesc">{t('sortPriceDesc')}</option>
              <option value="yearDesc">{t('sortYearDesc')}</option>
            </select>
          </div>

        </div>

        {/* Cars List / Grid Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Layout Controls Bar */}
          <div className="flex justify-between items-center bg-card border border-border p-4 rounded-xl">
            <p className="text-sm font-semibold text-foreground/75">
              Topildi: <span className="text-gold font-bold">{cars.length}</span> avtomobil
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded ${layout === 'grid' ? 'bg-gold text-black' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
                title="Grid layout"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded ${layout === 'list' ? 'bg-gold text-black' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
                title="List layout"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Catalog items */}
          {loading ? (
            <div className="text-center py-20 font-bold text-lg">{t('loading')}</div>
          ) : cars.length === 0 ? (
            <div className="border border-border p-20 text-center rounded-xl bg-card space-y-3">
              <AlertCircle className="w-12 h-12 text-neutral-500 mx-auto" />
              <p className="font-bold text-lg text-neutral-400">{t('noCarsFound')}</p>
            </div>
          ) : (
            <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
              {cars.map((car) => {
                const isLiked = wishlist.includes(car.id);
                const isCompared = compareList.includes(car.id);
                const finalPrice = car.price - car.discount;
                
                if (layout === 'grid') {
                  return (
                    <div key={car.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col justify-between group">
                      <div className="h-44 bg-neutral-900 overflow-hidden relative">
                        <img src={car.mainImage} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                        <button 
                          onClick={() => toggleWishlist(car.id)}
                          className={`absolute top-3 right-3 p-1.5 rounded-full border border-white/20 transition-all duration-300 ${
                            isLiked ? 'bg-red-500 text-white' : 'bg-black/55 text-white hover:bg-white hover:text-black'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <button 
                          onClick={() => toggleCompare(car.id)}
                          className={`absolute top-3 left-3 p-1.5 rounded-full border border-white/20 transition-all duration-300 ${
                            isCompared ? 'bg-gold text-black' : 'bg-black/55 text-white hover:bg-white hover:text-black'
                          }`}
                          title="Taqqoslashga qo'shish"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 flex-grow">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{car.category?.nameUz}</span>
                        <h3 className="text-lg font-bold text-foreground truncate mt-1 group-hover:text-gold transition-colors duration-300">{car.name}</h3>
                        <div className="grid grid-cols-2 gap-y-1.5 text-xs text-foreground/70 mt-3">
                          <div>⚙️ {car.engine}</div>
                          <div>🕹️ {car.transmission === 'AUTOMATIC' ? 'Avtomat' : 'Mexanik'}</div>
                          <div>🐎 {car.horsepower} HP</div>
                          <div>📅 {car.year}</div>
                        </div>
                      </div>
                      <div className="p-4 pt-0 border-t border-border mt-2 bg-black/[0.01]">
                        <div className="flex justify-between items-center pt-3">
                          <div>
                            {car.discount > 0 ? (
                              <>
                                <p className="text-[10px] line-through text-neutral-500">{formatPrice(car.price)} so'm</p>
                                <p className="text-base font-black text-gold">{formatPrice(finalPrice)} so'm</p>
                              </>
                            ) : (
                              <p className="text-base font-black text-foreground">{formatPrice(car.price)} so'm</p>
                            )}
                          </div>
                          <Link href={`/catalog/${car.id}`} className="px-3 py-1.5 bg-foreground text-background dark:bg-neutral-800 dark:text-white rounded hover:bg-gold hover:text-black text-xs font-bold transition-all duration-300">
                            {t('details')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // List Layout
                  return (
                    <div key={car.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 flex flex-col md:flex-row group">
                      <div className="w-full md:w-64 h-44 bg-neutral-900 relative flex-shrink-0">
                        <img src={car.mainImage} alt={car.name} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => toggleWishlist(car.id)}
                          className={`absolute top-3 right-3 p-1.5 rounded-full border border-white/20 ${
                            isLiked ? 'bg-red-500 text-white' : 'bg-black/55 text-white hover:bg-white hover:text-black'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <button 
                          onClick={() => toggleCompare(car.id)}
                          className={`absolute top-3 left-3 p-1.5 rounded-full border border-white/20 ${
                            isCompared ? 'bg-gold text-black' : 'bg-black/55 text-white hover:bg-white hover:text-black'
                          }`}
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs text-gold font-bold uppercase tracking-wider">{car.category?.nameUz}</span>
                              <h3 className="text-xl font-bold mt-1 group-hover:text-gold transition-colors duration-300">{car.name}</h3>
                            </div>
                            <div className="text-right">
                              {car.discount > 0 ? (
                                <>
                                  <p className="text-xs line-through text-neutral-500">{formatPrice(car.price)} so'm</p>
                                  <p className="text-xl font-black text-gold">{formatPrice(finalPrice)} so'm</p>
                                </>
                              ) : (
                                <p className="text-xl font-black text-foreground">{formatPrice(car.price)} so'm</p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-foreground/70 line-clamp-2 mt-2 leading-relaxed">
                            {language === 'ru' ? car.descriptionRu : language === 'en' ? car.descriptionEn : car.descriptionUz}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50 text-xs">
                          <div className="flex space-x-6 text-foreground/75">
                            <span>⚙️ <strong>{car.engine}</strong></span>
                            <span>🕹️ <strong>{car.transmission === 'AUTOMATIC' ? 'Avtomat' : 'Mexanik'}</strong></span>
                            <span>🐎 <strong>{car.horsepower} HP</strong></span>
                            <span>📅 <strong>{car.year}</strong></span>
                          </div>
                          <Link href={`/catalog/${car.id}`} className="px-4 py-2 bg-foreground text-background dark:bg-neutral-800 dark:text-white rounded hover:bg-gold hover:text-black font-extrabold transition-all duration-300">
                            {t('details')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}

        </div>

      </div>

      {/* AI car recommender modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-lg w-full p-8 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setAiOpen(false); setAiRecResult(null); }}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-extrabold flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-gold fill-current" />
              <span>AI Avto Maslahatchi</span>
            </h3>

            {!aiRecResult ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Budjetingiz (USD)</label>
                  <input
                    type="number"
                    value={aiBudget}
                    onChange={(e) => setAiBudget(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Siz uchun eng muhimi</label>
                  <select
                    value={aiPurpose}
                    onChange={(e) => setAiPurpose(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="city">Shahar ichida, tejamkor (City Commute)</option>
                    <option value="family">Keng oilaviy sayohatlar (Family Crossover)</option>
                    <option value="luxury">Hashamat, status va quvvat (Luxury/Status)</option>
                  </select>
                </div>

                <button
                  onClick={triggerAIRecommendation}
                  disabled={aiLoading}
                  className="w-full bg-gold hover:bg-gold-hover disabled:bg-neutral-800 disabled:text-neutral-500 text-black py-4 rounded-xl font-extrabold text-center transition-all duration-300"
                >
                  {aiLoading ? 'AI tahlil qilmoqda...' : 'Tavsiya olish'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-neutral-100 dark:bg-neutral-900 border border-border p-4 rounded-xl flex items-center space-x-4">
                  <img src={aiRecResult.car.mainImage} alt={aiRecResult.car.name} className="w-24 h-16 object-cover rounded" />
                  <div>
                    <h4 className="font-extrabold text-lg text-gold">{aiRecResult.car.name}</h4>
                    <p className="text-sm font-bold">{formatPrice(aiRecResult.car.price)} so'm</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-border">
                  <p className="text-xs font-extrabold text-gold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Nima uchun mos keladi:
                  </p>
                  <p className="text-foreground/90 leading-relaxed font-light mt-2">{aiRecResult.explanation}</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => { setAiRecResult(null); }}
                    className="w-1/2 py-3 border border-border text-foreground rounded font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 text-sm transition-all"
                  >
                    Qayta hisoblash
                  </button>
                  <Link 
                    href={`/catalog/${aiRecResult.car.id}`}
                    onClick={() => setAiOpen(false)}
                    className="w-1/2 bg-gold text-black font-extrabold py-3 rounded text-center block text-sm hover:bg-gold-hover transition-colors"
                  >
                    Avtomobilga o'tish
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold">Yuklanmoqda...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
