"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.push('/');
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier) return;
    setResetLoading(true);
    try {
      // Simulate code sending
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setSentCode(generatedCode);
      alert(`Tasdiqlash kodi yuborildi: ${generatedCode}`);
      setResetStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== sentCode) {
      alert("Tasdiqlash kodi noto'g'ri!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: resetIdentifier, password: newPassword })
      });
      if (res.ok) {
        alert("Parol muvaffaqiyatli yangilandi! Yangi parol bilan tizimga kiring.");
        setShowResetModal(false);
        setResetStep(1);
        setResetIdentifier('');
        setVerificationCode('');
        setNewPassword('');
      } else {
        const data = await res.json();
        alert(data.error || "Xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      alert("Serverga ulanishda xatolik");
    } finally {
      setResetLoading(false);
    }
  };

  // One-click demo login helper
  const handleQuickLogin = async (role: 'admin' | 'customer') => {
    setLoading(true);
    const mail = role === 'admin' ? 'admin@magnat.uz' : 'mijoz@gmail.com';
    const pass = 'admin123';
    const success = await login(mail, pass);
    setLoading(false);
    if (success) {
      router.push(role === 'admin' ? '/admin/dashboard' : '/dashboard');
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
          <h2 className="text-xl font-bold mt-3 text-foreground">{t('login')}</h2>
          <p className="text-xs text-neutral-400 mt-1">Avtomobil band qilish va boshqarish paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('email')}</label>
            <input
              type="email" required placeholder="admin@magnat.uz" value={email}
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
            <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-9" />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setResetStep(1);
                setShowResetModal(true);
              }}
              className="text-xs text-gold hover:underline font-semibold"
            >
              Parolni unutdingizmi? (Forgot password?)
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-hover text-black font-extrabold py-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? t('loading') : t('login')}</span>
          </button>
        </form>

        {/* Demo Quick Logins Box */}
        <div className="bg-black/10 dark:bg-white/[0.02] border border-border/80 p-4 rounded-xl space-y-3">
          <p className="text-xs font-bold text-center text-gold flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>DEMO TEZKOR KIRISH (Quick Logins)</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 bg-neutral-900 border border-gold/40 text-gold text-xs font-extrabold rounded hover:bg-gold/10 transition-colors"
            >
              Admin Panel
            </button>
            <button
              onClick={() => handleQuickLogin('customer')}
              className="py-2 bg-neutral-900 border border-border/50 text-white text-xs font-extrabold rounded hover:bg-white/10 transition-colors"
            >
              Mijoz Kabineti
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-border/50">
          <span>Hisobingiz yo'qmi?</span>{' '}
          <Link href="/register" className="text-gold font-bold hover:underline">
            {t('register')}
          </Link>
        </div>

      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-md w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">Parolni tiklash</h3>
            <p className="text-xs text-neutral-400 mb-6 font-light">
              Tizimdagi elektron pochta, telefon raqam yoki foydalanuvchi nomi orqali parolingizni tiklang.
            </p>

            {resetStep === 1 ? (
              <form onSubmit={handleSendResetCode} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase">Foydalanuvchi ma'lumoti</label>
                  <input
                    type="text"
                    required
                    placeholder="Email, telefon yoki foydalanuvchi nomi"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gold text-black py-2.5 rounded font-extrabold text-sm transition-all"
                >
                  {resetLoading ? 'Yuklanmoqda...' : 'Tasdiqlash kodini olish'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase">Tasdiqlash kodi</label>
                  <input
                    type="text"
                    required
                    placeholder="Tasdiqlash kodini kiriting"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase">Yangi parol</label>
                  <input
                    type="password"
                    required
                    placeholder="Yangi parol (Kamida 6 ta belgi)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gold text-black py-2.5 rounded font-extrabold text-sm transition-all"
                >
                  {resetLoading ? 'Yuklanmoqda...' : 'Parolni yangilash'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
