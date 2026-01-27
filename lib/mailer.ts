import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, text } = options;

  const mailOptions = {
    from: `"LUXE MOTORS" <${process.env.SMTP_USER || 'noreply@luxemotors.com'}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

export function generatePasswordResetEmail(name: string, resetLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LUXE MOTORS</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${name},</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Đặt lại mật khẩu</a>
          </p>
          <p>Link này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          <p>© 2024 LUXE MOTORS. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateOrderConfirmationEmail(name: string, orderNumber: string, totalAmount: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LUXE MOTORS</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${name},</h2>
          <p>Cảm ơn bạn đã đặt hàng tại LUXE MOTORS!</p>
          <div class="order-info">
            <p><strong>Mã đơn hàng:</strong> ${orderNumber}</p>
            <p><strong>Tổng tiền:</strong> ${totalAmount}</p>
          </div>
          <p>Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.</p>
        </div>
        <div class="footer">
          <p>© 2024 LUXE MOTORS. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
