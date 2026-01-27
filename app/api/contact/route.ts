import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Send email notification
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@bimax.com',
        subject: `[BiMax Contact] ${subject}`,
        html: `
          <h2>Thông tin liên hệ mới</h2>
          <p><strong>Họ và tên:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Số điện thoại:</strong> ${phone}</p>` : ''}
          <p><strong>Chủ đề:</strong> ${subject}</p>
          <p><strong>Tin nhắn:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      // Optionally save to database
      // You can create a Contact model if needed
      
      return NextResponse.json(
        { message: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Still return success even if email fails
      return NextResponse.json(
        { message: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
