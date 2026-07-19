import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = typeof window === 'undefined' ? new PrismaClient() : null;
const isDbConnected = typeof window === 'undefined' && !!process.env.DATABASE_URL;

// Path for local JSON databases
const LOCAL_DB_DIR = typeof window === 'undefined' ? path.join(process.cwd(), 'src', 'data', 'db_local') : '';

// Helper to ensure directory exists and read/write JSON files
function readLocalJson(fileName: string, defaultData: any): any {
  if (typeof window !== 'undefined') return defaultData;
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    const filePath = path.join(LOCAL_DB_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading local db ${fileName}:`, error);
    return defaultData;
  }
}

function writeLocalJson(fileName: string, data: any): boolean {
  if (typeof window !== 'undefined') return false;
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    const filePath = path.join(LOCAL_DB_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing local db ${fileName}:`, error);
    return false;
  }
}

// Initial Seed Data definitions
const defaultBrands = [
  { id: 'brand-1', name: 'Chevrolet', logo: '/images/brands/chevrolet.png' }
];

const defaultCategories = [
  { id: 'cat-1', nameUz: 'Sedan', nameRu: 'Седан', nameEn: 'Sedan' },
  { id: 'cat-2', nameUz: 'SUV / Krossover', nameRu: 'Внедорожник / Кроссовер', nameEn: 'SUV / Crossover' },
  { id: 'cat-3', nameUz: 'Premium', nameRu: 'Премиум', nameEn: 'Premium' }
];

const defaultColors = [
  { id: 'col-1', nameUz: 'Qora metallik (GB0)', nameRu: 'Черный металлик', nameEn: 'Black Metallic', hexCode: '#111111' },
  { id: 'col-2', nameUz: 'Oq (GAZ)', nameRu: 'Белый', nameEn: 'White Pearl', hexCode: '#FFFFFF' },
  { id: 'col-3', nameUz: "To'q kulrang (GYM)", nameRu: 'Темно-серый (моккрый асфальт)', nameEn: 'Dark Grey', hexCode: '#4A4A4A' },
  { id: 'col-4', nameUz: 'Chevrolet Oltin', nameRu: 'Золотистый шевроле', nameEn: 'Chevrolet Gold', hexCode: '#D9A300' }
];

