import { NextResponse } from 'next/server';
import { getPromotions, savePromotion, deletePromotion } from '../../../lib/dbService';

export async function GET() {
  try {
    const promos = await getPromotions();
    return NextResponse.json(promos);
  } catch (error) {
    console.error('Promotions GET error:', error);
    return NextResponse.json({ error: 'Aksiyalarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await savePromotion(body);
    return NextResponse.json({ success: true, promotion: saved });
  } catch (error) {
    console.error('Promotions POST error:', error);
    return NextResponse.json({ error: 'Aksiyani saqlashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID kiritilmagan' }, { status: 400 });
    await deletePromotion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Promotions DELETE error:', error);
    return NextResponse.json({ error: 'O\'chirishda xatolik' }, { status: 500 });
  }
}
