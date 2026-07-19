"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useApp } from '../../../context/AppContext';
import { 
  BarChart3, Car, Calendar, RefreshCw, Landmark, Settings, 
  Plus, Edit, Trash2, Check, X, ShieldAlert, DollarSign, Users, Info, MapPin
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { reloadSettings } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'cars' | 'bookings' | 'tradeins' | 'banks' | 'settings' | 'users' | 'branches' | 'news' | 'credits' | 'promotions'>('analytics');
  
  // Data States
  const [cars, setCars] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tradeIns, setTradeIns] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const isSuper = user?.email === 'admin@magnat.uz';
  const hasPermission = (perm: string) => isSuper || user?.permissions?.includes(perm);

  // Auto select first allowed tab for sub-admin
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'ADMIN' && !isSuper) {
        const allowedTabs = [
          { key: 'analytics', perm: 'analytics' },
          { key: 'cars', perm: 'cars' },
          { key: 'bookings', perm: 'bookings' },
          { key: 'tradeins', perm: 'tradeins' },
          { key: 'credits', perm: 'credits' },
          { key: 'banks', perm: 'banks' },
          { key: 'settings', perm: 'settings' },
          { key: 'branches', perm: 'branches' },
          { key: 'news', perm: 'news' }
        ].filter(t => hasPermission(t.perm));
        
        if (allowedTabs.length > 0 && !allowedTabs.some(t => t.key === activeTab)) {
          setActiveTab(allowedTabs[0].key as any);
        }
      }
    }
  }, [user, authLoading]);

  // Branch Form Fields
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchNameUz, setBranchNameUz] = useState('');
  const [branchNameRu, setBranchNameRu] = useState('');
  const [branchNameEn, setBranchNameEn] = useState('');
  const [branchAddressUz, setBranchAddressUz] = useState('');
  const [branchAddressRu, setBranchAddressRu] = useState('');
  const [branchAddressEn, setBranchAddressEn] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchHoursUz, setBranchHoursUz] = useState('Dushanba - Shanba: 9:00 - 18:00');
  const [branchHoursRu, setBranchHoursRu] = useState('Понедельник - Суббота: 9:00 - 18:00');
  const [branchHoursEn, setBranchHoursEn] = useState('Monday - Saturday: 9:00 - 18:00');
  const [branchMapUrl, setBranchMapUrl] = useState('');

  // News Form Fields
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitleUz, setNewsTitleUz] = useState('');
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsDescUz, setNewsDescUz] = useState('');
  const [newsDescRu, setNewsDescRu] = useState('');
  const [newsDescEn, setNewsDescEn] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800');

  // Form Modals states
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  
  // Car Form Fields
  const [carName, setCarName] = useState('');
  const [carPrice, setCarPrice] = useState(20000);
  const [carDiscount, setCarDiscount] = useState(0);
  const [carVin, setCarVin] = useState('');
  const [carEngine, setCarEngine] = useState('1.5L');
  const [carTransmission, setCarTransmission] = useState('AUTOMATIC');
  const [carFuelType, setCarFuelType] = useState('PETROL');
  const [carHorsepower, setCarHorsepower] = useState(106);
  const [carYear, setCarYear] = useState(2025);
  const [carMainImage, setCarMainImage] = useState('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800');
  const [carStock, setCarStock] = useState(1);
  const [carCategoryId, setCarCategoryId] = useState('');
  const [carColorId, setCarColorId] = useState('');
  const [carPriceListUrl, setCarPriceListUrl] = useState('');
  const [carColorImages, setCarColorImages] = useState<Record<string, string>>({});
  
  // Custom vehicle description states
  const [carDescUz, setCarDescUz] = useState('');
  const [carDescRu, setCarDescRu] = useState('');
  const [carDescEn, setCarDescEn] = useState('');

  // 360 Spin Angle Images state (4 slots)
  const [carImages, setCarImages] = useState<string[]>(['', '', '', '']);

  // Bank Form Fields
  const [bankName, setBankName] = useState('');
  const [bankMinInterest, setBankMinInterest] = useState(14);
  const [bankMaxInterest, setBankMaxInterest] = useState(24);
  const [bankDownPayment, setBankDownPayment] = useState(10);
  const [bankMinTerm, setBankMinTerm] = useState(12);
  const [bankMaxTerm, setBankMaxTerm] = useState(60);

  // Trade-In valuation modal state
  const [tradeValuationOpen, setTradeValuationOpen] = useState(false);
  const [valuingTradeId, setValuingTradeId] = useState('');
  const [valuingPrice, setValuingPrice] = useState('');
  const [valuingNotes, setValuingNotes] = useState('');

  // Settings Fields
  const [settPhone, setSettPhone] = useState('');
  const [settTelegram, setSettTelegram] = useState('');
  const [settWhatsapp, setSettWhatsapp] = useState('');
  const [settAddrUz, setSettAddrUz] = useState('');
  const [settAddrRu, setSettAddrRu] = useState('');
  const [settAddrEn, setSettAddrEn] = useState('');
  const [settEmail, setSettEmail] = useState('');

  // Promotions State & Form Fields
  const [promotions, setPromotions] = useState<any[]>([]);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoTitleUz, setPromoTitleUz] = useState('');
  const [promoTitleRu, setPromoTitleRu] = useState('');
  const [promoTitleEn, setPromoTitleEn] = useState('');
  const [promoDescUz, setPromoDescUz] = useState('');
  const [promoDescRu, setPromoDescRu] = useState('');
  const [promoDescEn, setPromoDescEn] = useState('');
  const [promoImage, setPromoImage] = useState('');

  // Route Protection
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, authLoading]);

  // Load Admin Data
  const loadAllAdminData = async () => {
    try {
      setLoadingData(true);
      const [carsRes, catsRes, colsRes, bookRes, tradeRes, bankRes, settRes, usersRes, branchesRes, newsRes, creditsRes, promoRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/categories'),
        fetch('/api/colors'),
        fetch('/api/bookings?type=test-drive'),
        fetch('/api/bookings?type=trade-in'),
        fetch('/api/credit-programs'),
        fetch('/api/settings'),
        fetch('/api/users'),
        fetch('/api/branches'),
        fetch('/api/news'),
        fetch('/api/bookings?type=credit'),
        fetch('/api/promotions')
      ]);

      if (carsRes.ok) setCars(await carsRes.json());
      if (catsRes.ok) {
        const catsData = await catsRes.json();
        setCategories(catsData);
        if (catsData.length > 0) setCarCategoryId(catsData[0].id);
      }
      if (colsRes.ok) {
        const colsData = await colsRes.json();
        setColors(colsData);
        if (colsData.length > 0) setCarColorId(colsData[0].id);
      }
      if (bookRes.ok) setBookings(await bookRes.json());
      if (tradeRes.ok) setTradeIns(await tradeRes.json());
      if (bankRes.ok) setBanks(await bankRes.json());
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      if (branchesRes.ok) {
        const branchesData = await branchesRes.json();
        setBranches(branchesData.branches || []);
      }
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData || []);
      }
      if (creditsRes.ok) {
        setCredits(await creditsRes.json());
      }
      if (promoRes.ok) {
        setPromotions(await promoRes.json());
      }
      
      if (settRes.ok) {
        const settData = await settRes.json();
        setSettings(settData);
        setSettPhone(settData.phone || '');
        setSettTelegram(settData.telegram || '');
        setSettWhatsapp(settData.whatsapp || '');
        setSettAddrUz(settData.addressUz || '');
        setSettAddrRu(settData.addressRu || '');
        setSettAddrEn(settData.addressEn || '');
        setSettEmail(settData.email || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadAllAdminData();
    }
  }, [user]);

  if (authLoading || !user || user.role !== 'ADMIN') {
    return <div className="text-center py-40 font-bold text-lg">{t('loading')}</div>;
  }

  // Handle Car CRUD: Create & Update
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalVin = carVin || 'KL4TC1YF' + Math.floor(100000 + Math.random() * 900000).toString();
    let finalMainImage = carMainImage;
    const uploaded360 = carImages.filter(img => img.trim() !== '');
    if (finalMainImage.includes('unsplash.com/photo-1552519507-da3b142c6e3d')) {
      if (uploaded360.length > 0) {
        finalMainImage = uploaded360[0];
      } else {
        const colorUrls = Object.values(carColorImages);
        if (colorUrls.length > 0) {
          finalMainImage = colorUrls[0];
        }
      }
    }
    const payload = {
      id: editingCarId || undefined,
      name: carName,
      price: parseFloat(carPrice.toString()),
      discount: parseFloat(carDiscount.toString()),
      vin: finalVin,
      engine: carEngine,
      transmission: carTransmission,
      fuelType: carFuelType,
      horsepower: parseInt(carHorsepower.toString()),
      year: parseInt(carYear.toString()),
      mainImage: finalMainImage,
      images: uploaded360,
      stockCount: parseInt(carStock.toString()),
      categoryId: carCategoryId,
      colorId: carColorId,
      brandId: 'brand-1',
      availability: 'IN_STOCK',
      descriptionUz: carDescUz || `${carName} avtomobili. Premium dilerlik markazida.`,
      descriptionRu: carDescRu || `Автомобиль ${carName} в премиальном дилерском центре.`,
      descriptionEn: carDescEn || `Chevrolet ${carName} vehicle in premium showroom.`,
      priceListUrl: carPriceListUrl || null,
      colorImages: JSON.stringify(carColorImages)
    };

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCarModalOpen(false);
        setEditingCarId(null);
        // reset form
        setCarName('');
        setCarVin('');
        setCarPriceListUrl('');
        setCarColorImages({});
        setCarDescUz('');
        setCarDescRu('');
        setCarDescEn('');
        setCarImages(['', '', '', '']);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCarClick = (car: any) => {
    setEditingCarId(car.id);
    setCarName(car.name);
    setCarPrice(car.price);
    setCarDiscount(car.discount);
    setCarVin(car.vin);
    setCarEngine(car.engine);
    setCarTransmission(car.transmission);
    setCarFuelType(car.fuelType);
    setCarHorsepower(car.horsepower);
    setCarYear(car.year);
    setCarMainImage(car.mainImage);
    setCarStock(car.stockCount);
    setCarCategoryId(car.categoryId);
    setCarColorId(car.colorId);
    setCarPriceListUrl(car.priceListUrl || '');
    setCarColorImages(car.colorImages ? JSON.parse(car.colorImages) : {});
    setCarDescUz(car.descriptionUz || '');
    setCarDescRu(car.descriptionRu || '');
    setCarDescEn(car.descriptionEn || '');
    const parsedImages = car.images ? (typeof car.images === 'string' ? JSON.parse(car.images) : car.images) : [];
    const paddedImages = [...parsedImages, '', '', '', ''].slice(0, 4);
    setCarImages(paddedImages);
    setCarModalOpen(true);
  };

  const handleDeleteCarClick = async (carId: string) => {
    if (!confirm("Haqiqatan ham bu avtomobilni katalogdan o'chirmoqchisiz?")) return;
    try {
      const res = await fetch(`/api/cars?id=${carId}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Bookings status updates
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-test-drive', id, status })
      });
      if (res.ok) loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Open Trade-in valuation modal
  const openTradeValuation = (tiId: string) => {
    setValuingTradeId(tiId);
    setValuingPrice('');
    setValuingNotes('');
    setTradeValuationOpen(true);
  };

  const submitTradeValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-trade-in',
          id: valuingTradeId,
          status: 'EVALUATED',
          estimatedPrice: parseFloat(valuingPrice),
          notes: valuingNotes
        })
      });
      if (res.ok) {
        setTradeValuationOpen(false);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Bank / Credit Program
  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName) return;
    try {
      const res = await fetch('/api/credit-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName,
          interestRate: parseFloat(bankMinInterest.toString()), // backwards compatibility
          minDownPayment: parseFloat(bankDownPayment.toString()),
          termMonths: parseInt(bankMaxTerm.toString()), // backwards compatibility
          minInterestRate: parseFloat(bankMinInterest.toString()),
          maxInterestRate: parseFloat(bankMaxInterest.toString()),
          minTermMonths: parseInt(bankMinTerm.toString()),
          maxTermMonths: parseInt(bankMaxTerm.toString())
        })
      });
      if (res.ok) {
        setBankName('');
        setBankMinInterest(14);
        setBankMaxInterest(24);
        setBankDownPayment(10);
        setBankMinTerm(12);
        setBankMaxTerm(60);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBank = async (id: string) => {
    try {
      const res = await fetch(`/api/credit-programs?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: settPhone,
          telegram: settTelegram,
          whatsapp: settWhatsapp,
          addressUz: settAddrUz,
          addressRu: settAddrRu,
          addressEn: settAddrEn,
          email: settEmail
        })
      });
      if (res.ok) {
        alert("Sayt sozlamalari muvaffaqiyatli saqlandi!");
        loadAllAdminData();
        if (reloadSettings) {
          await reloadSettings();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle User Role
  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      });
      if (res.ok) {
        alert("Foydalanuvchi roli muvaffaqiyatli yangilandi!");
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete User Profile
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Foydalanuvchi o'chirib tashlandi!");
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Branch Form
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const branchBody = {
        nameUz: branchNameUz,
        nameRu: branchNameRu,
        nameEn: branchNameEn,
        addressUz: branchAddressUz,
        addressRu: branchAddressRu,
        addressEn: branchAddressEn,
        phone: branchPhone,
        hoursUz: branchHoursUz,
        hoursRu: branchHoursRu,
        hoursEn: branchHoursEn,
        mapUrl: branchMapUrl
      };

      const res = await fetch('/api/branches', {
        method: editingBranchId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBranchId ? { id: editingBranchId, ...branchBody } : branchBody)
      });

      if (res.ok) {
        alert(editingBranchId ? "Filial muvaffaqiyatli yangilandi!" : "Yangi filial muvaffaqiyatli qo'shildi!");
        setBranchModalOpen(false);
        setEditingBranchId(null);
        // Clear fields
        setBranchNameUz('');
        setBranchNameRu('');
        setBranchNameEn('');
        setBranchAddressUz('');
        setBranchAddressRu('');
        setBranchAddressEn('');
        setBranchPhone('');
        setBranchMapUrl('');
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBranchClick = (branch: any) => {
    setEditingBranchId(branch.id);
    setBranchNameUz(branch.nameUz);
    setBranchNameRu(branch.nameRu);
    setBranchNameEn(branch.nameEn);
    setBranchAddressUz(branch.addressUz);
    setBranchAddressRu(branch.addressRu);
    setBranchAddressEn(branch.addressEn);
    setBranchPhone(branch.phone);
    setBranchHoursUz(branch.hoursUz);
    setBranchHoursRu(branch.hoursRu);
    setBranchHoursEn(branch.hoursEn);
    setBranchMapUrl(branch.mapUrl);
    setBranchModalOpen(true);
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("Haqiqatan ham bu filialni o'chirib tashlamoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/branches?id=${branchId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Filial muvaffaqiyatli o'chirildi!");
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save News Form
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newsBody = {
        titleUz: newsTitleUz,
        titleRu: newsTitleRu,
        titleEn: newsTitleEn,
        descUz: newsDescUz,
        descRu: newsDescRu,
        descEn: newsDescEn,
        image: newsImage
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNewsId ? { id: editingNewsId, ...newsBody } : newsBody)
      });

      if (res.ok) {
        alert(editingNewsId ? "Yangilik muvaffaqiyatli yangilandi!" : "Yangi yangilik muvaffaqiyatli qo'shildi!");
        setNewsModalOpen(false);
        setEditingNewsId(null);
        // Clear fields
        setNewsTitleUz('');
        setNewsTitleRu('');
        setNewsTitleEn('');
        setNewsDescUz('');
        setNewsDescRu('');
        setNewsDescEn('');
        setNewsImage('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800');
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditNewsClick = (item: any) => {
    setEditingNewsId(item.id);
    setNewsTitleUz(item.titleUz || '');
    setNewsTitleRu(item.titleRu || '');
    setNewsTitleEn(item.titleEn || '');
    setNewsDescUz(item.descUz || '');
    setNewsDescRu(item.descRu || '');
    setNewsDescEn(item.descEn || '');
    setNewsImage(item.image || '');
    setNewsModalOpen(true);
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm("Haqiqatan ham bu yangilikni o'chirib tashlamoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Yangilik muvaffaqiyatli o'chirildi!");
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Promotion Form
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const promoBody = {
        titleUz: promoTitleUz,
        titleRu: promoTitleRu,
        titleEn: promoTitleEn,
        descriptionUz: promoDescUz,
        descriptionRu: promoDescRu,
        descriptionEn: promoDescEn,
        image: promoImage
      };

      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPromoId ? { id: editingPromoId, ...promoBody } : promoBody)
      });

      if (res.ok) {
        alert(editingPromoId ? "Aksiya muvaffaqiyatli yangilandi!" : "Yangi aksiya muvaffaqiyatli qo'shildi!");
        setPromoModalOpen(false);
        setEditingPromoId(null);
        // Clear fields
        setPromoTitleUz('');
        setPromoTitleRu('');
        setPromoTitleEn('');
        setPromoDescUz('');
        setPromoDescRu('');
        setPromoDescEn('');
        setPromoImage('');
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPromoClick = (item: any) => {
    setEditingPromoId(item.id);
    setPromoTitleUz(item.titleUz || '');
    setPromoTitleRu(item.titleRu || '');
    setPromoTitleEn(item.titleEn || '');
    setPromoDescUz(item.descriptionUz || '');
    setPromoDescRu(item.descriptionRu || '');
    setPromoDescEn(item.descriptionEn || '');
    setPromoImage(item.image || '');
    setPromoModalOpen(true);
  };

  const handleDeletePromo = async (promoId: string) => {
    if (!confirm("Haqiqatan ham bu aksiyani o'chirib tashlamoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/promotions?id=${promoId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Aksiya muvaffaqiyatli o'chirildi!");
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCreditStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-credit', id, status, notes })
      });
      if (res.ok) {
        alert("Kredit arizasi holati yangilandi!");
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-border">
        <div className="p-3 bg-gold text-black rounded-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Buxoro Avto Magnat Admin Panel</h1>
          <p className="text-sm text-neutral-400 mt-1">Dilerlik markazining to'liq boshqaruvi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="bg-card border border-border p-4 rounded-xl h-fit space-y-1">
          {hasPermission('analytics') && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'analytics' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistika & Analitika</span>
            </button>
          )}

          {hasPermission('cars') && (
            <button
              onClick={() => setActiveTab('cars')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'cars' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Avtomobillar nazorati ({cars.length})</span>
            </button>
          )}

          {hasPermission('bookings') && (
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'bookings' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Test-Drayv arizalari ({bookings.length})</span>
            </button>
          )}

          {hasPermission('tradeins') && (
            <button
              onClick={() => setActiveTab('tradeins')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'tradeins' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Trade-In arizalari ({tradeIns.length})</span>
            </button>
          )}

          {hasPermission('credits') && (
            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'credits' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Kredit arizalari ({credits.length})</span>
            </button>
          )}

          {hasPermission('banks') && (
            <button
              onClick={() => setActiveTab('banks')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'banks' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>Kredit dasturlari ({banks.length})</span>
            </button>
          )}

          {hasPermission('settings') && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'settings' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Veb-sayt sozlamalari</span>
            </button>
          )}

          {isSuper && (
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'users' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Foydalanuvchilar ({users.length})</span>
            </button>
          )}

          {hasPermission('branches') && (
            <button
              onClick={() => setActiveTab('branches')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'branches' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Filiallar nazorati ({branches.length})</span>
            </button>
          )}

          {hasPermission('news') && (
            <button
              onClick={() => setActiveTab('news')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'news' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Yangiliklar nazorati ({news.length})</span>
            </button>
          )}

          {hasPermission('settings') && (
            <button
              onClick={() => setActiveTab('promotions')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'promotions' ? 'bg-gold text-black' : 'text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>Aksiyalar & Slayder ({promotions.length})</span>
            </button>
          )}
        </div>

        {/* Content Workspace Panel */}
        <div className="lg:col-span-3">
          
          {loadingData ? (
            <div className="text-center py-20 text-lg font-bold">{t('loading')}</div>
          ) : (
            <div className="bg-card border border-border p-6 sm:p-8 rounded-xl shadow-md min-h-[500px]">
              
              {/* Tab 1: Analytics Dashboard */}
              {activeTab === 'analytics' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold border-b border-border pb-3">Statistika & Analitika</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-border p-5 rounded-xl bg-black/[0.01]">
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Avtomobillar</span>
                      <p className="text-2xl sm:text-3xl font-black text-gold mt-1">{cars.length}</p>
                    </div>
                    <div className="border border-border p-5 rounded-xl bg-black/[0.01]">
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Test-Drayvlar</span>
                      <p className="text-2xl sm:text-3xl font-black text-gold mt-1">{bookings.length}</p>
                    </div>
                    <div className="border border-border p-5 rounded-xl bg-black/[0.01]">
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Trade-In arizalar</span>
                      <p className="text-2xl sm:text-3xl font-black text-gold mt-1">{tradeIns.length}</p>
                    </div>
                    <div className="border border-border p-5 rounded-xl bg-black/[0.01]">
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Kredit banklari</span>
                      <p className="text-2xl sm:text-3xl font-black text-gold mt-1">{banks.length}</p>
                    </div>
                  </div>

                  {/* Premium Ilova Chart simulator */}
                  <div className="border border-border p-6 rounded-xl bg-black/10 dark:bg-white/[0.01] space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm">Haftalik arizalar soni (Bookings Growth)</h4>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">+18% o'sish</span>
                    </div>
                    {/* Columns representation */}
                    <div className="flex items-end justify-between h-48 pt-6 border-b border-border/80 text-[10px] text-neutral-500 font-bold">
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold/40 w-full rounded-t h-12" />
                        <span>Dush</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold/50 w-full rounded-t h-20" />
                        <span>Sesh</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold/60 w-full rounded-t h-28" />
                        <span>Chor</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold/75 w-full rounded-t h-32" />
                        <span>Pay</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold/80 w-full rounded-t h-40" />
                        <span>Jum</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold w-full rounded-t h-44" />
                        <span>Shan</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2 w-[12%]">
                        <div className="bg-gold/30 w-full rounded-t h-16" />
                        <span>Yak</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Cars Management */}
              {activeTab === 'cars' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h2 className="text-xl font-bold">Katalog avtomobillari</h2>
                    <button
                      onClick={() => {
                        setEditingCarId(null);
                        setCarName('');
                        setCarVin('');
                        setCarPrice(25000);
                        setCarDiscount(0);
                        setCarPriceListUrl('');
                        setCarColorImages({});
                        setCarModalOpen(true);
                      }}
                      className="bg-gold hover:bg-gold-hover text-black px-4 py-2 rounded text-xs font-extrabold flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('addCar')}</span>
                    </button>
                  </div>

                  {/* Cars Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-neutral-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-2">Rasm</th>
                          <th className="py-3 px-2">Model</th>
                          <th className="py-3 px-2">Narxi</th>
                          <th className="py-3 px-2">Kafolat</th>
                          <th className="py-3 px-2">Yili</th>
                          <th className="py-3 px-2">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars.map((car) => (
                          <tr key={car.id} className="border-b border-border/60 hover:bg-white/[0.01]">
                            <td className="py-3 px-2">
                              <img src={car.mainImage} alt={car.name} className="w-12 h-8 object-cover rounded" />
                            </td>
                            <td className="py-3 px-2">
                              <p className="font-bold text-sm">{car.name}</p>
                              <p className="text-[10px] text-neutral-500 uppercase">{car.vin}</p>
                            </td>
                            <td className="py-3 px-2">
                              <p className="font-extrabold text-gold">${(car.price - car.discount).toLocaleString()}</p>
                              {car.discount > 0 && <p className="text-[9px] line-through text-neutral-500">${car.price.toLocaleString()}</p>}
                            </td>
                            <td className="py-3 px-2">3 yil / 100k km</td>
                            <td className="py-3 px-2">{car.year}</td>
                            <td className="py-3 px-2 space-x-2">
                              <button 
                                onClick={() => handleEditCarClick(car)}
                                className="p-1 bg-blue-600/10 text-blue-500 rounded border border-blue-600/25 hover:bg-blue-600 hover:text-white"
                                title="Tahrirlash"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCarClick(car.id)}
                                className="p-1 bg-red-600/10 text-red-500 rounded border border-red-600/25 hover:bg-red-600 hover:text-white"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Test Drive Bookings */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">Test-Drayv buyurtmalari</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-neutral-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-2">Mijoz</th>
                          <th className="py-3 px-2">Avtomobil</th>
                          <th className="py-3 px-2">Sana</th>
                          <th className="py-3 px-2">Izoh</th>
                          <th className="py-3 px-2">Holati</th>
                          <th className="py-3 px-2">Tasdiq</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id} className="border-b border-border/60">
                            <td className="py-3 px-2">
                              <p className="font-bold">{b.name}</p>
                              <p className="text-[10px] text-neutral-500">{b.phone}</p>
                            </td>
                            <td className="py-3 px-2 font-semibold text-gold">{b.car?.name || 'Mavjud emas'}</td>
                            <td className="py-3 px-2">{new Date(b.date).toLocaleDateString()}</td>
                            <td className="py-3 px-2 italic text-neutral-400">"{b.notes || ''}"</td>
                            <td className="py-3 px-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                b.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                                b.status === 'COMPLETED' ? 'bg-neutral-500/10 text-neutral-400' :
                                'bg-amber-500/10 text-amber-400'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 space-x-2">
                              {b.status === 'PENDING' && (
                                <button 
                                  onClick={() => handleUpdateBookingStatus(b.id, 'APPROVED')}
                                  className="p-1 bg-emerald-600/10 text-emerald-500 rounded border border-emerald-600/25 hover:bg-emerald-600 hover:text-white"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {b.status === 'APPROVED' && (
                                <button 
                                  onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                                  className="px-2 py-1 bg-neutral-800 text-white rounded text-[10px]"
                                >
                                  Tugatish
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Trade-In Requests */}
              {activeTab === 'tradeins' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">Trade-In arizalari</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-neutral-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-2">Mijoz</th>
                          <th className="py-3 px-2">Eski mashina</th>
                          <th className="py-3 px-2">Yili / Masofa</th>
                          <th className="py-3 px-2">Baholangan narx</th>
                          <th className="py-3 px-2">Holati</th>
                          <th className="py-3 px-2">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradeIns.map((t) => (
                          <tr key={t.id} className="border-b border-border/60">
                            <td className="py-3 px-2">
                              <p className="font-bold">{t.name}</p>
                              <p className="text-[10px] text-neutral-500">{t.phone}</p>
                            </td>
                            <td className="py-3 px-2 font-semibold text-white">{t.carBrand} {t.carModel}</td>
                            <td className="py-3 px-2">{t.carYear}-yil / {(t.mileage || 0).toLocaleString()} km</td>
                            <td className="py-3 px-2 font-black text-emerald-400">
                              {t.estimatedPrice ? `$${Number(t.estimatedPrice).toLocaleString()}` : 'Baholanmagan'}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                t.status === 'EVALUATED' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-amber-500/10 text-amber-400'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <button
                                onClick={() => openTradeValuation(t.id)}
                                className="px-2.5 py-1 bg-gold text-black rounded text-[10px] font-extrabold hover:bg-gold-hover"
                              >
                                Baholash
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 5: Banks & Credit Settings */}
              {activeTab === 'banks' && (
                <div className="space-y-8">
                  <div className="border-b border-border pb-3 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Kredit banklari nazorati</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    {/* Add Bank Form */}
                    <form onSubmit={handleAddBank} className="border border-border p-5 rounded-xl bg-black/[0.02] space-y-4">
                      <h4 className="font-bold text-sm text-gold flex items-center gap-1"><Plus className="w-4 h-4" /> Bank qo'shish</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">Bank nomi</label>
                        <input
                          type="text" required placeholder="Masalan: NBU Bank" value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-gold"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-bold uppercase">Min Foiz (%)</label>
                          <input
                            type="number" step="0.1" required value={isNaN(bankMinInterest) ? '' : bankMinInterest}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setBankMinInterest(isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-bold uppercase">Max Foiz (%)</label>
                          <input
                            type="number" step="0.1" required value={isNaN(bankMaxInterest) ? '' : bankMaxInterest}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setBankMaxInterest(isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">Minimal Boshlang'ich (%)</label>
                        <input
                          type="number" required value={isNaN(bankDownPayment) ? '' : bankDownPayment}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setBankDownPayment(isNaN(val) ? 0 : val);
                          }}
                          className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-bold uppercase">Min Muddat (oy)</label>
                          <input
                            type="number" required value={isNaN(bankMinTerm) ? '' : bankMinTerm}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setBankMinTerm(isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-bold uppercase">Max Muddat (oy)</label>
                          <input
                            type="number" required value={isNaN(bankMaxTerm) ? '' : bankMaxTerm}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setBankMaxTerm(isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-background border border-border px-3 py-1.5 rounded text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-gold text-black py-2 rounded text-xs font-bold hover:bg-gold-hover transition-colors">
                        Dasturni saqlash
                      </button>
                    </form>

                    {/* Banks list */}
                    <div className="md:col-span-2 space-y-3">
                      <h4 className="font-bold text-sm">Amaldagi bank dasturlari</h4>
                      {banks.map((bank) => (
                        <div key={bank.id} className="border border-border p-4 rounded-xl flex justify-between items-center bg-black/[0.01]">
                          <div>
                            <h4 className="font-extrabold text-sm text-white">{bank.bankName}</h4>
                            <p className="text-xs text-neutral-400">
                              Foiz stavkasi: <strong>{bank.minInterestRate || bank.interestRate}%{bank.maxInterestRate ? ` - ${bank.maxInterestRate}%` : ''}</strong> • Boshlang'ich: <strong>{bank.minDownPayment}%</strong> • Muddat: <strong>{bank.minTermMonths || 12} - {bank.maxTermMonths || bank.termMonths} oy</strong>
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteBank(bank.id)}
                            className="p-1.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded border border-red-600/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 6: Website settings form */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">Kontaktlar & Sozlamalar</h2>
                  
                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Showrum telefon raqami</label>
                      <input
                        type="text" value={settPhone} onChange={(e) => setSettPhone(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Telegram kanal / bot linki</label>
                      <input
                        type="text" value={settTelegram} onChange={(e) => setSettTelegram(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">WhatsApp linki</label>
                      <input
                        type="text" value={settWhatsapp} onChange={(e) => setSettWhatsapp(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Showrum elektron pochtasi (Email)</label>
                      <input
                        type="email" value={settEmail} onChange={(e) => setSettEmail(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Bosh salon manzili (O'zbekcha)</label>
                      <input
                        type="text" value={settAddrUz} onChange={(e) => setSettAddrUz(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Bosh salon manzili (Ruscha)</label>
                      <input
                        type="text" value={settAddrRu} onChange={(e) => setSettAddrRu(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Bosh salon manzili (Inglizcha)</label>
                      <input
                        type="text" value={settAddrEn} onChange={(e) => setSettAddrEn(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 rounded text-sm focus:outline-none focus:border-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-gold hover:bg-gold-hover text-black px-6 py-2.5 rounded font-extrabold text-sm"
                    >
                      Barcha o'zgarishlarni saqlash
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 7: Users List */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-border pb-3">Foydalanuvchilar Ro'yxati</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border text-neutral-400">
                          <th className="py-3 px-2 font-bold">Foydalanuvchi</th>
                          <th className="py-3 px-2 font-bold">E-pochta</th>
                          <th className="py-3 px-2 font-bold">Rol / Ruxsatnomalar</th>
                          <th className="py-3 px-2 font-bold text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-white/[0.01]">
                            <td className="py-3 px-2">
                              <p className="font-bold text-white">{u.name}</p>
                              <p className="text-xs text-neutral-500">{u.id}</p>
                            </td>
                            <td className="py-3 px-2 text-neutral-300">{u.email}</td>
                            <td className="py-3 px-2 py-4">
                              <div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  u.role === 'ADMIN' ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {u.role === 'ADMIN' ? (u.email === 'admin@magnat.uz' ? 'SUPER ADMIN' : 'SUB ADMIN') : u.role}
                                </span>
                                
                                {u.role === 'ADMIN' && u.email !== 'admin@magnat.uz' && (
                                  <div className="mt-3 p-3 bg-neutral-900 border border-border/80 rounded-lg text-xs space-y-2 max-w-sm">
                                    <p className="font-black text-neutral-400 uppercase tracking-wider text-[9px]">Ruxsat etilgan bo'limlar:</p>
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                      {[
                                        { key: 'analytics', label: 'Statistika' },
                                        { key: 'cars', label: 'Avtomobillar' },
                                        { key: 'bookings', label: 'Test-Drayv' },
                                        { key: 'tradeins', label: 'Trade-In' },
                                        { key: 'credits', label: 'Kredit arizalari' },
                                        { key: 'banks', label: 'Kredit dasturlari' },
                                        { key: 'settings', label: 'Sozlamalar' },
                                        { key: 'branches', label: 'Filiallar' },
                                        { key: 'news', label: 'Yangiliklar' }
                                      ].map((p) => {
                                        const hasP = u.permissions?.includes(p.key);
                                        return (
                                          <label key={p.key} className="flex items-center space-x-1.5 cursor-pointer text-neutral-300 hover:text-white">
                                            <input
                                              type="checkbox"
                                              checked={hasP}
                                              onChange={async () => {
                                                const currentPerms = u.permissions || [];
                                                const newPerms = hasP 
                                                  ? currentPerms.filter((x: string) => x !== p.key)
                                                  : [...currentPerms, p.key];
                                                
                                                await fetch('/api/users', {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ id: u.id, permissions: newPerms })
                                                });
                                                loadAllAdminData();
                                              }}
                                              className="rounded border-border text-gold bg-background focus:ring-0 w-3.5 h-3.5"
                                            />
                                            <span>{p.label}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right space-x-2">
                              {user?.id !== u.id && u.email !== 'admin@magnat.uz' && (
                                <>
                                  <button
                                    onClick={() => handleToggleUserRole(u.id, u.role)}
                                    className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-gold hover:text-black rounded text-neutral-300 font-bold transition-all border border-border"
                                  >
                                    {u.role === 'ADMIN' ? "User qilish" : "Admin qilish"}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="px-2 py-1 text-xs bg-red-950 hover:bg-red-600 rounded text-red-500 hover:text-white font-bold transition-all border border-red-900/30"
                                  >
                                    O'chirish
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 10: Credit Applications */}
              {activeTab === 'credits' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <h2 className="text-xl font-bold border-b border-border pb-3">Avtokredit Arizalari</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-neutral-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-2">Mijoz</th>
                          <th className="py-3 px-2">Avtomobil</th>
                          <th className="py-3 px-2">Boshlang'ich to'lov / Muddat</th>
                          <th className="py-3 px-2">Oylik to'lov</th>
                          <th className="py-3 px-2">Holati</th>
                          <th className="py-3 px-2 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {credits.map((c: any) => (
                          <tr key={c.id} className="hover:bg-white/[0.01]">
                            <td className="py-3 px-2">
                              <p className="font-bold text-white text-sm">{c.name}</p>
                              <p className="text-xs text-neutral-400">{c.phone}</p>
                            </td>
                            <td className="py-3 px-2">
                              <p className="font-bold text-white text-sm">
                                {c.car ? `${c.car.brand} ${c.car.name}` : "Noma'lum avto"}
                              </p>
                            </td>
                            <td className="py-3 px-2 text-neutral-300">
                              <p>{c.downPayment}</p>
                              <p className="text-[10px] text-neutral-500">{c.termMonths} oy muddatga</p>
                            </td>
                            <td className="py-3 px-2 text-gold font-bold">${(c.monthlyPayment || 0).toLocaleString()}</td>
                            <td className="py-3 px-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                                c.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                c.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right space-x-1">
                              {c.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateCreditStatus(c.id, 'APPROVED')}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                                  >
                                    Tasdiqlash
                                  </button>
                                  <button
                                    onClick={() => handleUpdateCreditStatus(c.id, 'REJECTED')}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold"
                                  >
                                    Rad etish
                                  </button>
                                </>
                              )}
                              {c.status !== 'PENDING' && (
                                <span className="text-[10px] text-neutral-500 italic">Bajarildi</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 8: Branches Control */}
              {activeTab === 'branches' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h2 className="text-xl font-bold">Filiallar va Shourumlar</h2>
                    <button
                      onClick={() => {
                        setEditingBranchId(null);
                        setBranchNameUz('');
                        setBranchNameRu('');
                        setBranchNameEn('');
                        setBranchAddressUz('');
                        setBranchAddressRu('');
                        setBranchAddressEn('');
                        setBranchPhone('');
                        setBranchMapUrl('');
                        setBranchModalOpen(true);
                      }}
                      className="bg-gold hover:bg-gold-hover text-black px-4 py-2 rounded text-xs font-extrabold flex items-center space-x-1"
                    >
                      <span>+ Yangi filial qo'shish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {branches.map((b: any) => (
                      <div key={b.id} className="border border-border p-5 rounded-xl bg-black/[0.02] flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-white text-lg">{b.nameUz}</h3>
                          <p className="text-xs text-neutral-400 font-medium">📍 {b.addressUz}</p>
                          <p className="text-xs text-neutral-400 font-medium">📞 {b.phone}</p>
                          <p className="text-[10px] text-neutral-500 font-light truncate">🗺️ {b.mapUrl}</p>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleEditBranchClick(b)}
                            className="w-1/2 py-2 border border-border hover:bg-neutral-800 text-neutral-300 hover:text-white rounded text-xs font-bold transition-all"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(b.id)}
                            className="w-1/2 py-2 bg-red-950/20 hover:bg-red-600 border border-red-900/30 hover:border-red-600 text-red-400 hover:text-white rounded text-xs font-bold transition-all"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 9: News Control */}
              {activeTab === 'news' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h2 className="text-xl font-bold">Yangiliklar va E'lonlar</h2>
                    <button
                      onClick={() => {
                        setEditingNewsId(null);
                        setNewsTitleUz('');
                        setNewsTitleRu('');
                        setNewsTitleEn('');
                        setNewsDescUz('');
                        setNewsDescRu('');
                        setNewsDescEn('');
                        setNewsImage('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800');
                        setNewsModalOpen(true);
                      }}
                      className="bg-gold hover:bg-gold-hover text-black px-4 py-2 rounded text-xs font-extrabold flex items-center space-x-1"
                    >
                      <span>+ Yangi yangilik qo'shish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {news.map((item: any) => (
                      <div key={item.id} className="border border-border p-5 rounded-xl bg-black/[0.02] flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <img
                            src={item.image}
                            alt={item.titleUz}
                            className="w-full h-36 object-cover rounded-lg border border-border"
                          />
                          <div>
                            <h3 className="font-extrabold text-white text-base line-clamp-1">{item.titleUz}</h3>
                            <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{item.descUz}</p>
                            <span className="text-[10px] text-neutral-500 block mt-2">🕒 {new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleEditNewsClick(item)}
                            className="w-1/2 py-2 border border-border hover:bg-neutral-800 text-neutral-300 hover:text-white rounded text-xs font-bold transition-all"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="w-1/2 py-2 bg-red-950/20 hover:bg-red-600 border border-red-900/30 hover:border-red-600 text-red-400 hover:text-white rounded text-xs font-bold transition-all"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 10: Promotions (Aksiyalar / Slayder) Control */}
              {activeTab === 'promotions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h2 className="text-xl font-bold">Aksiyalar va Reklama Slayderi</h2>
                    <button
                      onClick={() => {
                        setEditingPromoId(null);
                        setPromoTitleUz('');
                        setPromoTitleRu('');
                        setPromoTitleEn('');
                        setPromoDescUz('');
                        setPromoDescRu('');
                        setPromoDescEn('');
                        setPromoImage('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800');
                        setPromoModalOpen(true);
                      }}
                      className="bg-gold hover:bg-gold-hover text-black px-4 py-2 rounded text-xs font-extrabold flex items-center space-x-1"
                    >
                      <span>+ Yangi aksiya qo'shish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {promotions.map((item: any) => (
                      <div key={item.id} className="border border-border p-5 rounded-xl bg-black/[0.02] flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <img
                            src={item.image}
                            alt={item.titleUz}
                            className="w-full h-36 object-cover rounded-lg border border-border"
                          />
                          <div>
                            <h3 className="font-extrabold text-white text-base line-clamp-1">{item.titleUz}</h3>
                            <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{item.descriptionUz}</p>
                            <span className="text-[10px] text-neutral-500 block mt-2">🕒 Bosh sahifa slayderida ko'rinadi</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleEditPromoClick(item)}
                            className="w-1/2 py-2 border border-border hover:bg-neutral-800 text-neutral-300 hover:text-white rounded text-xs font-bold transition-all"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeletePromo(item.id)}
                            className="w-1/2 py-2 bg-red-950/20 hover:bg-red-600 border border-red-900/30 hover:border-red-600 text-red-400 hover:text-white rounded text-xs font-bold transition-all"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Car Form Modal (Add / Edit) */}
      {carModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-lg w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setCarModalOpen(false)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">{editingCarId ? 'Avtomobil ma\'lumotlarini tahrirlash' : 'Yangi avtomobil qo\'shish'}</h3>

            <form onSubmit={handleSaveCar} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Nomi</label>
                <input
                  type="text" required value={carName} onChange={(e) => setCarName(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Narxi (so'm)</label>
                  <input
                    type="number" required value={isNaN(carPrice) ? '' : carPrice} onChange={(e) => setCarPrice(parseInt(e.target.value))}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Chegirma (so'm)</label>
                  <input
                    type="number" value={isNaN(carDiscount) ? '' : carDiscount} onChange={(e) => setCarDiscount(parseInt(e.target.value))}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Dvigatel</label>
                  <input
                    type="text" required value={carEngine} onChange={(e) => setCarEngine(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Ot kuchi</label>
                  <input
                    type="number" required value={isNaN(carHorsepower) ? '' : carHorsepower} onChange={(e) => setCarHorsepower(parseInt(e.target.value))}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Ishlab chiq. yili</label>
                  <input
                    type="number" required value={isNaN(carYear) ? '' : carYear} onChange={(e) => setCarYear(parseInt(e.target.value))}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Transmissiya</label>
                  <select
                    value={carTransmission} onChange={(e) => setCarTransmission(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-2 rounded text-xs"
                  >
                    <option value="AUTOMATIC">Avtomat</option>
                    <option value="MANUAL">Mexanik</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Yoqilg'i</label>
                  <select
                    value={carFuelType} onChange={(e) => setCarFuelType(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-2 rounded text-xs"
                  >
                    <option value="PETROL">Petrol (Benzin)</option>
                    <option value="GAS">Gas (Metan)</option>
                    <option value="ELECTRIC">Elektr</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Qoldiq (Soni)</label>
                  <input
                    type="number" required value={isNaN(carStock) ? '' : carStock} onChange={(e) => setCarStock(parseInt(e.target.value))}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Toifa (Category)</label>
                  <select
                    value={carCategoryId} onChange={(e) => setCarCategoryId(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-2 rounded text-xs"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nameUz}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Tana rangi</label>
                  <select
                    value={carColorId} onChange={(e) => setCarColorId(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-2 rounded text-xs"
                  >
                    {colors.map(col => <option key={col.id} value={col.id}>{col.nameUz}</option>)}
                  </select>
                </div>
              </div>

              {/* Tavsiflar (Descriptions) */}
              <div className="space-y-3 p-3 bg-neutral-900/40 border border-border rounded-lg">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Avtomobil Tavsifi</span>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase">Tavsif (UZ)</label>
                  <textarea
                    value={carDescUz} onChange={(e) => setCarDescUz(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-1.5 rounded text-xs focus:outline-none focus:border-gold h-12 resize-none"
                    placeholder="Masalan: Chevrolet Tahoe..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase">Tavsif (RU)</label>
                  <textarea
                    value={carDescRu} onChange={(e) => setCarDescRu(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-1.5 rounded text-xs focus:outline-none focus:border-gold h-12 resize-none"
                    placeholder="Пример: Chevrolet Tahoe..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase">Tavsif (EN)</label>
                  <textarea
                    value={carDescEn} onChange={(e) => setCarDescEn(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-1.5 rounded text-xs focus:outline-none focus:border-gold h-12 resize-none"
                    placeholder="Example: Chevrolet Tahoe..."
                  />
                </div>
              </div>

              {/* 360 Spin Angle Images */}
              <div className="space-y-3 p-3 bg-neutral-900/40 border border-border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">360° Ko'rish Rasmlari (4 burchak rasmi)</span>
                  <span className="text-[9px] text-neutral-500 font-bold">Yuklanmasa 360° tugmasi ko'rinmaydi</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[9px] text-neutral-400 font-bold uppercase">{idx + 1}-Burchak Rasmi</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={carImages[idx] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCarImages(prev => {
                              const copy = [...prev];
                              copy[idx] = val;
                              return copy;
                            });
                          }}
                          className="flex-grow bg-background border border-border px-2 py-1.5 rounded text-[10px] focus:outline-none focus:border-gold"
                          placeholder="Rasm URL"
                        />
                        <label className="bg-neutral-800 border border-border px-2 py-1.5 rounded text-[10px] font-bold text-neutral-300 hover:text-white cursor-pointer hover:bg-neutral-700 transition-all flex items-center justify-center shrink-0">
                          <span>Yuklash</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    if (data.url) {
                                      setCarImages(prev => {
                                        const copy = [...prev];
                                        copy[idx] = data.url;
                                        return copy;
                                      });
                                    }
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase block">Rasm (Main Image)</label>
                <div className="flex gap-2">
                  <input
                    type="text" required value={carMainImage} onChange={(e) => setCarMainImage(e.target.value)}
                    className="flex-grow bg-background border border-border px-3 py-2 rounded text-xs focus:outline-none focus:border-gold"
                    placeholder="Rasm linki yoki fayl tanlang"
                  />
                  <label className="bg-neutral-800 border border-border px-3 py-2 rounded text-xs font-bold text-neutral-300 hover:text-white cursor-pointer hover:bg-neutral-700 transition-all flex items-center justify-center shrink-0">
                    <span>Fayl yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (data.url) {
                                setCarMainImage(data.url);
                                alert("Rasm muvaffaqiyatli yuklandi!");
                              }
                            } else {
                              alert("Yuklashda xatolik yuz berdi");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Ulanish xatosi");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase block">Prays / Broshyura fayli (Brochure PDF / Price List)</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={carPriceListUrl} onChange={(e) => setCarPriceListUrl(e.target.value)}
                    className="flex-grow bg-background border border-border px-3 py-2 rounded text-xs focus:outline-none focus:border-gold"
                    placeholder="Fayl linki yoki yuklang (ixtiyoriy)"
                  />
                  <label className="bg-neutral-800 border border-border px-3 py-2 rounded text-xs font-bold text-neutral-300 hover:text-white cursor-pointer hover:bg-neutral-700 transition-all flex items-center justify-center shrink-0">
                    <span>Fayl yuklash</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (data.url) {
                                setCarPriceListUrl(data.url);
                                alert("Fayl muvaffaqiyatli yuklandi!");
                              }
                            } else {
                              alert("Yuklashda xatolik yuz berdi");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Ulanish xatosi");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-neutral-900/50 p-4 border border-border rounded-lg space-y-3">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Kuzov ranglari rasmlari (Ixtiyoriy rangli tasvirlar)</span>
                {[
                  { hex: '#FFFFFF', name: 'Oq (GAZ - Summit White)' },
                  { hex: '#111111', name: 'Qora (GGB - Carbon Flash)' },
                  { hex: '#4A4A4A', name: 'Satin (GYM - Satin Steel)' },
                  { hex: '#C0C0C0', name: 'Kumushrang (GAN - Switchblade)' },
                  { hex: '#E53E3E', name: 'Qizil (GD8 - Pull Me Over)' },
                  { hex: '#1E3A8A', name: 'To\'q ko\'k (GD7 - Darkmoon Blue)' },
                  { hex: '#B45309', name: 'Yantar oltin (GK2 - Bronze)' }
                ].map((c) => (
                  <div key={c.hex} className="flex items-center space-x-3 text-xs">
                    <span className="w-5 h-5 rounded-full border border-border shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="w-24 shrink-0 text-[11px] font-medium text-neutral-300">{c.name}</span>
                    <input
                      type="text"
                      placeholder="Rasm havolasi"
                      value={carColorImages[c.hex] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCarColorImages(prev => {
                          const copy = { ...prev };
                          if (val) copy[c.hex] = val;
                          else delete copy[c.hex];
                          return copy;
                        });
                      }}
                      className="flex-grow bg-background border border-border px-2 py-1 rounded text-[11px] focus:outline-none focus:border-gold"
                    />
                    <label className="bg-neutral-800 border border-border px-2 py-1 rounded text-[11px] font-bold text-neutral-300 hover:text-white cursor-pointer hover:bg-neutral-700 transition-all shrink-0">
                      <span>Yuklash</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const res = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                              });
                              if (res.ok) {
                                const data = await res.json();
                                if (data.url) {
                                  setCarColorImages(prev => ({ ...prev, [c.hex]: data.url }));
                                  alert(`${c.name} rasmi yuklandi!`);
                                }
                              } else {
                                alert("Yuklashda xatolik yuz berdi");
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black py-3 rounded font-extrabold text-xs transition-colors"
              >
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trade-In Valuation Action Modal */}
      {tradeValuationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-md w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150">
            <button onClick={() => setTradeValuationOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-4">Trade-In arizasini baholash</h3>

            <form onSubmit={submitTradeValuation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400">Taxminiy taklif qilinadigan narx (USD)</label>
                <input
                  type="number" required placeholder="Masalan: 12000" value={valuingPrice}
                  onChange={(e) => setValuingPrice(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400">Baholash bayoni / Izohlar</label>
                <textarea
                  rows={3} required placeholder="Diler taklifi tafsilotlari" value={valuingNotes}
                  onChange={(e) => setValuingNotes(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded mt-1 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <button type="submit" className="w-full bg-gold text-black py-3 rounded font-bold text-sm">
                Baholash arizasini yakunlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Branch Form Modal (Add / Edit) */}
      {branchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-lg w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setBranchModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-4">{editingBranchId ? 'Filial ma\'lumotlarini tahrirlash' : 'Yangi filial qo\'shish'}</h3>

            <form onSubmit={handleSaveBranch} className="space-y-4 text-foreground">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Nomi (Uz)</label>
                  <input
                    type="text" required value={branchNameUz} onChange={(e) => setBranchNameUz(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Nomi (Ru)</label>
                  <input
                    type="text" required value={branchNameRu} onChange={(e) => setBranchNameRu(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Nomi (En)</label>
                  <input
                    type="text" required value={branchNameEn} onChange={(e) => setBranchNameEn(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Manzili (Uzbekcha)</label>
                <input
                  type="text" required value={branchAddressUz} onChange={(e) => setBranchAddressUz(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Manzili (Russian)</label>
                  <input
                    type="text" required value={branchAddressRu} onChange={(e) => setBranchAddressRu(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Manzili (English)</label>
                  <input
                    type="text" required value={branchAddressEn} onChange={(e) => setBranchAddressEn(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Telefon raqami</label>
                  <input
                    type="text" required value={branchPhone} onChange={(e) => setBranchPhone(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Google Maps Embed URL</label>
                  <input
                    type="text" required value={branchMapUrl} onChange={(e) => setBranchMapUrl(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black py-3 rounded font-extrabold text-xs transition-colors"
              >
                Filialni saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* News Form Modal (Add / Edit) */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-lg w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setNewsModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-4">{editingNewsId ? 'Yangilik ma\'lumotlarini tahrirlash' : 'Yangi yangilik qo\'shish'}</h3>

            <form onSubmit={handleSaveNews} className="space-y-4 text-foreground">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Sarlavha (Uzbekcha)</label>
                <input
                  type="text" required value={newsTitleUz} onChange={(e) => setNewsTitleUz(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Sarlavha (Russian)</label>
                  <input
                    type="text" required value={newsTitleRu} onChange={(e) => setNewsTitleRu(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Sarlavha (English)</label>
                  <input
                    type="text" required value={newsTitleEn} onChange={(e) => setNewsTitleEn(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Tafsilotlar / Matn (Uzbekcha)</label>
                <textarea
                  rows={3} required value={newsDescUz} onChange={(e) => setNewsDescUz(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Matn (Russian)</label>
                  <textarea
                    rows={2} required value={newsDescRu} onChange={(e) => setNewsDescRu(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Matn (English)</label>
                  <textarea
                    rows={2} required value={newsDescEn} onChange={(e) => setNewsDescEn(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase block">Rasm (Image)</label>
                <div className="flex gap-2">
                  <input
                    type="text" required value={newsImage} onChange={(e) => setNewsImage(e.target.value)}
                    className="flex-grow bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                    placeholder="Rasm linki yoki fayl tanlang"
                  />
                  <label className="bg-neutral-800 border border-border px-3 py-2 rounded text-xs font-bold text-neutral-300 hover:text-white cursor-pointer hover:bg-neutral-700 transition-all flex items-center justify-center shrink-0">
                    <span>Fayl yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (data.url) {
                                setNewsImage(data.url);
                                alert("Rasm muvaffaqiyatli yuklandi!");
                              }
                            } else {
                              alert("Yuklashda xatolik yuz berdi");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Ulanish xatosi");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black py-3 rounded font-extrabold text-xs transition-colors"
              >
                Yangilikni saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Promotion Form Modal (Add / Edit) */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border max-w-lg w-full p-6 rounded-xl relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setPromoModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-4">{editingPromoId ? 'Aksiyani tahrirlash' : 'Yangi aksiya / reklama qo\'shish'}</h3>

            <form onSubmit={handleSavePromo} className="space-y-4 text-foreground">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Sarlavha (Uzbekcha)</label>
                <input
                  type="text" required value={promoTitleUz} onChange={(e) => setPromoTitleUz(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Sarlavha (Russian)</label>
                  <input
                    type="text" required value={promoTitleRu} onChange={(e) => setPromoTitleRu(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Sarlavha (English)</label>
                  <input
                    type="text" required value={promoTitleEn} onChange={(e) => setPromoTitleEn(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Tafsilotlar (Uzbekcha)</label>
                <textarea
                  rows={3} required value={promoDescUz} onChange={(e) => setPromoDescUz(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Tafsilotlar (Russian)</label>
                  <textarea
                    rows={2} required value={promoDescRu} onChange={(e) => setPromoDescRu(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Tafsilotlar (English)</label>
                  <textarea
                    rows={2} required value={promoDescEn} onChange={(e) => setPromoDescEn(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase block">Reklama Rasmi (Image)</label>
                <div className="flex gap-2">
                  <input
                    type="text" required value={promoImage} onChange={(e) => setPromoImage(e.target.value)}
                    className="flex-grow bg-background border border-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold"
                    placeholder="Rasm linki yoki fayl tanlang"
                  />
                  <label className="bg-neutral-800 border border-border px-3 py-2 rounded text-xs font-bold text-neutral-300 hover:text-white cursor-pointer hover:bg-neutral-700 transition-all flex items-center justify-center shrink-0">
                    <span>Fayl yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (data.url) {
                                setPromoImage(data.url);
                                alert("Rasm muvaffaqiyatli yuklandi!");
                              }
                            } else {
                              alert("Yuklashda xatolik yuz berdi");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Ulanish xatosi");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black py-3 rounded font-extrabold text-xs transition-colors"
              >
                Aksiyani saqlash
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
