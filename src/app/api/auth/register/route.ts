import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, saveUser } from '../../../../lib/dbService';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Barcha maydonlarni to\'ldirish majburiy' }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Ushbu elektron pochta allaqachon ro\'yxatdan o\'tgan' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await saveUser({
      name,
      email,
      password: hashedPassword,
      role: 'USER'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}
