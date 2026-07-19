"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Car, Heart, ArrowLeftRight, Sun, Moon, LogIn, LogOut, User, Menu, X, ShieldAlert 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { wishlist, compareList } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/', label: t('navHome') },
    { href: '/catalog', label: t('navCatalog') },
    { href: '/credit', label: t('navCredit') },
    { href: '/trade-in', label: t('navTradeIn') },
    { href: '/promotions', label: t('navPromotions') },
    { href: '/blog', label: t('navBlog') },
    { href: '/locations', label: t('navLocations') },
    { href: '/about', label: t('navAbout') }
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Buxoro Avto Magnat Logo" className="w-10 h-10 object-contain rounded-full border border-gold/40 bg-black" />
              <span className="text-xl font-black tracking-wider uppercase flex flex-col justify-center leading-none">
                <span className="text-gold font-serif text-base">BUXORO AVTO</span>
                <span className="text-white font-sans text-xs tracking-widest font-light">MAGNAT</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-2 xl:space-x-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-gold border-b-2 border-gold font-semibold' 
                      : 'text-foreground/80 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Utility Buttons (Language, Theme, Wishlist, Auth) */}
          <div className="hidden xl:flex items-center space-x-3">
            
            {/* Language Switcher */}
            <div className="flex border border-border rounded-md overflow-hidden bg-background/50">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-xs font-bold uppercase transition-all duration-300 ${
                    language === lang 
                      ? 'bg-gold text-black' 
                      : 'text-foreground/75 hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/80 hover:text-gold hover:bg-white/5 rounded-full transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-800" />}
            </button>

            {/* Wishlist Link */}
            <Link 
              href="/dashboard?tab=wishlist" 
              className="p-2 text-foreground/80 hover:text-gold hover:bg-white/5 rounded-full relative transition-all duration-300"
              title={t('wishlistBtn')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Compare Link */}
            <Link 
              href="/catalog?compare=true" 
              className="p-2 text-foreground/80 hover:text-gold hover:bg-white/5 rounded-full relative transition-all duration-300"
              title={t('compareBtn')}
            >
              <ArrowLeftRight className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Admin Panel Link */}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-1 bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider transition-all duration-300"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>ADMIN</span>
              </Link>
            )}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2">
                <Link href="/dashboard" className="flex items-center space-x-1 text-sm font-semibold text-foreground hover:text-gold">
                  <User className="w-4 h-4 text-gold" />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-300"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 bg-gold hover:bg-gold-hover text-black px-4 py-2 rounded-md text-sm font-bold shadow-md shadow-gold/20 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('login')}</span>
              </Link>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/80 hover:bg-white/5 rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-800" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:text-gold focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass border-t border-border animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 text-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-semibold text-foreground hover:text-gold hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-border/50 flex flex-col items-center space-y-4">
              {/* Mobile Language Switches */}
              <div className="flex border border-border rounded-md overflow-hidden bg-background">
                {(['uz', 'ru', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setMobileMenuOpen(false); }}
                    className={`px-4 py-2 text-sm font-bold uppercase ${
                      language === lang ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-white/10'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Wishlist / Compare */}
              <div className="flex space-x-6 text-sm">
                <Link href="/dashboard?tab=wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-1 hover:text-gold">
                  <Heart className="w-5 h-5 text-gold" />
                  <span>{t('wishlistBtn')} ({wishlist.length})</span>
                </Link>
                <Link href="/catalog?compare=true" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-1 hover:text-gold">
                  <ArrowLeftRight className="w-5 h-5 text-gold" />
                  <span>{t('compareBtn')} ({compareList.length})</span>
                </Link>
              </div>

              {/* Admin Check */}
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gold/10 border border-gold/30 text-gold px-6 py-2 rounded-md font-bold text-sm"
                >
                  ADMIN PANEL
                </Link>
              )}

              {/* Auth Button Mobile */}
              {user ? (
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-sm font-bold">{t('welcomeUser')}, {user.name}</p>
                  <div className="flex space-x-4">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gold underline text-sm font-bold">
                      {t('navDashboard')}
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 text-sm font-bold">
                      {t('logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-4/5 bg-gold text-black py-2.5 rounded-md font-bold text-center shadow-lg shadow-gold/25"
                >
                  {t('login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
