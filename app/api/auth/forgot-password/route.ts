import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generatePasswordResetEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Generate reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Đặt lại mật khẩu - LUXE MOTORS',
      html: generatePasswordResetEmail(user.name, resetLink),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' 
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
