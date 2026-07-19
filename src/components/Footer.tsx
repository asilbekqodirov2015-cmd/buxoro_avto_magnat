"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, Send, Globe } from 'lucide-react';

export default function Footer() {
  const { t, language } = useLanguage();
  const { settings } = useApp();

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Buxoro Avto Magnat Logo" className="w-12 h-12 object-contain rounded-full border border-gold/40 bg-black" />
              <span className="text-2xl font-black tracking-wider uppercase flex flex-col leading-none">
                <span className="text-gold font-serif text-lg">BUXORO AVTO</span>
                <span className="text-white font-sans text-xs tracking-widest font-light">MAGNAT</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 mt-2">
              {t('heroSubtitle')}
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href={settings.telegram || "https://t.me/buxoro_avto_magnat_mock"} target="_blank" className="p-2 bg-neutral-900 rounded-full hover:bg-gold hover:text-black transition-all duration-300">
                <Send className="w-4 h-4" />
              </Link>
              <Link href={settings.whatsapp || "https://wa.me/998652215555"} target="_blank" className="p-2 bg-neutral-900 rounded-full hover:bg-gold hover:text-black transition-all duration-300">
                <Phone className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-gold hover:text-black transition-all duration-300">
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wider mb-4 border-l-2 border-gold pl-3">
              {t('navCatalog')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-gold transition-all duration-200">Chevrolet Malibu 2</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-gold transition-all duration-200">Chevrolet Tracker 2</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-gold transition-all duration-200">Chevrolet Tahoe Premier</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-gold transition-all duration-200">Chevrolet Onix</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-gold transition-all duration-200">Chevrolet Captiva 5</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wider mb-4 border-l-2 border-gold pl-3">
              {t('navAbout')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/credit" className="hover:text-gold transition-all duration-200">{t('navCredit')}</Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-gold transition-all duration-200">{t('navTradeIn')}</Link>
              </li>
              <li>
                <Link href="/promotions" className="hover:text-gold transition-all duration-200">{t('navPromotions')}</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold transition-all duration-200">{t('navBlog')}</Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-gold transition-all duration-200">{t('navLocations')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div className="space-y-3 text-sm">
            <h3 className="text-white text-lg font-semibold tracking-wider mb-4 border-l-2 border-gold pl-3">
              {t('navContact')}
            </h3>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span>{language === 'ru' ? settings.addressRu : language === 'en' ? settings.addressEn : settings.addressUz}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{settings.email || 'info@buxoroavtomagnat.uz'}</span>
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{t('workHours')}</p>
                <p className="text-xs text-neutral-400">{t('weekDays')}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Embedded Map Widget */}
        <div className="w-full h-64 rounded-lg overflow-hidden mb-8 border border-neutral-800">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.126581335967!2d64.4425145!3d39.7940166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f500fcf43ab3ed3%3A0xcaf21bdee3fe081c!2sOOO%20%22BUXARA%20AVTO%20MAGNAT%22!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(100%)' }} 
            allowFullScreen={false} 
            loading="lazy"
            title="Buxoro Avto Magnat Map"
          ></iframe>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Buxoro Avto Magnat. Barcha huquqlar himoyalangan.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-gold">Maxfiylik siyosati</Link>
            <Link href="/terms" className="hover:text-gold">Foydalanish shartlari</Link>
            <Link href="/sitemap.xml" className="hover:text-gold">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
