"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-background">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <span className="text-2xl font-black tracking-wider uppercase">
            <span className="text-gold font-serif">BUXORO</span>
            <span className="text-foreground font-sans ml-1 text-base font-light">AVTO MAGNAT</span>
          </span>
          <h2 className="text-xl font-bold mt-3 text-foreground">{t('register')}</h2>
          <p className="text-xs text-neutral-400 mt-1">Yangi hisob yaratish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('name')}</label>
            <input
              type="text" required placeholder="Ali Valiyev" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded text-sm text-foreground focus:outline-none focus:border-gold"
            />
            <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-9" />
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('email')}</label>
            <input
              type="email" required placeholder="ali@gmail.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded text-sm text-foreground focus:outline-none focus:border-gold"
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-9" />
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('password')}</label>
            <input
              type="password" required placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded text-sm text-foreground focus:outline-none focus:border-gold"
            />
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-9" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-hover text-black font-extrabold py-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? t('loading') : t('register')}</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-border/50">
          <span>Allaqachon a'zomisiz?</span>{' '}
          <Link href="/login" className="text-gold font-bold hover:underline">
            {t('login')}
          </Link>
        </div>

      </div>
    </div>
  );
}
