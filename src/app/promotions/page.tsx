"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Gift, Calendar, Percent } from 'lucide-react';

export default function Promotions() {
  const { t, language } = useLanguage();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromos() {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          setPromos(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPromos();
  }, []);

  if (loading) return <div className="text-center py-40 font-bold text-lg">{t('loading')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('promotionsTitle')}</h1>
        <p className="text-sm text-neutral-400 mt-2">{t('promotionsSubtitle')}</p>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
      </div>

      {promos.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 font-bold">Faol aksiyalar mavjud emas. (No active promotions)</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promos.map((promo) => {
            const title = language === 'ru' ? promo.titleRu : language === 'en' ? promo.titleEn : promo.titleUz;
            const desc = language === 'ru' ? promo.descriptionRu : language === 'en' ? promo.descriptionEn : promo.descriptionUz;
            const dateStr = new Date(promo.endDate).toLocaleDateString();

            return (
              <div key={promo.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div className="h-60 bg-neutral-900 overflow-hidden relative">
                  <img src={promo.image} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {promo.discountValue > 0 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" />
                      <span>Chegirma: -${promo.discountValue.toLocaleString()}</span>
                    </span>
                  )}
                </div>
                <div className="p-6 flex-grow space-y-4">
                  <h3 className="text-xl font-bold mt-1 text-foreground group-hover:text-gold">{title}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-light">{desc}</p>
                </div>
                <div className="p-6 pt-0 border-t border-border mt-2 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>{t('activeUntil')}: <strong>{dateStr}</strong></span>
                  </div>
                  <Gift className="w-4 h-4 text-gold" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
