import { NextResponse } from 'next/server';
import { getCars, saveCar, deleteCar } from '../../../lib/dbService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cars = await getCars();
    
    // Simple filter execution
    let filteredCars = [...cars];
    
    const search = searchParams.get('search');
    if (search) {
      const q = search.toLowerCase();
      filteredCars = filteredCars.filter(car => 
        car.name.toLowerCase().includes(q) || 
        car.vin.toLowerCase().includes(q) ||
        car.engine.toLowerCase().includes(q)
      );
    }
    
    const category = searchParams.get('category');
    if (category && category !== 'all') {
      filteredCars = filteredCars.filter(car => car.categoryId === category);
    }
    
    const transmission = searchParams.get('transmission');
    if (transmission && transmission !== 'all') {
      filteredCars = filteredCars.filter(car => car.transmission === transmission);
    }

    const fuelType = searchParams.get('fuelType');
    if (fuelType && fuelType !== 'all') {
      filteredCars = filteredCars.filter(car => car.fuelType === fuelType);
    }

    const minPrice = searchParams.get('minPrice');
    if (minPrice) {
      filteredCars = filteredCars.filter(car => car.price >= parseFloat(minPrice));
    }

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      filteredCars = filteredCars.filter(car => car.price <= parseFloat(maxPrice));
    }
    
    const sort = searchParams.get('sort');
    if (sort) {
      if (sort === 'priceAsc') {
        filteredCars.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceDesc') {
        filteredCars.sort((a, b) => b.price - a.price);
      } else if (sort === 'yearDesc') {
        filteredCars.sort((a, b) => b.year - a.year);
      }
    }
    
    return NextResponse.json(filteredCars);
  } catch (error) {
    console.error('Cars GET error:', error);
    return NextResponse.json({ error: 'Avtomobillarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In real app, check for ADMIN role in request headers/session.
    const saved = await saveCar(body);
    return NextResponse.json({ success: true, car: saved });
  } catch (error) {
    console.error('Cars POST error:', error);
    return NextResponse.json({ error: 'Avtomobilni saqlashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilmagan' }, { status: 400 });
    }
    await deleteCar(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cars DELETE error:', error);
    return NextResponse.json({ error: 'O\'chirishda xatolik yuz berdi' }, { status: 500 });
  }
}
