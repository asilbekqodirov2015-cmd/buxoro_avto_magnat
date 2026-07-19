"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function PrivacyPage() {
  const { language } = useLanguage();

  const content = {
    uz: {
      title: "Maxfiylik Siyosati",
      subtitle: "Buxoro Avto Magnat dilerlik markazida shaxsiy ma'lumotlaringiz xavfsizligi",
      p1: "Buxoro Avto Magnat shaxsiy ma'lumotlaringiz xavfsizligini ta'minlashga katta e'tibor qaratadi. Ushbu Maxfiylik siyosati bizning saytimiz orqali to'plangan ma'lumotlarning qayta ishlanishi va himoyalanish tartibini tushuntiradi.",
      h1: "1. Qaysi ma'lumotlarni to'playmiz?",
      p2: "Biz saytdagi ariza shakllari (test-drayv, trade-in, kredit arizalari) orqali quyidagi ma'lumotlarni to'plashimiz mumkin: ismingiz, telefon raqamingiz, elektron pochtangiz va eski avtomobilingiz tafsilotlari.",
      h2: "2. Ma'lumotlardan foydalanish",
      p3: "To'plangan ma'lumotlardan faqat sizning arizalaringizni qayta ishlash, shartnomalarni rasmiylashtirish hamda siz bilan bog'lanib, xizmat ko'rsatish maqsadida foydalaniladi.",
      h3: "3. Ma'lumotlarni himoya qilish",
      p4: "Biz shaxsiy ma'lumotlaringizni ruxsatsiz kirish, o'zgartirish yoki yo'q qilishdan himoya qilish uchun zamonaviy xavfsizlik choralarini qo'llaymiz. Shaxsiy ma'lumotlaringiz uchinchi shaxslarga sotilmaydi yoki ijaraga berilmaydi.",
      back: "Bosh sahifaga qaytish"
    },
    ru: {
      title: "Политика конфиденциальности",
      subtitle: "Безопасность ваших персональных данных в дилерском центре Buxoro Avto Magnat",
      p1: "Buxoro Avto Magnat уделяет большое внимание безопасности ваших личных данных. Настоящая Политика конфиденциальности объясняет порядок обработки и защиты информации, собранной через наш сайт.",
      h1: "1. Какую информацию мы собираем?",
      p2: "Мы можем собирать следующие данные через формы заявок на сайте (тест-драйв, трейд-ин, кредитные заявки): ваше имя, номер телефона, адрес электронной почты и характеристики вашего автомобиля.",
      h2: "2. Использование информации",
      p3: "Собранные данные используются исключительно для обработки ваших заявок, оформления договоров и связи с вами с целью оказания услуг.",
      h3: "3. Защита данных",
      p4: "Мы используем современные меры безопасности для защиты вашей личной информации от несанкционированного доступа, изменения или уничтожения. Ваши личные данные не продаются и не передаются третьим лицам.",
      back: "Вернуться на главную"
    },
    en: {
      title: "Privacy Policy",
      subtitle: "Security of your personal data at Buxoro Avto Magnat Dealership",
      p1: "Buxoro Avto Magnat is highly committed to securing your personal information. This Privacy Policy explains how the data collected via our website is processed and protected.",
      h1: "1. What information do we collect?",
      p2: "We may collect the following details through application forms (test-drive, trade-in, credit applications): your name, phone number, email address, and details of your pre-owned vehicle.",
      h2: "2. How we use your data",
      p3: "The collected information is used solely to process your bookings, manage finance options, and contact you regarding dealership services.",
      h3: "3. Data Protection",
      p4: "We enforce modern security standards to prevent unauthorized access, alteration, or exposure of your data. Your information is never sold or rented to third parties.",
      back: "Back to Home"
    }
  };

  const t = content[language] || content.uz;

  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-card border border-border p-8 sm:p-12 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center border-b border-border pb-6">
          <span className="text-gold">{t.title}</span>
        </h1>
        <p className="text-neutral-400 text-center text-sm font-medium">{t.subtitle}</p>
        
        <div className="space-y-6 pt-4 text-foreground/80 leading-relaxed font-light">
          <p>{t.p1}</p>
          
          <h2 className="text-xl font-bold text-foreground pt-4">{t.h1}</h2>
          <p>{t.p2}</p>
          
          <h2 className="text-xl font-bold text-foreground pt-4">{t.h2}</h2>
          <p>{t.p3}</p>
          
          <h2 className="text-xl font-bold text-foreground pt-4">{t.h3}</h2>
          <p>{t.p4}</p>
        </div>

        <div className="pt-8 text-center">
          <Link href="/" className="inline-block bg-gold hover:bg-gold-hover text-black px-6 py-3 rounded-lg font-bold text-sm transition-colors duration-300">
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
