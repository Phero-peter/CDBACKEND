import { NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const { name, email, phone, address, role, password } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Vui lòng nhập tên và email' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email, _id: { $ne: params.id } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 });
    }

    const updateData: any = {
      name,
      email,
      phone,
      address,
      role: role === 'admin' ? 'admin' : 'user',
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
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

export async function DELETE(_: Request, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    if (authResult.session.user?.id === params.id) {
      return NextResponse.json({ error: 'Không thể xóa tài khoản đang đăng nhập' }, { status: 400 });
    }

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(params.id);
    if (!deletedUser) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
