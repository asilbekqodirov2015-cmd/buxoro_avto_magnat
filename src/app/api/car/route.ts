import { NextResponse } from 'next/server';
import { getCarById } from '../../../lib/dbService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilmagan' }, { status: 400 });
    }
    const car = await getCarById(id);
    if (!car) {
      return NextResponse.json({ error: 'Avtomobil topilmadi' }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    console.error('Single car GET error:', error);
    return NextResponse.json({ error: 'Avtomobil yuklashda xatolik' }, { status: 500 });
  }
}
