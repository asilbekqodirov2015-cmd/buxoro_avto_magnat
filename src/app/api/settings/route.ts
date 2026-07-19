import { NextResponse } from 'next/server';
import { getSettings, saveSetting } from '../../../lib/dbService';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Sozlamalarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Expect key-value object
    // Save each key-value pair
    for (const [key, value] of Object.entries(body)) {
      await saveSetting(key, value as string);
    }
    const updated = await getSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Sozlamalarni saqlashda xatolik' }, { status: 500 });
  }
}
