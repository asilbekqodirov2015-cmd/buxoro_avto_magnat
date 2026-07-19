import { NextResponse } from 'next/server';
import { getCreditPrograms, saveCreditProgram, deleteCreditProgram } from '../../../lib/dbService';

export async function GET() {
  try {
    const progs = await getCreditPrograms();
    return NextResponse.json(progs);
  } catch (error) {
    console.error('Credit programs GET error:', error);
    return NextResponse.json({ error: 'Kredit dasturlarini yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveCreditProgram(body);
    return NextResponse.json({ success: true, program: saved });
  } catch (error) {
    console.error('Credit programs POST error:', error);
    return NextResponse.json({ error: 'Kredit dasturini saqlashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilmagan' }, { status: 400 });
    }
    await deleteCreditProgram(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Credit programs DELETE error:', error);
    return NextResponse.json({ error: 'O\'chirishda xatolik' }, { status: 500 });
  }
}
