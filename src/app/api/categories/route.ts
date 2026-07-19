import { NextResponse } from 'next/server';
import { getCategories, saveCategory } from '../../../lib/dbService';

export async function GET() {
  try {
    const cats = await getCategories();
    return NextResponse.json(cats);
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json({ error: 'Toifalarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveCategory(body);
    return NextResponse.json({ success: true, category: saved });
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json({ error: 'Toifani saqlashda xatolik' }, { status: 500 });
  }
}
