import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Đăng bán xe - BiMax Auto Motors',
  description: 'Đăng bán xe nhanh chóng và dễ dàng cùng BiMax Auto Motors',
};

export default async function SellPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'admin') {
    redirect('/admin/cars/new');
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Đăng bán xe cùng BiMax</h1>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            BiMax Auto Motors hỗ trợ đăng bán xe với quy trình kiểm duyệt minh bạch. 
            Vui lòng đăng nhập và liên hệ với chúng tôi để được hỗ trợ đăng xe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/admin/login"
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition"
              >
                Yêu cầu hỗ trợ đăng xe
              </Link>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/sell"
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition"
              >
                Đăng nhập để đăng xe
              </Link>
            )}
            <a
              href="tel:0900000000"
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Gọi tư vấn: 0900 000 000
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">1. Gửi thông tin</h3>
              <p className="text-sm text-slate-600">Cung cấp thông tin xe và hình ảnh cơ bản.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">2. Kiểm duyệt</h3>
              <p className="text-sm text-slate-600">BiMax xác minh và duyệt nội dung đăng bán.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">3. Đăng bán</h3>
              <p className="text-sm text-slate-600">Xe hiển thị trên website sau khi duyệt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
