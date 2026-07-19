"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Calendar, User } from 'lucide-react';

export default function Blog() {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          setNews(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) return <div className="text-center py-40 font-bold text-lg">{t('loading')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('blogTitle')}</h1>
        <p className="text-sm text-neutral-400 mt-2">{t('blogSubtitle')}</p>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded" />
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 font-bold">Yangiliklar mavjud emas. (No news articles available)</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => {
            const title = language === 'ru' ? item.titleRu : language === 'en' ? item.titleEn : item.titleUz;
            const content = language === 'ru' ? item.contentRu : language === 'en' ? item.contentEn : item.contentUz;
            const dateStr = new Date(item.createdAt).toLocaleDateString();

            return (
              <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                <div className="h-52 bg-neutral-900 overflow-hidden relative">
                  <img src={item.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                
                <div className="p-5 flex-grow space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold" />
                      Admin
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                    {title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-3 font-light">
                    {content}
                  </p>
                </div>

                <div className="p-5 pt-0 border-t border-border mt-2">
                  <button 
                    onClick={() => alert(`${title}\n\n${content}`)}
                    className="text-xs text-gold font-bold hover:underline flex items-center gap-1 mt-3"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>O'qish</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
