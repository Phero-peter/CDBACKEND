'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, CreditCard, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CartItem {
  car: {
    _id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export default function OrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    note: '',
    paymentMethod: 'cash',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/order');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        if (!data.data.items || data.data.items.length === 0) {
          router.push('/cart');
          return;
        }
        setCart(data.data);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            province: formData.province,
            city: formData.city,
            note: formData.note,
          },
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      setOrderSuccess(data.data.orderNumber);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Đặt hàng thành công!</h1>
          <p className="text-slate-600 mb-2">Mã đơn hàng của bạn:</p>
          <p className="text-2xl font-bold text-emerald-600 mb-8">{orderSuccess}</p>
          <p className="text-slate-600 mb-8">
            Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/cars"
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/profile/orders"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại giỏ hàng
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-900">Đặt hàng</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-slate-900">Thông tin giao hàng</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0901234567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tỉnh/Thành phố *
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Hà Nội"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quận/Huyện *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Cầu Giấy"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ghi chú thêm về đơn hàng..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-slate-900">Phương thức thanh toán</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="w-5 h-5 text-emerald-600"
                    />
                    <div>
                      <p className="font-medium text-slate-900">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-slate-500">Thanh toán bằng tiền mặt khi nhận xe</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="w-5 h-5 text-emerald-600"
                    />
                    <div>
                      <p className="font-medium text-slate-900">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-slate-500">Chuyển khoản trước khi giao xe</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="w-5 h-5 text-emerald-600"
                    />
                    <div>
                      <p className="font-medium text-slate-900">Thẻ tín dụng/Ghi nợ</p>
                      <p className="text-sm text-slate-500">Visa, Mastercard, JCB</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Đơn hàng của bạn</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item.car._id} className="flex gap-3">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={item.car.images?.[0] || '/placeholder-car.jpg'}
                          alt={`${item.car.brand} ${item.car.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.car.brand} {item.car.model}
                        </p>
                        <p className="text-xs text-slate-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(cart?.totalAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-emerald-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-slate-900">
                    <span>Tổng cộng</span>
                    <span className="text-emerald-600">{formatPrice(cart?.totalAmount || 0)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
