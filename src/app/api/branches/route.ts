import { NextResponse } from 'next/server';
import { getBranches, saveBranch, updateBranch, deleteBranch } from '../../../lib/dbService';

export async function GET() {
  try {
    const branches = await getBranches();
    return NextResponse.json({ success: true, branches });
  } catch (error) {
    console.error('Branches GET error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newBranch = await saveBranch(data);
    return NextResponse.json({ success: true, branch: newBranch });
  } catch (error) {
    console.error('Branches POST error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 });
    }

    const updated = await updateBranch(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Filial topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, branch: updated });
  } catch (error) {
    console.error('Branches PUT error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 });
    }

    await deleteBranch(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Branches DELETE error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}
