import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
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

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'Đăng ký Newsletter thành công - BiMax Auto Motors',
        html: `
          <h2>Cảm ơn bạn đã đăng ký!</h2>
          <p>Bạn đã đăng ký nhận thông tin mới nhất từ BiMax Auto Motors.</p>
          <p>Chúng tôi sẽ gửi cho bạn những thông tin về sản phẩm mới, ưu đãi đặc biệt và tin tức mới nhất.</p>
          <p>Trân trọng,<br>Đội ngũ BiMax Auto Motors</p>
        `,
      });

      // Optionally save to database
      // You can create a Newsletter model if needed
      
      return NextResponse.json(
        { message: 'Đăng ký newsletter thành công!' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { message: 'Đăng ký newsletter thành công!' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
