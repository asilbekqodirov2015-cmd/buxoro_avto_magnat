"use client";

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Target, Landmark, Users } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('navAbout')}</h1>
        <p className="text-sm text-neutral-400 mt-2">Buxoro Avto Magnat - Sizning ishonchli avto hamkoringiz</p>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Biz haqimizda qisqacha</h2>
          <p className="text-foreground/80 leading-relaxed font-light text-base sm:text-lg">
            Buxoro Avto Magnat 2018-yilda Buxoro shahrida tashkil etilgan bo'lib, o'tgan yillar davomida minglab xaridorlarga yangi avtomobillar yetkazib berdi va rasmiy kafolatli xizmat ko'rsatishda ishonchli hamkorga aylandi.
          </p>
          <p className="text-foreground/80 leading-relaxed font-light">
            Bizning asosiy maqsadimiz - mijozlarga nafaqat avtomobil sotish, balki sotuvdan keyingi premium texnik xizmat, qulay kredit va trade-in yordamida avtoulovni yangilash kabi to'liq sharoitlarni yaratishdir. Har bir mijoz biz uchun qadrlidir.
          </p>
        </div>
        <div className="h-80 bg-neutral-900 border border-border rounded-2xl overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800" 
            alt="Dealership Showroom" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Core values */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="bg-card border border-border p-6 rounded-xl space-y-4 hover:border-gold/40 transition-all duration-300">
          <div className="w-10 h-10 rounded bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Rasmiy status</h3>
          <p className="text-xs text-foreground/75 leading-relaxed">UzAuto Motorsning rasmiy dileri bo'lib, barcha avtoulovlarni to'g'ridan-to'g'ri zavod kafolati bilan sotamiz.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4 hover:border-gold/40 transition-all duration-300">
          <div className="w-10 h-10 rounded bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Mijozlar roziligi</h3>
          <p className="text-xs text-foreground/75 leading-relaxed">98% dan ortiq ijobiy mijozlar fikrlari shourumimizning yuqori darajada xizmat ko'rsatishidan dalolat beradi.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4 hover:border-gold/40 transition-all duration-300">
          <div className="w-10 h-10 rounded bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Moliyaviy yordam</h3>
          <p className="text-xs text-foreground/75 leading-relaxed">Uzbekistondagi yirik banklar bilan bevosita integratsiyalashgan holda eng arzon avtokreditlarni taqdim etamiz.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4 hover:border-gold/40 transition-all duration-300">
          <div className="w-10 h-10 rounded bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">Professional jamoa</h3>
          <p className="text-xs text-foreground/75 leading-relaxed">Mutaxassislarimiz Chevrolet andozalari asosida maxsus tayyorgarlikdan o'tishgan va har qanday maslahatga tayyorlar.</p>
        </div>

      </div>

    </div>
  );
}
