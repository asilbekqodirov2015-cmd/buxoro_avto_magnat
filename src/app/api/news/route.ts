import { NextResponse } from 'next/server';
import { getNews, saveNews, deleteNews } from '../../../lib/dbService';

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error('News GET error:', error);
    return NextResponse.json({ error: 'Yangiliklarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveNews(body);
    return NextResponse.json({ success: true, news: saved });
  } catch (error) {
    console.error('News POST error:', error);
    return NextResponse.json({ error: 'Yangilikni saqlashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID kiritilmagan' }, { status: 400 });
    await deleteNews(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('News DELETE error:', error);
    return NextResponse.json({ error: 'O\'chirishda xatolik' }, { status: 500 });
  }
}
