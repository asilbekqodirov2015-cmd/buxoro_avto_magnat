"use client";

import React from 'react';
import { Phone, Send } from 'lucide-react';

export default function FloatingWidgets() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* Phone Call Widget */}
      <a
        href="tel:+998992594000"
        className="flex items-center justify-center w-12 h-12 bg-gold hover:bg-gold-hover text-black rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        title="Telefon qilish"
      >
        <Phone className="w-5 h-5 fill-current" />
      </a>
      
      {/* Telegram Widget */}
      <a
        href="https://t.me/+998992594000"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        title="Telegram orqali bog'lanish"
      >
        <Send className="w-5 h-5 -mr-0.5" />
      </a>
    </div>
  );
}