const defaultCars = [
  {
    id: 'car-malibu',
    vin: 'KL1TC1YF1LB35012X',
    name: 'Malibu 2 Turbo',
    descriptionUz: 'Chevrolet Malibu – dinamik dizayn, yuqori xavfsizlik darajasi va zamonaviy texnologiyalarni mujassam etgan premium sedan. 2.0L turbomotor va 6 pog‘onali avtomat uzatmalar qutisi bilan jihozlangan. Buxoro shahrida tayyor.',
    descriptionRu: 'Chevrolet Malibu – премиальный седан, сочетающий в себе динамичный дизайн, высокий уровень безопасности и современные технологии. Оснащен турбодвигателем 2.0L и 6-ступенчатой АКПП. В наличии в Бухаре.',
    descriptionEn: 'Chevrolet Malibu is a premium sedan that combines dynamic design, high security standards, and modern technology. Equipped with a 2.0L turbo engine and a 6-speed automatic transmission. Available in Bukhara.',
    price: 36500,
    discount: 1500,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '2.0L Turbo',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 253,
    stockCount: 4,
    mainImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    brandId: 'brand-1',
    categoryId: 'cat-1',
    colorId: 'col-1'
  },
  {
    id: 'car-tracker',
    vin: 'KL3TC1YF1LB99023A',
    name: 'Tracker 2 Redline',
    descriptionUz: 'Chevrolet Tracker – ixcham va tejamkor krossover. Shahar bo‘ylab va shahar tashqarisidagi safarlar uchun juda mos. 1.2L turbomotor 137 ot kuchi beradi. Boshlang‘ich to‘lov 10% dan boshlanadi.',
    descriptionRu: 'Chevrolet Tracker – компактный и экономичный кроссовер. Идеален для городских поездок и выездов за город. Турбированный мотор 1.2L развивает 137 л.с. Первоначальный взнос от 10%.',
    descriptionEn: 'Chevrolet Tracker is a compact and fuel-efficient crossover. Ideal for city commutes and weekend getaways. Powered by a 1.2L turbo engine generating 137 HP. Down payment starting from 10%.',
    price: 23200,
    discount: 0,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '1.2L Turbo',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 137,
    stockCount: 7,
    mainImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-2',
    colorId: 'col-3'
  },
  {
    id: 'car-tahoe',
    vin: '1GNSKBKC0LR12093B',
    name: 'Tahoe Premier V8',
    descriptionUz: 'Chevrolet Tahoe – afsonaviy to‘liq o‘lchamli premium yo‘ltanlamas. 5.3L V8 dvigatel va 10 pog‘onali avtomat uzatmalar qutisi. Maksimal darajada qulaylik, keng salon va ishonchlilik ramzi.',
    descriptionRu: 'Chevrolet Tahoe – легендарный полноразмерный внедорожник премиум-класса. Мощный двигатель V8 объемом 5.3 л и 10-ступенчатая АКПП. Символ роскоши, пространства и уверенности на дороге.',
    descriptionEn: 'Chevrolet Tahoe is a legendary full-size premium SUV. Powerful 5.3L V8 engine and a 10-speed automatic transmission. The ultimate symbol of comfort, space, and premium road dominance.',
    price: 98000,
    discount: 3000,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '5.3L V8',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 343,
    stockCount: 2,
    mainImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-3',
    colorId: 'col-1'
  },
  {
    id: 'car-onix',
    vin: 'KL2TC1YF1LB12830Z',
    name: 'Onix Premier',
    descriptionUz: 'Chevrolet Onix – zamonaviy dizayn va ilg‘or xavfsizlik tizimlariga ega tejamkor sedan. Yarim avtomat avtoturargoh, lyuk va iqlim nazorati tizimlari bilan jihozlangan. Buxoroda eng ko‘p sotilayotgan model.',
    descriptionRu: 'Chevrolet Onix – экономичный седан с современным дизайном и продвинутыми системами безопасности. Оснащен полуавтоматической парковкой, люком и климат-контролем. Бестселлер в Бухаре.',
    descriptionEn: 'Chevrolet Onix is a fuel-efficient sedan with a modern design and advanced safety systems. Features semi-automatic parking system, sunroof, and climate control. Top seller in Bukhara.',
    price: 17500,
    discount: 500,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '1.2L Turbo',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 132,
    stockCount: 15,
    mainImage: 'https://images.unsplash.com/photo-1617813903808-89c44ab4f15a?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-1',
    colorId: 'col-2'
  },
  {
    id: 'car-captiva',
    vin: 'KL5TC1YF1LB12440Y',
    name: 'Captiva 5',
    descriptionUz: 'Chevrolet Captiva – butun oila uchun keng va qulay 7 o‘rinli krossover. 1.5L turbo dvigatel, qulay charmli salon va multimedia paneli sizga oilaviy safarlarda unutilmas zavq beradi.',
    descriptionRu: 'Chevrolet Captiva – вместительный и комфортный 7-местный кроссовер для всей семьи. Турбомотор 1.5L, кожаный салон и мультимедийная панель подарят комфорт в любых семейных поездках.',
    descriptionEn: 'Chevrolet Captiva is a spacious and comfortable 7-seater crossover for the entire family. Features a 1.5L turbo engine, leather interior, and massive touchscreen console for travel joy.',
    price: 31000,
    discount: 0,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '1.5L Turbo',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 147,
    stockCount: 3,
    mainImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-2',
    colorId: 'col-4'
  },
  {
    id: 'car-cobalt',
    vin: 'KL4TC1YF1LB12901Z',
    name: 'Cobalt LTZ',
    descriptionUz: 'Chevrolet Cobalt – ishonchliligi, keng yukxonasi va arzon xizmat ko‘rsatilishi bilan O‘zbekistondagi eng mashhur oilaviy va shahar avtomobili. 1.5L tejamkor dvigatel.',
    descriptionRu: 'Chevrolet Cobalt – самый популярный семейный и городской автомобиль в Узбекистане благодаря своей надежности, огромному багажнику и дешевому обслуживанию. Экономичный двигатель 1.5л.',
    descriptionEn: 'Chevrolet Cobalt is the most popular family and city car in Uzbekistan owing to its extreme reliability, massive trunk, and low maintenance cost. Economical 1.5L engine.',
    price: 156000000,
    discount: 0,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '1.5L',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 106,
    stockCount: 22,
    mainImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-1',
    colorId: 'col-2'
  },
  {
    id: 'car-gentra',
    vin: 'KL4TC1YF1LB12902X',
    name: 'Lacetti-Gentra L-Style',
    descriptionUz: 'Chevrolet Gentra – klassik, qulay va hamyonbop sedan. Avtomat transmissiya, isitiladigan o‘rindiqlar va qulay boshqaruv uni shahar yo‘llarida tengsiz qiladi.',
    descriptionRu: 'Chevrolet Gentra – классический, комфортный и доступный седан. Автоматическая трансмиссия, подогрев сидений и легкое управление делают его лидером на городских дорогах.',
    descriptionEn: 'Chevrolet Gentra is a classic, comfortable, and affordable sedan. Automatic transmission, heated seats, and smooth handling make it a city driver favorite.',
    price: 165000000,
    discount: 0,
    availability: 'IN_STOCK',
    year: 2024,
    engine: '1.5L',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 105,
    stockCount: 12,
    mainImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-1',
    colorId: 'col-1'
  },
  {
    id: 'car-equinox',
    vin: 'KL4TC1YF1LB12903Y',
    name: 'Equinox Mild Hybrid',
    descriptionUz: 'Chevrolet Equinox – Mild Hybrid texnologiyasiga ega zamonaviy va tejamkor krossover. Kuchli 2.0L turbo dvigatel va 9 pog‘onali avtomat uzatmalar qutisi.',
    descriptionRu: 'Chevrolet Equinox – кроссовер с новейшей технологией Mild Hybrid. Мощный турбодвигатель 2.0L и 9-ступенчатая АКПП.',
    descriptionEn: 'Chevrolet Equinox is a modern crossover featuring Mild Hybrid technology. Packed with a 2.0L turbo engine and an advanced 9-speed automatic transmission.',
    price: 478000000,
    discount: 12500000,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '2.0L Turbo Hybrid',
    transmission: 'AUTOMATIC',
    fuelType: 'HYBRID',
    horsepower: 236,
    stockCount: 5,
    mainImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-2',
    colorId: 'col-3'
  },
  {
    id: 'car-traverse',
    vin: 'KL4TC1YF1LB12904Z',
    name: 'Traverse Premier V6',
    descriptionUz: 'Chevrolet Traverse – 8 o‘rinli, keng va nihoyatda hashamatli premium krossover. Kuchli 3.6L V6 dvigatel, eng so‘nggi xavfsizlik va media tizimlari.',
    descriptionRu: 'Chevrolet Traverse – просторный и роскошный 8-местный кроссовер премиум-класса. Мощный двигатель 3.6L V6, современные системы безопасности.',
    descriptionEn: 'Chevrolet Traverse is a spacious, luxurious 8-seater premium crossover. Equipped with a powerful 3.6L V6 engine and cutting-edge safety features.',
    price: 812000000,
    discount: 25000000,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '3.6L V6',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 318,
    stockCount: 4,
    mainImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-2',
    colorId: 'col-1'
  },
  {
    id: 'car-damas',
    vin: 'KL4TC1YF1LB12905K',
    name: 'Damas Deluxe',
    descriptionUz: 'Chevrolet Damas – tijorat, yuk va odam tashish uchun O‘zbekistondagi eng mashhur va sinalgan mikrominiven. O‘ta hamyonbop va chidamli ishchi kuchi.',
    descriptionRu: 'Chevrolet Damas – самый популярный и проверенный микроминивэн в Узбекистане для коммерции и пассажирских перевозок. Максимально доступный и выносливый.',
    descriptionEn: 'Chevrolet Damas is the most popular, time-tested commercial micro-minivan in Uzbekistan for freight and passenger transit. Highly affordable and durable.',
    price: 98000000,
    discount: 0,
    availability: 'IN_STOCK',
    year: 2025,
    engine: '0.8L',
    transmission: 'MANUAL',
    fuelType: 'PETROL',
    horsepower: 38,
    stockCount: 30,
    mainImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
  },
  {
    id: 'car-suburban',
    vin: '1GNSSCKC0LR19020S',
    name: 'Suburban High Country 2026',
    descriptionUz: 'Chevrolet Suburban High Country 2026 – Chevrolet yo‘ltanlamaslari oilasining eng yirik, hashamatli va kuchli vakili. 6.2L V8 dvigateli, pnevmatik osma va premium High Country saloni bilan jihozlangan.',
    descriptionRu: 'Chevrolet Suburban High Country 2026 – самый крупный, роскошный и мощный внедорожник в линейке Chevrolet. Оснащен двигателем V8 объемом 6.2 л, пневматической подвеской и премиальным салоном.',
    descriptionEn: 'Chevrolet Suburban High Country 2026 is the largest, most luxurious and powerful SUV in the Chevrolet lineup. Equipped with a 6.2L V8 engine, adaptive air suspension, and premium High Country cabin styling.',
    price: 1560000000,
    discount: 62000000,
    availability: 'IN_STOCK',
    year: 2026,
    engine: '6.2L V8',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    horsepower: 420,
    stockCount: 1,
    mainImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    images: [],
    videoUrl: '',
    brandId: 'brand-1',
    categoryId: 'cat-3',
    colorId: 'col-1'
  }
];

