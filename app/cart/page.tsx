'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
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
    slug: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalAmount: number;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/cart');
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
        setCart(data.data);
      }
    } catch (error) {
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (carId: string, newQuantity: number) => {
    setUpdating(carId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        toast.success('Đã cập nhật giỏ hàng');
      }
    } catch (error) {
      toast.error('Không thể cập nhật');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (carId: string) => {
    setUpdating(carId);
    try {
      const res = await fetch(`/api/cart?carId=${carId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        toast.success('Đã xóa khỏi giỏ hàng');
      }
    } catch (error) {
      toast.error('Không thể xóa');
    } finally {
      setUpdating(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Giỏ hàng trống</h1>
          <p className="text-slate-600 mb-8">Bạn chưa thêm xe nào vào giỏ hàng</p>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Khám phá xe
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-900">Giỏ hàng của bạn</h1>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
            {cart.items.length} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.car._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6"
              >
                <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={item.car.images?.[0] || '/placeholder-car.jpg'}
                    alt={`${item.car.brand} ${item.car.model}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    href={`/cars/${item.car.slug}`}
                    className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                  >
                    {item.car.brand} {item.car.model} {item.car.year}
                  </Link>
                  <p className="text-emerald-600 font-bold text-xl mt-1">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.car._id, item.quantity - 1)}
                        disabled={updating === item.car._id || item.quantity <= 1}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.car._id, item.quantity + 1)}
                        disabled={updating === item.car._id}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.car._id)}
                      disabled={updating === item.car._id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">Thành tiền</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600">Miễn phí</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Tổng cộng</span>
                  <span className="text-emerald-600">{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>

              <Link
                href="/order"
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Tiến hành đặt hàng
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/cars"
                className="w-full flex items-center justify-center gap-2 py-3 mt-3 text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
