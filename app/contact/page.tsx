'use client';

import { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            BiMax Auto Motors xây dựng những chiếc xe chất lượng cho những người khám phá hiện đại. 
            Được thúc đẩy bởi sự đổi mới và tự do, chúng tôi đang định nghĩa lại tương lai của trải nghiệm xe hơi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <a href="mailto:contact@bimax.com" className="text-slate-500 hover:text-slate-900 transition">
                      contact@bimax.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Điện thoại</h3>
                    <a href="tel:+84123456789" className="text-slate-500 hover:text-slate-900 transition">
                      +84 123 456 789
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Địa chỉ</h3>
                    <p className="text-slate-500">
                      123 Đường ABC, Quận XYZ<br />
                      Thành phố Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Newsletter</h2>
              <p className="text-slate-500 text-sm mb-4">
                Đăng ký để nhận thông tin mới nhất về sản phẩm và ưu đãi đặc biệt.
              </p>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem('newsletter-email') as HTMLInputElement).value;
                  if (!email) return;
                  
                  try {
                    const response = await fetch('/api/contact/newsletter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email }),
                    });
                    if (response.ok) {
                      toast.success('Đăng ký thành công!');
                      (e.currentTarget.elements.namedItem('newsletter-email') as HTMLInputElement).value = '';
                    }
                  } catch (error) {
                    toast.error('Có lỗi xảy ra');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  name="newsletter-email"
                  placeholder="name@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2 font-medium"
                >
                  Đăng ký
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition"
                    placeholder="+84 123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-900 mb-2">
                    Chủ đề *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition"
                    placeholder="Chủ đề liên hệ"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                  Tin nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition resize-none"
                  placeholder="Nhập tin nhắn của bạn..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi tin nhắn
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
