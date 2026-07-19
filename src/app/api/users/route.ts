import { NextResponse } from 'next/server';
import { getUsers, updateUser, deleteUser } from '../../../lib/dbService';

export async function GET() {
  try {
    const users = await getUsers();
    const sanitized = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone || '',
      role: u.role,
      permissions: u.permissions || [],
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));
    return NextResponse.json({ success: true, users: sanitized });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, role, permissions } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 });
    }

    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;

    const updated = await updateUser(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Users PUT error:', error);
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

    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Users DELETE error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}
