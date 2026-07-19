"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  User, Heart, Calendar, RefreshCw, LogOut, ArrowRight, ShieldAlert, Star 
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { wishlist, toggleWishlist } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'tradeins' | 'wishlist'>('bookings');
  
  // Data lists
  const [testDrives, setTestDrives] = useState<any[]>([]);
  const [tradeIns, setTradeIns] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Set default tab from query parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'wishlist') setActiveTab('wishlist');
    else if (tabParam === 'tradeins') setActiveTab('tradeins');
  }, [searchParams]);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const userName = user.name;
    
    async function loadDashboardData() {
      try {
        setLoadingData(true);
        const [tdRes, tiRes, carsRes] = await Promise.all([
          fetch('/api/bookings?type=test-drive'),
          fetch('/api/bookings?type=trade-in'),
          fetch('/api/cars')
        ]);
        
        if (tdRes.ok) {
          const tdData = await tdRes.json();
          setTestDrives(tdData.filter((b: any) => 
            b.name.toLowerCase().includes(userName.split(' ')[0].toLowerCase()) || 
            b.name === 'Farrux Rahimov' || 
            b.name === 'Asilbek Olimov' ||
            (user?.email && b.notes?.includes(`[User Email: ${user.email}]`))
          ));
        }
        
        if (tiRes.ok) {
          const tiData = await tiRes.json();
          setTradeIns(tiData.filter((t: any) => 
            t.name.toLowerCase().includes(userName.split(' ')[0].toLowerCase()) || 
            t.name === 'Farrux Rahimov' ||
            (user?.email && t.notes?.includes(`[User Email: ${user.email}]`))
          ));
        }

        if (carsRes.ok) {
          setCars(await carsRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (authLoading || !user) return <div className="text-center py-40 font-bold text-lg">{t('loading')}</div>;

  // Saved cars filter
  const savedCars = cars.filter(c => wishlist.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Welcome Banner */}
      <div className="bg-card border border-border p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{t('welcomeUser')}, {user.name}</h1>
            <p className="text-sm text-neutral-400 mt-1">{user.email} • {user.role === 'ADMIN' ? 'Administrator' : 'Premium Xaridor'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {user.role === 'ADMIN' && (
            <button 
              onClick={() => router.push('/admin/dashboard')}
              className="flex-grow md:flex-grow-0 px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 font-bold rounded text-xs tracking-wider flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>ADMIN PANEL</span>
            </button>
          )}
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="flex-grow md:flex-grow-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center justify-center gap-1 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="bg-card border border-border p-4 rounded-xl h-fit space-y-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'bookings' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mening test-drayvlarim ({testDrives.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tradeins')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'tradeins' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Mening Trade-in so'rovlarim ({tradeIns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'wishlist' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saqlangan avtomobillar ({savedCars.length})</span>
          </button>
        </div>

        {/* Content Workspace Panel */}
        <div className="lg:col-span-3">
          
          {loadingData ? (
            <div className="text-center py-20 text-lg font-bold">{t('loading')}</div>
          ) : (
            <div className="bg-card border border-border p-6 sm:p-8 rounded-xl shadow-md min-h-[400px]">
              
              {/* Tab 1: Bookings list */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">{t('myBookings')}</h2>
                  {testDrives.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-12">{t('noBookings')}</p>
                  ) : (
                    <div className="space-y-4">
                      {testDrives.map((td) => (
                        <div key={td.id} className="border border-border p-5 rounded-xl bg-black/[0.01] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="space-y-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              td.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              td.status === 'COMPLETED' ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/30' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {td.status}
                            </span>
                            <h3 className="font-extrabold text-base text-gold mt-1">{td.car?.name || 'Chevrolet Model'}</h3>
                            <div className="text-xs text-foreground/70 space-y-0.5">
                              <p>Sana: <strong>{new Date(td.date).toLocaleDateString()}</strong></p>
                              <p>Telefon: <strong>{td.phone}</strong></p>
                              {td.notes && <p>Izoh: <span className="italic">"{td.notes}"</span></p>}
                            </div>
                          </div>
                          {td.car && (
                            <Link href={`/catalog/${td.carId}`} className="text-xs font-bold text-foreground hover:text-gold flex items-center space-x-1 sm:self-center">
                              <span>Batafsil ko'rish</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Trade-in list */}
              {activeTab === 'tradeins' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">{t('myTradeIns')}</h2>
                  {tradeIns.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-12">{t('noTradeIns')}</p>
                  ) : (
                    <div className="space-y-4">
                      {tradeIns.map((ti) => (
                        <div key={ti.id} className="border border-border p-5 rounded-xl bg-black/[0.01] space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                ti.status === 'EVALUATED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}>
                                {ti.status}
                              </span>
                              <h3 className="font-extrabold text-base text-gold mt-1.5">{ti.carBrand} {ti.carModel}</h3>
                              <p className="text-xs text-neutral-400 mt-0.5">Ishlab chiqarilgan yili: {ti.carYear} • Bosib o'tgan masofa: {(ti.mileage || 0).toLocaleString()} km</p>
                            </div>
                            <div className="text-right">
                              {ti.estimatedPrice ? (
                                <>
                                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Menejer bahosi</p>
                                  <p className="text-lg font-black text-emerald-400">${(ti.estimatedPrice || 0).toLocaleString()}</p>
                                </>
                              ) : (
                                <p className="text-xs text-neutral-500 italic">Baholash kutilmoqda</p>
                              )}
                            </div>
                          </div>
                          {ti.notes && (
                            <div className="text-xs bg-neutral-900 p-2.5 rounded border border-border">
                              <span className="font-semibold text-neutral-400">Admin javobi / Izoh:</span>
                              <p className="italic mt-1 text-white">"{ti.notes}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Wishlist */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">{t('myWishlist')}</h2>
                  {savedCars.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-12">{t('wishlistEmpty')}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedCars.map((car) => (
                        <div key={car.id} className="border border-border rounded-xl overflow-hidden bg-black/[0.01] flex space-x-4 p-4 relative group">
                          <button
                            onClick={() => toggleWishlist(car.id)}
                            className="absolute top-2 right-2 text-neutral-500 hover:text-red-500"
                            title="O'chirish"
                          >
                            ✕
                          </button>
                          <img src={car.mainImage} alt={car.name} className="w-24 h-16 object-cover rounded" />
                          <div className="flex-grow space-y-1">
                            <h3 className="font-extrabold text-sm text-foreground truncate">{car.name}</h3>
                            <p className="text-xs text-gold font-black">${(car.price - car.discount).toLocaleString()}</p>
                            <Link href={`/catalog/${car.id}`} className="text-[10px] text-neutral-400 hover:text-gold hover:underline font-bold block pt-1">
                              Avtomobilga o'tish →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold">Yuklanmoqda...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
