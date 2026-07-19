"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AppContextType {
  wishlist: string[];
  compareList: string[];
  recentlyViewed: string[];
  toggleWishlist: (carId: string) => void;
  toggleCompare: (carId: string) => void;
  addToRecentlyViewed: (carId: string) => void;
  clearCompareList: () => void;
  settings: Record<string, string>;
  reloadSettings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    phone: '+998 (65) 221-55-55',
    telegram: 'https://t.me/buxoro_avto_magnat_mock',
    whatsapp: 'https://wa.me/998652215555',
    addressUz: 'Buxoro sh., G‘ijduvon ko‘chasi, 45-uy',
    addressRu: 'г. Бухара, ул. Гиждуванская, 45-дом',
    addressEn: '45 Gijduvan Street, Bukhara city'
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load settings in context", e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Scoped keys based on user login
    const userPrefix = user ? `user_${user.id}_` : 'guest_';
    const savedWish = localStorage.getItem(`${userPrefix}wishlist`);
    const savedComp = localStorage.getItem(`${userPrefix}compare`);
    const savedRecent = localStorage.getItem(`${userPrefix}recentlyViewed`);

    setWishlist(savedWish ? JSON.parse(savedWish) : []);
    setCompareList(savedComp ? JSON.parse(savedComp) : []);
    setRecentlyViewed(savedRecent ? JSON.parse(savedRecent) : []);
    
    setMounted(true);
  }, [user]);

  const toggleWishlist = (carId: string) => {
    const userPrefix = user ? `user_${user.id}_` : 'guest_';
    setWishlist((prev) => {
      const updated = prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId];
      localStorage.setItem(`${userPrefix}wishlist`, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCompare = (carId: string) => {
    const userPrefix = user ? `user_${user.id}_` : 'guest_';
    setCompareList((prev) => {
      // Allow maximum 3 cars in compare list
      if (!prev.includes(carId) && prev.length >= 3) {
        alert("Siz maksimal 3 ta avtomobilni taqqoslashingiz mumkin. (You can compare up to 3 cars.)");
        return prev;
      }
      const updated = prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId];
      localStorage.setItem(`${userPrefix}compare`, JSON.stringify(updated));
      return updated;
    });
  };

  const addToRecentlyViewed = (carId: string) => {
    const userPrefix = user ? `user_${user.id}_` : 'guest_';
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== carId);
      const updated = [carId, ...filtered].slice(0, 5); // Store top 5 recent cars
      localStorage.setItem(`${userPrefix}recentlyViewed`, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompareList = () => {
    const userPrefix = user ? `user_${user.id}_` : 'guest_';
    setCompareList([]);
    localStorage.removeItem(`${userPrefix}compare`);
  };

  return (
    <AppContext.Provider value={{
      wishlist,
      compareList,
      recentlyViewed,
      toggleWishlist,
      toggleCompare,
      addToRecentlyViewed,
      clearCompareList,
      settings,
      reloadSettings: fetchSettings
    }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