const defaultCreditPrograms = [
  { id: 'cred-1', bankName: 'Asaka Bank', interestRate: 18.5, minDownPayment: 10, termMonths: 60, maxAmount: 500000000, isPromo: false },
  { id: 'cred-2', bankName: 'Anorbank', interestRate: 16.0, minDownPayment: 20, termMonths: 36, maxAmount: 300000000, isPromo: true },
  { id: 'cred-3', bankName: 'SQB Bank', interestRate: 20.0, minDownPayment: 15, termMonths: 48, maxAmount: 400000000, isPromo: false },
  { id: 'cred-4', bankName: 'Davr Bank (Tezkor)', interestRate: 22.0, minDownPayment: 10, termMonths: 60, maxAmount: 250000000, isPromo: false }
];

const defaultNews = [
  {
    id: 'news-1',
    titleUz: 'Buxoro Avto Magnat shourumida yangilanish! Malibu 2 sotuvga chiqdi',
    titleRu: 'Обновление в шоуруме Buxoro Avto Magnat! В продажу поступила Malibu 2',
    titleEn: 'Updates at Buxoro Avto Magnat Showroom! Malibu 2 is now in stock',
    contentUz: 'Buxoro shahrida joylashgan premium shourumimizga yangi partiya Malibu 2 Turbo avtomobillari yetib keldi. Siz uni foizsiz muddatli to‘lov evaziga xarid qilishingiz mumkin. Shuningdek, trade-in xizmati orqali eski avtomobilingizni baholab topshirishingiz mumkin.',
    contentRu: 'В наш премиальный шоурум в Бухаре поступила новая партия Chevrolet Malibu 2 Turbo. Вы можете приобрести её по беспроцентной рассрочке. Также действует услуга трейд-ин для обмена вашего старого авто.',
    contentEn: 'A new batch of Malibu 2 Turbo cars has arrived at our premium showroom in Bukhara. You can purchase it under an interest-free installment plan. Trade-in valuation is also active for your old vehicle.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'news-2',
    titleUz: 'Chevrolet Tracker uchun maxsus imtiyozli kredit dasturi',
    titleRu: 'Специальная льготная кредитная программа для Chevrolet Tracker',
    titleEn: 'Special Low-Interest Credit Program for Chevrolet Tracker',
    contentUz: 'Asaka Bank va Buxoro Avto Magnat hamkorlikda yillik atigi 14% stavkali yangi kredit dasturini e‘lon qiladi. Boshlang‘ich to‘lov 15% dan boshlanadi, muddat esa 60 oygacha.',
    contentRu: 'Asaka Bank совместно с Buxoro Avto Magnat объявляет о запуске новой кредитной программы под 14% годовых. Первоначальный взнос – от 15%, срок – до 60 месяцев.',
    contentEn: 'Asaka Bank in partnership with Buxoro Avto Magnat announces a new credit campaign for Tracker at just 14% APR. Down payment starts from 15%, with terms up to 60 months.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultPromotions = [
  {
    id: 'promo-1',
    titleUz: 'Oltin Kuz: Chevrolet Tahoe uchun 3 yillik foizsiz muddatli to‘lov',
    titleRu: 'Золотая осень: 3 года беспроцентной рассрочки на Chevrolet Tahoe',
    titleEn: 'Golden Autumn: 3-Year Interest-Free Installments for Chevrolet Tahoe',
    descriptionUz: 'Boshlang‘ich to‘lov 50% bo‘lganda, qolgan qismini 36 oy davomida foizlarsiz to‘lang! Taklif 30-noyabrgacha amal qiladi.',
    descriptionRu: 'При первоначальном взносе 50%, оплачивайте оставшуюся часть в течение 36 месяцев без процентов! Предложение действует до 30 ноября.',
    descriptionEn: 'With a 50% down payment, pay the remaining balance over 36 months with zero interest! Offer active until November 30.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    discountValue: 37500000,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

const defaultSettings = [
  { id: 'set-1', key: 'phone', value: '+998 (65) 221-55-55' },
  { id: 'set-2', key: 'telegram', value: 'https://t.me/buxoro_avto_magnat_mock' },
  { id: 'set-3', key: 'whatsapp', value: 'https://wa.me/998652215555' },
  { id: 'set-4', key: 'addressUz', value: 'Buxoro sh., G‘ijduvon ko‘chasi, 45-uy' },
  { id: 'set-5', key: 'addressRu', value: 'г. Бухара, ул. Гиждуванская, д. 45' },
  { id: 'set-6', key: 'addressEn', value: '45 Gijduvon str., Bukhara city' }
];

const defaultUsers = [
  {
    id: 'user-admin',
    email: 'admin@magnat.uz',
    password: '$2b$10$3fEIyu6yOHex3t3zqaFI9Ox1ObXkXGQbsuLhtPh53idH9ZJ16yuj.', // bcrypt hash of 'admin123'
    name: 'Asilbek Olimov',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-customer',
    email: 'mijoz@gmail.com',
    password: '$2b$10$3fEIyu6yOHex3t3zqaFI9Ox1ObXkXGQbsuLhtPh53idH9ZJ16yuj.', // bcrypt hash of 'admin123'
    name: 'Farrux Rahimov',
    role: 'USER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper database loaders
export async function getCars() {
  if (isDbConnected) return await prisma!.car.findMany({ include: { brand: true, category: true, color: true } });
  const brands = readLocalJson('brands.json', defaultBrands);
  const categories = readLocalJson('categories.json', defaultCategories);
  const colors = readLocalJson('colors.json', defaultColors);
  const cars = readLocalJson('cars.json', defaultCars);
  
  return cars.map((car: any) => ({
    ...car,
    brand: brands.find((b: any) => b.id === car.brandId) || defaultBrands[0],
    category: categories.find((c: any) => c.id === car.categoryId) || defaultCategories[0],
    color: colors.find((col: any) => col.id === car.colorId) || defaultColors[0],
  }));
}

export async function getCarById(id: string) {
  if (isDbConnected) return await prisma!.car.findUnique({ where: { id }, include: { brand: true, category: true, color: true } });
  const cars = await getCars();
  return cars.find((c: any) => c.id === id) || null;
}

export async function saveCar(carData: any) {
  if (isDbConnected) {
    if (carData.id && carData.id.startsWith('car-') === false && carData.id.length > 10) {
      return await prisma!.car.update({ where: { id: carData.id }, data: carData });
    } else {
      const { id, ...createData } = carData;
      return await prisma!.car.create({ data: createData });
    }
  }
  const cars = readLocalJson('cars.json', defaultCars);
  if (carData.id) {
    const idx = cars.findIndex((c: any) => c.id === carData.id);
    if (idx !== -1) {
      cars[idx] = { ...cars[idx], ...carData, updatedAt: new Date().toISOString() };
      writeLocalJson('cars.json', cars);
      return cars[idx];
    }
  }
  const newCar = {
    ...carData,
    id: carData.id || `car-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  cars.push(newCar);
  writeLocalJson('cars.json', cars);
  return newCar;
}

export async function deleteCar(id: string) {
  if (isDbConnected) return await prisma!.car.delete({ where: { id } });
  const cars = readLocalJson('cars.json', defaultCars);
  const filtered = cars.filter((c: any) => c.id !== id);
  writeLocalJson('cars.json', filtered);
  return true;
}

// Categories, Brands, Colors
export async function getCategories() {
  if (isDbConnected) return await prisma!.category.findMany();
  return readLocalJson('categories.json', defaultCategories);
}

export async function saveCategory(catData: any) {
  if (isDbConnected) {
    if (catData.id) return await prisma!.category.update({ where: { id: catData.id }, data: catData });
    return await prisma!.category.create({ data: catData });
  }
  const items = readLocalJson('categories.json', defaultCategories);
  if (catData.id) {
    const idx = items.findIndex((i: any) => i.id === catData.id);
    if (idx !== -1) { items[idx] = { ...items[idx], ...catData }; writeLocalJson('categories.json', items); return items[idx]; }
  }
  const newCat = { ...catData, id: `cat-${Date.now()}` };
  items.push(newCat);
  writeLocalJson('categories.json', items);
  return newCat;
}

export async function getBrands() {
  if (isDbConnected) return await prisma!.brand.findMany();
  return readLocalJson('brands.json', defaultBrands);
}

export async function getColors() {
  if (isDbConnected) return await prisma!.color.findMany();
  return readLocalJson('colors.json', defaultColors);
}

export async function saveColor(colData: any) {
  if (isDbConnected) {
    if (colData.id) return await prisma!.color.update({ where: { id: colData.id }, data: colData });
    return await prisma!.color.create({ data: colData });
  }
  const items = readLocalJson('colors.json', defaultColors);
  if (colData.id) {
    const idx = items.findIndex((i: any) => i.id === colData.id);
    if (idx !== -1) { items[idx] = { ...items[idx], ...colData }; writeLocalJson('colors.json', items); return items[idx]; }
  }
  const newCol = { ...colData, id: `col-${Date.now()}` };
  items.push(newCol);
  writeLocalJson('colors.json', items);
  return newCol;
}

// Bookings / Test Drives
export async function getTestDrives() {
  if (isDbConnected) return await prisma!.testDriveRequest.findMany({ include: { car: true } });
  const bookings = readLocalJson('test_drives.json', []);
  const cars = await getCars();
  return bookings.map((b: any) => ({
    ...b,
    car: cars.find((c: any) => c.id === b.carId) || null
  }));
}

export async function saveTestDrive(booking: any) {
  if (isDbConnected) return await prisma!.testDriveRequest.create({ data: booking });
  const bookings = readLocalJson('test_drives.json', []);
  const newBooking = {
    ...booking,
    id: `td-${Date.now()}`,
    status: booking.status || 'PENDING',
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  writeLocalJson('test_drives.json', bookings);
  return newBooking;
}

export async function updateTestDriveStatus(id: string, status: string, notes?: string) {
  if (isDbConnected) return await prisma!.testDriveRequest.update({ where: { id }, data: { status: status as any, notes } });
  const bookings = readLocalJson('test_drives.json', []);
  const idx = bookings.findIndex((b: any) => b.id === id);
  if (idx !== -1) {
    bookings[idx] = { ...bookings[idx], status, notes };
    writeLocalJson('test_drives.json', bookings);
    return bookings[idx];
  }
  return null;
}

// Trade-Ins
export async function getTradeIns() {
  if (isDbConnected) return await prisma!.tradeInRequest.findMany();
  return readLocalJson('trade_ins.json', []);
}

export async function saveTradeIn(tradeIn: any) {
  if (isDbConnected) return await prisma!.tradeInRequest.create({ data: tradeIn });
  const tradeIns = readLocalJson('trade_ins.json', []);
  const newRequest = {
    ...tradeIn,
    id: `ti-${Date.now()}`,
    status: tradeIn.status || 'PENDING',
    createdAt: new Date().toISOString()
  };
  tradeIns.push(newRequest);
  writeLocalJson('trade_ins.json', tradeIns);
  return newRequest;
}

export async function updateTradeIn(id: string, status: string, estimatedPrice?: number, notes?: string) {
  if (isDbConnected) return await prisma!.tradeInRequest.update({ where: { id }, data: { status: status as any, estimatedPrice, notes } });
  const tradeIns = readLocalJson('trade_ins.json', []);
  const idx = tradeIns.findIndex((t: any) => t.id === id);
  if (idx !== -1) {
    tradeIns[idx] = { ...tradeIns[idx], status, estimatedPrice, notes };
    writeLocalJson('trade_ins.json', tradeIns);
    return tradeIns[idx];
  }
  return null;
}

// Credit Programs
export async function getCreditPrograms() {
  if (isDbConnected) return await prisma!.creditProgram.findMany();
  return readLocalJson('credit_programs.json', defaultCreditPrograms);
}

export async function saveCreditProgram(programData: any) {
  if (isDbConnected) {
    if (programData.id) return await prisma!.creditProgram.update({ where: { id: programData.id }, data: programData });
    return await prisma!.creditProgram.create({ data: programData });
  }
  const items = readLocalJson('credit_programs.json', defaultCreditPrograms);
  if (programData.id) {
    const idx = items.findIndex((i: any) => i.id === programData.id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...programData };
      writeLocalJson('credit_programs.json', items);
      return items[idx];
    }
  }
  const newProg = { ...programData, id: `cred-${Date.now()}` };
  items.push(newProg);
  writeLocalJson('credit_programs.json', items);
  return newProg;
}

export async function deleteCreditProgram(id: string) {
  if (isDbConnected) return await prisma!.creditProgram.delete({ where: { id } });
  const items = readLocalJson('credit_programs.json', defaultCreditPrograms);
  const filtered = items.filter((i: any) => i.id !== id);
  writeLocalJson('credit_programs.json', filtered);
  return true;
}

// News
export async function getNews() {
  if (isDbConnected) return await prisma!.news.findMany({ orderBy: { createdAt: 'desc' } });
  return readLocalJson('news.json', defaultNews);
}

export async function saveNews(newsData: any) {
  if (isDbConnected) {
    if (newsData.id) return await prisma!.news.update({ where: { id: newsData.id }, data: newsData });
    return await prisma!.news.create({ data: newsData });
  }
  const items = readLocalJson('news.json', defaultNews);
  if (newsData.id) {
    const idx = items.findIndex((i: any) => i.id === newsData.id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...newsData };
      writeLocalJson('news.json', items);
      return items[idx];
    }
  }
  const newNews = { ...newsData, id: `news-${Date.now()}`, createdAt: new Date().toISOString() };
  items.push(newNews);
  writeLocalJson('news.json', items);
  return newNews;
}

export async function deleteNews(id: string) {
  if (isDbConnected) return await prisma!.news.delete({ where: { id } });
  const items = readLocalJson('news.json', defaultNews);
  const filtered = items.filter((i: any) => i.id !== id);
  writeLocalJson('news.json', filtered);
  return true;
}

// Promotions
export async function getPromotions() {
  if (isDbConnected) return await prisma!.promotion.findMany({ orderBy: { createdAt: 'desc' } });
  return readLocalJson('promotions.json', defaultPromotions);
}

export async function savePromotion(promoData: any) {
  if (isDbConnected) {
    if (promoData.id) return await prisma!.promotion.update({ where: { id: promoData.id }, data: promoData });
    return await prisma!.promotion.create({ data: promoData });
  }
  const items = readLocalJson('promotions.json', defaultPromotions);
  if (promoData.id) {
    const idx = items.findIndex((i: any) => i.id === promoData.id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...promoData };
      writeLocalJson('promotions.json', items);
      return items[idx];
    }
  }
  const newPromo = { ...promoData, id: `promo-${Date.now()}`, createdAt: new Date().toISOString() };
  items.push(newPromo);
  writeLocalJson('promotions.json', items);
  return newPromo;
}

export async function deletePromotion(id: string) {
  if (isDbConnected) return await prisma!.promotion.delete({ where: { id } });
  const items = readLocalJson('promotions.json', defaultPromotions);
  const filtered = items.filter((i: any) => i.id !== id);
  writeLocalJson('promotions.json', filtered);
  return true;
}

// Settings
export async function getSettings() {
  if (isDbConnected) {
    const sets = await prisma!.setting.findMany();
    const result: Record<string, string> = {};
    sets.forEach(s => { result[s.key] = s.value; });
    return { ...result, ...defaultSettings.reduce((acc: any, s) => { acc[s.key] = acc[s.key] || s.value; return acc; }, {}) };
  }
  const sets = readLocalJson('settings.json', defaultSettings);
  const result: Record<string, string> = {};
  sets.forEach((s: any) => { result[s.key] = s.value; });
  return result;
}

export async function saveSetting(key: string, value: string) {
  if (isDbConnected) {
    return await prisma!.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
  const sets = readLocalJson('settings.json', defaultSettings);
  const idx = sets.findIndex((s: any) => s.key === key);
  if (idx !== -1) {
    sets[idx].value = value;
  } else {
    sets.push({ id: `set-${Date.now()}`, key, value });
  }
  writeLocalJson('settings.json', sets);
  return true;
}

// Users & Auth
export async function getUsers() {
  if (isDbConnected) {
    const list = await prisma!.user.findMany();
    if (list.length === 0) {
      const admin = await prisma!.user.create({
        data: {
          id: 'user-admin',
          email: 'admin@magnat.uz',
          password: '$2b$10$3fEIyu6yOHex3t3zqaFI9Ox1ObXkXGQbsuLhtPh53idH9ZJ16yuj.', // admin123
          name: 'Asilbek Olimov',
          role: 'ADMIN'
        }
      });
      return [admin];
    }
    return list;
  }
  return readLocalJson('users.json', defaultUsers);
}

export async function getUserByEmail(email: string) {
  if (isDbConnected) return await prisma!.user.findUnique({ where: { email } });
  const users = await getUsers();
  return users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserByIdentifier(identifier: string) {
  const users = await getUsers();
  const idLower = identifier.toLowerCase().trim();
  return users.find((u: any) => 
    u.email.toLowerCase() === idLower || 
    (u.phone && u.phone.replace(/[^0-9+]/g, '') === idLower.replace(/[^0-9+]/g, '')) ||
    (u.name && u.name.toLowerCase() === idLower)
  ) || null;
}

export async function saveUser(userData: any) {
  if (isDbConnected) return await prisma!.user.create({ data: userData });
  const users = readLocalJson('users.json', defaultUsers);
  const newUser = {
    ...userData,
    id: userData.id || `user-${Date.now()}`,
    role: userData.role || 'USER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  writeLocalJson('users.json', users);
  return newUser;
}

export async function updateUser(id: string, updateData: any) {
  if (isDbConnected) return await prisma!.user.update({ where: { id }, data: updateData });
  const users = await getUsers();
  const index = users.findIndex((u: any) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updateData, updatedAt: new Date().toISOString() };
    writeLocalJson('users.json', users);
    return users[index];
  }
  return null;
}

export async function deleteUser(id: string) {
  if (isDbConnected) return await prisma!.user.delete({ where: { id } });
  const users = await getUsers();
  const filtered = users.filter((u: any) => u.id !== id);
  writeLocalJson('users.json', filtered);
  return true;
}

const defaultBranches = [
  {
    id: 'branch-1',
    nameUz: 'Bosh Shourum (Buxoro)',
    nameRu: 'Главный Шоурум (Бухара)',
    nameEn: 'Main Showroom (Bukhara)',
    addressUz: 'Buxoro sh., G‘ijduvon ko‘chasi, 45-uy',
    addressRu: 'г. Бухара, ул. Гиждуванская, д. 45',
    addressEn: '45 Gijduvon St, Bukhara',
    phone: '+998 (65) 221-55-55',
    hoursUz: 'Dushanba - Shanba: 9:00 - 18:00',
    hoursRu: 'Понедельник - Суббота: 9:00 - 18:00',
    hoursEn: 'Monday - Saturday: 9:00 - 18:00',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.126581335967!2d64.4425145!3d39.7940166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f500fcf43ab3ed3%3A0xcaf21bdee3fe081c!2sOOO%20%22BUXARA%20AVTO%20MAGNAT%22!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
  },
  {
    id: 'branch-2',
    nameUz: 'G‘ijduvon filiali',
    nameRu: 'Гиждуванский филиал',
    nameEn: 'Gijduvon Branch',
    addressUz: 'Buxoro vil., G‘ijduvon sh., Yusuf Hamadoniy ko‘chasi, 12-uy',
    addressRu: 'Бухарская обл., г. Гиждуван, ул. Юсуфа Хамадония, д. 12',
    addressEn: '12 Yusuf Hamadoniy St, Gijduvon, Bukhara region',
    phone: '+998 (65) 572-11-22',
    hoursUz: 'Dushanba - Shanba: 9:00 - 18:00',
    hoursRu: 'Понедельник - Суббота: 9:00 - 18:00',
    hoursEn: 'Monday - Saturday: 9:00 - 18:00',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6092.361952044815!2d64.67389812635955!3d40.09848247940251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f5043bf0c0c3f5d%3A0x7d6f5f3e9c5f3e9c!2sGijduvon%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
  },
  {
    id: 'branch-3',
    nameUz: 'Kogon filiali',
    nameRu: 'Каганский филиал',
    nameEn: 'Kagan Branch',
    addressUz: 'Buxoro vil., Kogon sh., Buxoro yo‘li ko‘chasi, 89-uy',
    addressRu: 'Бухарская обл., г. Каган, ул. Бухарский путь, д. 89',
    addressEn: '89 Bukhara Rd, Kagan, Bukhara region',
    phone: '+998 (65) 522-88-99',
    hoursUz: 'Dushanba - Shanba: 9:00 - 18:00',
    hoursRu: 'Понедельник - Суббота: 9:00 - 18:00',
    hoursEn: 'Monday - Saturday: 9:00 - 18:00',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6139.11293290382!2d64.51239812631899!3d39.71239847940251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f500aef0c0c3f5d%3A0x7d6f5f3e9c5f3e9c!2sKagan%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
  }
];

export async function getBranches() {
  return readLocalJson('branches.json', defaultBranches);
}

export async function saveBranch(branchData: any) {
  const branches = readLocalJson('branches.json', defaultBranches);
  const newBranch = {
    ...branchData,
    id: branchData.id || `branch-${Date.now()}`
  };
  branches.push(newBranch);
  writeLocalJson('branches.json', branches);
  return newBranch;
}

export async function updateBranch(id: string, updateData: any) {
  const branches = readLocalJson('branches.json', defaultBranches);
  const index = branches.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    branches[index] = { ...branches[index], ...updateData };
    writeLocalJson('branches.json', branches);
    return branches[index];
  }
  return null;
}

export async function deleteBranch(id: string) {
  const branches = readLocalJson('branches.json', defaultBranches);
  const filtered = branches.filter((b: any) => b.id !== id);
  writeLocalJson('branches.json', filtered);
  return true;
}

export async function getCreditApplications() {
  const list = readLocalJson('credit_applications.json', []);
  const cars = await getCars();
  return list.map((a: any) => ({
    ...a,
    car: cars.find((c: any) => c.id === a.carId) || null
  }));
}

export async function saveCreditApplication(appData: any) {
  const list = readLocalJson('credit_applications.json', []);
  const newApp = {
    ...appData,
    id: `ca-${Date.now()}`,
    status: appData.status || 'PENDING',
    createdAt: new Date().toISOString()
  };
  list.push(newApp);
  writeLocalJson('credit_applications.json', list);
  return newApp;
}

export async function updateCreditApplicationStatus(id: string, status: string, notes?: string) {
  const list = readLocalJson('credit_applications.json', []);
  const idx = list.findIndex((a: any) => a.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], status, notes };
    writeLocalJson('credit_applications.json', list);
    return list[idx];
  }
  return null;
}
