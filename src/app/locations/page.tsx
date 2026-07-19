"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Phone, Clock, Compass } from 'lucide-react';

export default function Locations() {
  const { t, language } = useLanguage();
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch('/api/branches');
        if (res.ok) {
          const data = await res.json();
          setBranches(data.branches || []);
        }
      } catch (error) {
        console.error('Error loading branches:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBranches();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{t('locationsTitle')}</h1>
        <p className="text-sm text-neutral-400 mt-2">{t('locationsSubtitle')}</p>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-lg font-bold">{t('loading')}</div>
      ) : (
        <div className="space-y-12">
          {branches.map((branch, idx) => {
            const name = language === 'ru' ? branch.nameRu : language === 'en' ? branch.nameEn : branch.nameUz;
            const address = language === 'ru' ? branch.addressRu : language === 'en' ? branch.addressEn : branch.addressUz;
            const hours = language === 'ru' ? branch.hoursRu : language === 'en' ? branch.hoursEn : branch.hoursUz;

            return (
              <div key={branch.id || idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
                
                {/* Info Side */}
                <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-gold text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      <span>Filial #{idx + 1}</span>
                    </span>
                    <h2 className="text-2xl font-extrabold text-white">{name}</h2>
                    
                    <div className="space-y-3 text-sm text-foreground/80 pt-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span>{address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">{t('workHours')}</p>
                          <p className="text-xs text-neutral-400">{hours}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`}
                    className="w-full sm:w-fit bg-gold hover:bg-gold-hover text-black py-2.5 px-6 rounded font-extrabold text-sm text-center block transition-all"
                  >
                    Qo'ng'iroq qilish
                  </a>
                </div>

                {/* Map Side */}
                <div className="h-72 lg:h-auto min-h-[300px] border-t lg:border-t-0 lg:border-l border-border bg-neutral-900">
                  <iframe
                    src={branch.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(100%)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={`${name} map`}
                  ></iframe>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
