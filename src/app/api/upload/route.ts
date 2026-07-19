import { NextResponse } from 'next/server';
  import { writeFile, mkdir } from 'fs/promises';
  import { join } from 'path';

  export async function POST(request: Request) {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create public/uploads directory if not exists
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Directory may already exist
      }

      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);

      return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Faylni yuklashda xatolik' }, { status: 500 });
    }
  }
