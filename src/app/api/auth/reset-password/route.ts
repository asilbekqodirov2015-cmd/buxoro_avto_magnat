import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByIdentifier, updateUser } from '../../../../lib/dbService';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Foydalanuvchi va yangi parol kiritilishi shart' }, { status: 400 });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return NextResponse.json({ error: 'Bunday elektron pochta, telefon yoki foydalanuvchi nomi topilmadi' }, { status: 404 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await updateUser(user.id, { password: hashedPassword });

    return NextResponse.json({
      success: true,
      message: 'Parol muvaffaqiyatli yangilandi'
    });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}
