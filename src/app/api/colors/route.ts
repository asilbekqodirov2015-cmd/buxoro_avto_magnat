import { NextResponse } from 'next/server';
import { getColors, saveColor } from '../../../lib/dbService';

export async function GET() {
  try {
    const colors = await getColors();
    return NextResponse.json(colors);
  } catch (error) {
    console.error('Colors GET error:', error);
    return NextResponse.json({ error: 'Ranglarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveColor(body);
    return NextResponse.json({ success: true, color: saved });
  } catch (error) {
    console.error('Colors POST error:', error);
    return NextResponse.json({ error: 'Rangni saqlashda xatolik' }, { status: 500 });
  }
}
