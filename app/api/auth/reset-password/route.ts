import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token và mật khẩu mới là bắt buộc' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    await connectDB();

    // Hash the token to compare
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 400 });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Đặt lại mật khẩu thành công' 
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
