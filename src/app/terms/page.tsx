"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function TermsPage() {
  const { language } = useLanguage();

  const content = {
    uz: {
      title: "Foydalanish Shartlari",
      subtitle: "Buxoro Avto Magnat dilerlik veb-saytidan foydalanish shartlari va qoidalari",
      p1: "Ushbu veb-saytdan foydalanish orqali siz quyida keltirilgan shartlar va qoidalarga to'liq rozilik bildirasiz. Agar siz ushbu shartlarga rozi bo'lmasangiz, saytdan foydalanmasligingizni so'raymiz.",
      h1: "1. Xizmatlardan foydalanish",
      p2: "Saytdagi ma'lumotlar, narxlar, hisob-kitoblar faqat tanishish va maslahat maqsadida taqdim etiladi. Kredit kalkulyatori hisob-kitoblari yakuniy emas va bank bilan tuziladigan rasmiy shartnomaga ko'ra o'zgarishi mumkin.",
      h2: "2. Ariza va ma'lumotlar aniqligi",
      p3: "Test-drayv yoki trade-in uchun topshiriladigan arizalarda faqat to'g'ri va haqiqiy ma'lumotlarni ko'rsatishingiz shart. Noto'g'ri telefon raqami yoki shaxsiy ma'lumotlar ko'rsatilgan arizalar bekor qilinishi mumkin.",
      h3: "3. Mualliflik huquqi",
      p4: "Sayt tarkibidagi barcha matnlar, rasmlar, dizaynlar va Chevrolet brendiga oid materiallar Buxoro Avto Magnat yoki uning hamkorlariga tegishli bo'lib, ulardan ruxsatsiz foydalanish taqiqlanadi.",
      back: "Bosh sahifaga qaytish"
    },
    ru: {
      title: "Условия использования",
      subtitle: "Правила и условия использования веб-сайта дилерского центра Buxoro Avto Magnat",
      p1: "Используя данный веб-сайт, вы выражаете свое полное согласие с нижеизложенными условиями. Если вы не согласны с этими правилами, пожалуйста, прекратите использование сайта.",
      h1: "1. Использование услуг",
      p2: "Вся информация, цены и расчеты на сайте носят информационный характер. Расчеты кредитного калькулятора не являются окончательными и могут отличаться от официальных условий кредитного договора банка.",
      h2: "2. Точность данных в заявках",
      p3: "При заполнении заявок на тест-драйв или трейд-ин вы обязаны указывать только достоверную информацию. Заявки с неверными контактными данными или некорректным именем могут быть отклонены.",
      h3: "3. Авторские права",
      p4: "Все тексты, изображения, элементы дизайна и материалы бренда Chevrolet, размещенные на сайте, являются собственностью Buxoro Avto Magnat или партнеров и защищены законом.",
      back: "Вернуться на главную"
    },
    en: {
      title: "Terms of Use",
      subtitle: "Rules and conditions for using Buxoro Avto Magnat dealership website",
      p1: "By accessing and using this website, you fully agree to comply with the terms and conditions outlined below. If you do not agree, please refrain from using the site.",
      h1: "1. Service Availability",
      p2: "All dealership details, prices, and calculations on the site are provided for reference only. Loan calculations are estimates and do not constitute an official bank credit agreement.",
      h2: "2. Application Data Integrity",
      p3: "Users submitting test-drive or trade-in forms must provide accurate and valid personal information. Incomplete or invalid phone numbers may result in reservation cancellations.",
      h3: "3. Intellectual Property",
      p4: "All text elements, graphic layouts, design systems, and Chevrolet corporate assets belong to Buxoro Avto Magnat and are protected. Unauthorized copying is strictly prohibited.",
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
