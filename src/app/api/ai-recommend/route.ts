import { NextResponse } from 'next/server';
import { getCars } from '../../../lib/dbService';

export async function POST(request: Request) {
  try {
    const { budget, purpose, fuelPreference, lang } = await request.json();
    const cars = await getCars();
    
    // Select candidates below or near budget
    const targetBudget = parseFloat(budget) || 100000;
    
    // Sort cars matching purpose
    // Sedan = city, SUV = family, Tahoe/Malibu = luxury/premium
    let recommendationId = '';
    let explanationUz = '';
    let explanationRu = '';
    let explanationEn = '';
    
    if (purpose === 'family') {
      // Recommend Captiva or Tahoe or Traverse
      const familyCars = cars.filter((c: any) => c.categoryId === 'cat-2'); // SUV
      const affordable = familyCars.filter((c: any) => c.price <= targetBudget);
      const recommended = affordable.length > 0 ? affordable[0] : cars.find((c: any) => c.id === 'car-captiva');
      recommendationId = recommended?.id || 'car-captiva';
      
      explanationUz = "Oila a'zolaringiz va sayohatlar uchun keng salon, 7 o'rinli qulaylik hamda yuqori xavfsizlikka ega oilaviy krossoverimiz eng ma'qul tanlovdir.";
      explanationRu = "Для вашей семьи и поездок этот вместительный 7-местный кроссовер с высоким уровнем безопасности станет идеальным выбором.";
      explanationEn = "For your family and travel needs, this spacious 7-seater crossover with high safety standards and comfort is the optimal choice.";
    } else if (purpose === 'luxury') {
      // Recommend Malibu or Tahoe
      const luxuryCars = cars.filter((c: any) => c.price >= 30000);
      const affordable = luxuryCars.filter((c: any) => c.price <= targetBudget);
      const recommended = affordable.length > 0 ? affordable[0] : cars.find((c: any) => c.id === 'car-tahoe');
      recommendationId = recommended?.id || 'car-tahoe';
      
      explanationUz = "Sizning yuqori didingiz va premium qulaylikka bo'lgan intilishingizga ushbu yetakchi model to'liq mos keladi. Kuchli dvigatel va hashamatli salon.";
      explanationRu = "Этому представительскому классу полностью соответствуют ваши высокие стандарты комфорта и престижа. Мощный мотор и роскошный интерьер.";
      explanationEn = "This premium model perfectly matches your high standards of luxury, status, and comfort. Features a powerful drivetrain and executive interior.";
    } else {
      // Default: city / economy
      // Recommend Onix or Cobalt
      const cityCars = cars.filter((c: any) => c.price <= 20000);
      const recommended = cityCars.length > 0 ? cityCars[0] : cars.find((c: any) => c.id === 'car-onix');
      recommendationId = recommended?.id || 'car-onix';
      
      explanationUz = "Kundalik shahar safarlari uchun tejamkor turbomotor, ixcham dizayn va arzon texnik xizmat ko'rsatishga ega ushbu model eng maqbul tanlovdir.";
      explanationRu = "Экономичный турбомотор, компактные размеры и дешевое обслуживание делают эту модель лучшим выбором для ежедневных поездок по городу.";
      explanationEn = "For daily city commutes, this model offers a fuel-efficient turbo engine, compact dimensions, and affordable maintenance, making it the smartest pick.";
    }

    const recommendedCar = cars.find((c: any) => c.id === recommendationId) || cars[0];

    const explanation = lang === 'ru' ? explanationRu : lang === 'en' ? explanationEn : explanationUz;

    return NextResponse.json({
      success: true,
      car: recommendedCar,
      explanation
    });
  } catch (error) {
    console.error('AI Recommend API error:', error);
    return NextResponse.json({ error: 'Tavsiya olishda xatolik' }, { status: 500 });
  }
}
