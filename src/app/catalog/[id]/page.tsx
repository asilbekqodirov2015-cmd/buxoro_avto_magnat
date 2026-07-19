"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  Heart, ArrowLeftRight, ChevronLeft, Calendar, FileDown, 
  Info, ShieldCheck, CheckCircle2, RotateCw, Star
} from 'lucide-react';

// Angle images to simulate 360 spin
const mockAngleImages: Record<string, string[]> = {
  'car-malibu': [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-tracker': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-tahoe': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-onix': [
    'https://images.unsplash.com/photo-1617813903808-89c44ab4f15a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-captiva': [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-cobalt': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-gentra': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-equinox': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-traverse': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ],
  'car-damas': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  ]
};

// Car-specific color image overrides to simulate body color selection
const colorImageOverrides: Record<string, Record<string, string>> = {
  'car-malibu': {
    '#111111': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800', // Black
    '#FFFFFF': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800', // White
    '#4A4A4A': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800', // Grey
    '#E53E3E': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'  // Red
  },
  'car-tracker': {
    '#111111': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  'car-tahoe': {
    '#111111': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  'car-onix': {
    '#111111': 'https://images.unsplash.com/photo-1617813903808-89c44ab4f15a?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  'car-captiva': {
    '#111111': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
  },
  'car-cobalt': {
    '#111111': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
  },
  'car-gentra': {
    '#111111': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
  },
  'car-equinox': {
    '#111111': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  },
  'car-traverse': {
    '#111111': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  },
  'car-suburban': {
    '#111111': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  },
  'car-damas': {
    '#111111': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    '#FFFFFF': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    '#4A4A4A': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    '#E53E3E': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  }
};

export default function CarDetail() {
  const { id } = useParams() as { id: string };
  const { t, language } = useLanguage();
  const router = useRouter();

  const { wishlist, compareList, toggleWishlist, toggleCompare, addToRecentlyViewed } = useApp();
  const { user } = useAuth();

  const [car, setCar] = useState<any>(null);
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Main Image state
  const [mainImageUrl, setMainImageUrl] = useState('');
  // 360 viewer state (1-4 index)
  const [spinIndex, setSpinIndex] = useState(0);
  const [is360Active, setIs360Active] = useState(false);
  
  // Color Picker state
  const [activeColorHex, setActiveColorHex] = useState('');

  // Credit Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(18);

  // Forms Booking drawer state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('+998');
  const [bookDate, setBookDate] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);

  const handleBookPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val.startsWith('+998')) {
      setBookPhone('+998');
      return;
    }
    const suffix = val.substring(4);
    const digitsOnly = suffix.replace(/\D/g, '');
    const capped = digitsOnly.substring(0, 9);
    setBookPhone('+998' + capped);
  };

  useEffect(() => {
    if (user) {
      setBookName(user.name);
    }
  }, [user]);

  // Quote form state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    async function loadCarDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/car?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setCar(data);
          setMainImageUrl(data.mainImage);
          setActiveColorHex(data.color?.hexCode || '#111111');
          addToRecentlyViewed(data.id);
          
          // Load similar cars in the same category
          const allCarsRes = await fetch('/api/cars');
          if (allCarsRes.ok) {
            const allCars = await allCarsRes.json();
            setSimilarCars(allCars.filter((c: any) => c.categoryId === data.categoryId && c.id !== data.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCarDetails();
  }, [id]);

  if (loading) return <div className="text-center py-40 font-bold text-lg">{t('loading')}</div>;
  if (!car) return <div className="text-center py-40 text-red-500 font-bold text-lg">Avtomobil topilmadi (Car not found)</div>;

  // Calculations
  const finalCarPrice = car.price - car.discount;
  const downPaymentValue = (finalCarPrice * downPaymentPercent) / 100;
  const loanValue = finalCarPrice - downPaymentValue;
  const monthlyRate = (interestRate / 12) / 100;
  const monthlyFee = loanValue > 0
    ? (loanValue * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    : 0;

  // Dynamically resolve 360 spin images from car.images array or mock data fallback
  let angles: string[] = [];
  if (car.images) {
    try {
      const parsed = typeof car.images === 'string' ? JSON.parse(car.images) : car.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        angles = parsed;
      }
    } catch (e) {
      if (Array.isArray(car.images) && car.images.length > 0) {
        angles = car.images;
      }
    }
  }
  if (angles.length === 0) {
    angles = mockAngleImages[car.id] || [];
  }

  // Change spin angle
  const handleSpinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSpinIndex(val);
    if (angles && angles[val]) {
      setMainImageUrl(angles[val]);
    }
  };

  // Change color body
  const handleColorClick = (hex: string) => {
    setActiveColorHex(hex);
    setIs360Active(false); // turn off 360 during color display override
    
    let carColorOverrides: Record<string, string> = {};
    if (car.colorImages) {
      try {
        carColorOverrides = JSON.parse(car.colorImages);
      } catch (e) {
        console.error("Failed to parse car.colorImages JSON", e);
      }
    }
    
    if (!carColorOverrides[hex]) {
      const mockOverrides = colorImageOverrides[car.id] || {};
      if (mockOverrides[hex]) {
        carColorOverrides[hex] = mockOverrides[hex];
      }
    }

    if (carColorOverrides[hex]) {
      setMainImageUrl(carColorOverrides[hex]);
    }
  };

  // Submit test drive booking
  const handleBookTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName || !bookPhone || !bookDate) {
      alert("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-test-drive',
          carId: car.id,
          name: bookName,
          phone: bookPhone,
          date: bookDate,
          notes: bookNotes 
            ? `${bookNotes} \n[User Email: ${user?.email || ''}]` 
            : `Mashina sahifasidan test-drayv arizasi \n[User Email: ${user?.email || ''}]`
        })
      });
      if (res.ok) {
        setBookSuccess(true);
        setTimeout(() => {
          setBookSuccess(false);
          setBookingOpen(false);
          setBookName('');
          setBookPhone('');
          setBookDate('');
          setBookNotes('');
        }, 3000);
      }
    } catch (e) {
    }
  };

  let carColorOverrides: Record<string, string> = {};
  if (car && car.colorImages) {
    try {
      carColorOverrides = typeof car.colorImages === 'string' ? JSON.parse(car.colorImages) : car.colorImages;
    } catch (e) {
      console.error("Failed to parse car.colorImages JSON", e);
    }
  }
  const mockOverrides = car ? (colorImageOverrides[car.id] || {}) : {};

  const allColors = [
    { hex: '#FFFFFF', nameUz: 'Oq (GAZ - Summit White)' },
    { hex: '#111111', nameUz: 'Qora (GGB - Carbon Flash)' },
    { hex: '#4A4A4A', nameUz: 'Satin (GYM - Satin Steel)' },
    { hex: '#C0C0C0', nameUz: 'Kumushrang (GAN - Switchblade)' },
    { hex: '#E53E3E', nameUz: 'Qizil (GD8 - Pull Me Over)' },
    { hex: '#1E3A8A', nameUz: 'To\'q ko\'k (GD7 - Darkmoon Blue)' },
    { hex: '#B45309', nameUz: 'Yantar oltin (GK2 - Bronze)' }
  ];

  let availableColors = allColors.filter(colorObj => {
    return carColorOverrides[colorObj.hex] || mockOverrides[colorObj.hex];
  });

  if (availableColors.length === 0) {
    availableColors = allColors;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <button 
        onClick={() => router.push('/catalog')} 
        className="flex items-center space-x-2 text-foreground/80 hover:text-gold mb-8 text-sm font-semibold transition-colors duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Katalogga qaytish</span>
      </button>

      {/* Main Details Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Gallery & Interactive View Column */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-lg relative flex items-center justify-center min-h-[350px] overflow-hidden bg-neutral-900">
            <img 
              src={mainImageUrl} 
              alt={car.name} 
              className="max-h-[300px] w-auto object-contain transition-all duration-500 ease-out" 
            />
            
            {/* Quick Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              <span className="bg-gold text-black text-[10px] font-black tracking-widest px-3 py-1 rounded uppercase">
                {car.availability === 'IN_STOCK' ? t('inStock') : car.availability === 'RESERVED' ? t('reserved') : t('outOfStock')}
              </span>
              {car.discount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded">
                  Chegirma: -{car.discount.toLocaleString()} so'm
                </span>
              )}
            </div>

            {/* Interactive Mode toggle badge */}
            {angles.length > 0 && (
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button 
                  onClick={() => {
                    setIs360Active(!is360Active);
                    if (!is360Active) {
                      setMainImageUrl(angles[0]);
                      setSpinIndex(0);
                    }
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    is360Active ? 'bg-gold text-black' : 'bg-black/50 text-white border border-white/20 hover:bg-black'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{t('degreeView')}</span>
                </button>
              </div>
            )}
          </div>

          {/* 360 Spin slider (rendered when active) */}
          {is360Active && (
            <div className="bg-card border border-border p-4 rounded-xl space-y-2">
              <p className="text-xs text-neutral-400 text-center font-semibold">{t('degreeViewDesc')}</p>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={spinIndex}
                onChange={handleSpinChange}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-bold px-1">
                <span>Oldi (Front)</span>
                <span>Yon (Side)</span>
                <span>Orqa (Back)</span>
                <span>Salon (Interior)</span>
              </div>
            </div>
          )}

          {/* Interactive Color Picker */}
          <div className="bg-card border border-border p-5 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Tana rangini tanlang (Exterior Color)</span>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {availableColors.map((colorObj) => (
                <button
                  key={colorObj.hex}
                  onClick={() => handleColorClick(colorObj.hex)}
                  className={`w-9 h-9 rounded-full border-2 transition-transform duration-300 relative ${
                    activeColorHex === colorObj.hex ? 'border-gold scale-110' : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorObj.hex }}
                  title={colorObj.nameUz}
                >
                  {activeColorHex === colorObj.hex && (
                    <span className="absolute inset-1 border border-white rounded-full pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons (Wishlist, Compare, Brochure) */}
          <div className="flex gap-4">
            <button 
              onClick={() => toggleWishlist(car.id)}
              className={`w-1/3 py-3 border rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                wishlist.includes(car.id)
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{t('wishlistBtn')}</span>
            </button>
            
            <button 
              onClick={() => toggleCompare(car.id)}
              className={`w-1/3 border rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                compareList.includes(car.id)
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{compareList.includes(car.id) ? 'Solishtirilmoqda' : t('compareBtn')}</span>
            </button>
            
            <button 
              onClick={() => {
                if (car.priceListUrl) {
                  const link = document.createElement('a');
                  link.href = car.priceListUrl;
                  link.download = car.priceListUrl.split('/').pop() || `Chevrolet_${car.name.replace(/\s+/g, '_')}_PriceList`;
                  link.target = '_blank';
                  link.click();
                  return;
                }
                const specText = `
============================================================
              BUXORO AVTO MAGNAT SHOURUMI
          CHEVROLET RASMIY HAMKORI VA DILERI
============================================================
Avtomobil modeli: Chevrolet ${car.name}
Ishlab chiqarilgan yili: ${car.year}-yil
Dvigatel hajmi: ${car.engine}
Dvigatel quvvati: ${car.horsepower} ot kuchi
Uzatmalar qutisi: ${car.transmission === 'AUTOMATIC' ? 'Avtomat (Automatic)' : 'Mexanik (Manual)'}
Yoqilg'i turi: ${car.fuelType}
Holati: Yangi (0 km)

------------------------------------------------------------
Katalog narxi: ${car.price.toLocaleString()} so'm
Maxsus chegirma: ${car.discount.toLocaleString()} so'm
Yakuniy sotuv narxi: ${(car.price - car.discount).toLocaleString()} so'm
------------------------------------------------------------

Kafolat muddati: 3 yil yoki 100,000 km (qaysi biri oldin kelsa)
Markaziy manzilimiz: Buxoro sh., G‘ijduvon ko‘chasi, 45-uy
Bog'lanish uchun telefon: +998 (65) 221-55-55
Telegram kanalimiz: @buxoro_avto_magnat
============================================================
`;
                const blob = new Blob([specText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Chevrolet_${car.name.replace(/\s+/g, '_')}_Specs_Price_Magnat.txt`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="w-1/3 border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 py-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-300"
            >
              <FileDown className="w-4 h-4" />
              <span>Yuklab olish</span>
            </button>
          </div>

        </div>

        {/* Pricing, Spec Sheet & Lead Gen */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{car.name}</h1>
            <div className="flex items-baseline space-x-4 mt-4">
              {car.discount > 0 ? (
                <>
                  <span className="text-3xl font-black text-gold">{finalCarPrice.toLocaleString()} so'm</span>
                  <span className="text-lg line-through text-neutral-500">{car.price.toLocaleString()} so'm</span>
                </>
              ) : (
                <span className="text-3xl font-black text-foreground">{car.price.toLocaleString()} so'm</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('navAbout')}</span>
            <p className="text-foreground/80 leading-relaxed font-light text-sm sm:text-base">
              {language === 'ru' ? car.descriptionRu : language === 'en' ? car.descriptionEn : car.descriptionUz}
            </p>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-extrabold text-sm border-b border-border pb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-gold" />
              <span>Texnik xususiyatlari</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-neutral-400">Ishlab chiqarilgan yili</span>
                <span className="font-bold">{car.year}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-neutral-400">Dvigatel hajmi</span>
                <span className="font-bold">{car.engine}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-neutral-400">Dvigatel quvvati</span>
                <span className="font-bold">{car.horsepower} ot kuchi</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-neutral-400">Yoqilg'i turi</span>
                <span className="font-bold">{car.fuelType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-neutral-400">Transmissiya</span>
                <span className="font-bold">{car.transmission === 'AUTOMATIC' ? 'Avtomat' : 'Mexanik'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-neutral-400">Omborda mavjud</span>
                <span className="font-bold text-gold">{car.stockCount} dona</span>
              </div>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setBookingOpen(true)}
              className="w-full sm:w-1/2 bg-gold hover:bg-gold-hover text-black py-4 rounded-xl font-extrabold text-center flex items-center justify-center space-x-2 shadow-lg shadow-gold/25 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              <span>{t('bookTestDriveBtn')}</span>
            </button>
            <button 
              onClick={() => setQuoteOpen(true)}
              className="w-full sm:w-1/2 bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-900 py-4 rounded-xl font-extrabold text-center transition-all duration-300"
            >
              {t('requestQuoteBtn')}
            </button>
          </div>

        </div>

      </div>

      {/* Real-time Car Payment Calculator block */}
      <section className="mt-20 border-t border-border pt-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('calcTitle')}</h2>
          <div className="w-12 h-1 bg-gold mx-auto mt-2 rounded" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{t('downPayment')} ({downPaymentPercent}%):</span>
                <span className="font-bold text-gold">{downPaymentValue.toLocaleString()} so'm</span>
              </div>
              <input
                type="range" min="10" max="70" step="5" value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Kredit muddati:</span>
                <span className="font-bold text-gold">{termMonths} oy</span>
              </div>
              <input
                type="range" min="12" max="60" step="12" value={termMonths}
                onChange={(e) => setTermMonths(parseInt(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Yillik bank foiz stavkasi:</span>
                <span className="font-bold text-gold">{interestRate}%</span>
              </div>
              <input
                type="range" min="12" max="24" step="0.5" value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-6 rounded-xl border border-border text-center space-y-4">
            <div>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{t('monthlyPayment')}</p>
              <p className="text-3xl font-black text-gold mt-1">{Math.round(monthlyFee).toLocaleString()} so'm</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-border pt-4 text-foreground/70">
              <div>
                <p>Avto narxi:</p>
                <p className="font-bold text-foreground">{finalCarPrice.toLocaleString()} so'm</p>
              </div>
              <div>
                <p>Kredit summasi:</p>
                <p className="font-bold text-foreground">{loanValue.toLocaleString()} so'm</p>
              </div>
            </div>
            <Link href="/credit" className="block w-full bg-gold text-black py-2.5 rounded font-extrabold text-xs hover:bg-gold-hover transition-colors">
              Rasmiylashtirishga o'tish
            </Link>
          </div>
        </div>
      </section>

      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <section className="mt-20 border-t border-border pt-16">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center">{t('similarCarsTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarCars.map((sCar) => (
              <div key={sCar.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 group">
                <div className="h-40 bg-neutral-900 overflow-hidden">
                  <img src={sCar.mainImage} alt={sCar.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-base truncate">{sCar.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-gold">{sCar.price.toLocaleString()} so'm</span>
                    <Link href={`/catalog/${sCar.id}`} className="text-xs text-foreground hover:text-gold font-bold">
                      Batafsil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Drawer Booking Test Drive Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-md w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setBookingOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">{t('bookTestDriveBtn')}</h3>
            <p className="text-xs text-neutral-400 mb-6">{car.name} modelini shahar sharoitida sinab ko'ring</p>

            {bookSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded text-center text-sm font-bold">
                {t('successBooking')}
              </div>
            ) : (
              <form onSubmit={handleBookTestDrive} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('name')}</label>
                  <input
                    type="text" required value={bookName} onChange={(e) => setBookName(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('phone')}</label>
                  <input
                    type="text" required placeholder="+998" value={bookPhone} onChange={handleBookPhoneChange}
                    className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tashrif sanasi</label>
                  <input
                    type="date" required value={bookDate} onChange={(e) => setBookDate(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Izoh</label>
                  <input
                    type="text" value={bookNotes} onChange={(e) => setBookNotes(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <button type="submit" className="w-full bg-gold hover:bg-gold-hover text-black py-3 rounded font-bold transition-all text-sm">
                  {t('bookNow')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Quote / Apply Request Modal */}
      {quoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-md w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150">
            <button onClick={() => setQuoteOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-4">Mutaxassis maslahati / Narx so'rovi</h3>
            
            {quoteSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded text-center text-sm font-bold">
                Sizning arizangiz qabul qilindi. Tez orada dilerlik markazimiz menejeri bog'lanadi.
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuoteSuccess(true);
                  setTimeout(() => { setQuoteSuccess(false); setQuoteOpen(false); }, 3000);
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-neutral-400">Ismingiz</label>
                  <input type="text" required value={bookName} onChange={(e) => setBookName(e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400">Telefon raqamingiz</label>
                  <input type="text" required placeholder="+998" value={bookPhone} onChange={handleBookPhoneChange} className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="bg-neutral-900/60 p-3 rounded text-xs border border-border">
                  Avtomobil: <strong>{car.name}</strong> <br />
                  Bazaviy narxi: <strong>${car.price.toLocaleString()}</strong>
                </div>
                <button type="submit" className="w-full bg-gold text-black py-3 rounded font-bold text-sm">
                  Menejer qo'ng'irog'ini kutish
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
