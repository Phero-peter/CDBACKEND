import { NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const { name, email, password, phone, address, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role === 'admin' ? 'admin' : 'user',
    });

    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const validationError = handleValidationError(error);
    if (validationError) {
      return validationError;
    }
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}


