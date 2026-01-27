'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, Heart, LogIn } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CarActionsProps {
  car: {
    _id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    slug: string;
  };
}

export default function CarActions({ car }: CarActionsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    if (status === 'unauthenticated') {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      router.push(`/auth/signin?callbackUrl=/cars/${car.slug}`);
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car._id, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể thêm vào giỏ hàng');
      }

      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (status === 'unauthenticated') {
      toast.error('Vui lòng đăng nhập để mua xe');
      router.push(`/auth/signin?callbackUrl=/cars/${car.slug}`);
      return;
    }

    // Thêm vào giỏ hàng trước, sau đó chuyển đến trang đặt hàng
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car._id, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể thêm vào giỏ hàng');
      }

      // Chuyển đến trang đặt hàng
      router.push('/order');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleFavorite = () => {
    if (status === 'unauthenticated') {
      toast.error('Vui lòng đăng nhập để lưu xe yêu thích');
      router.push(`/auth/signin?callbackUrl=/cars/${car.slug}`);
      return;
    }
    // TODO: Implement favorite functionality
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
      <div className="mb-6">
        <p className="text-slate-500 text-sm mb-1">Giá bán</p>
        <p className="text-emerald-600 text-3xl font-bold">{formatPrice(car.price)}</p>
      </div>

      <div className="space-y-3">
        {/* Mua ngay */}
        <button
          onClick={handleBuyNow}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <CreditCard className="w-5 h-5" />
          Mua ngay
        </button>

        {/* Thêm vào giỏ hàng */}
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-emerald-600 text-emerald-600 py-3 rounded-xl hover:bg-emerald-50 transition-all font-semibold disabled:opacity-50"
        >
          <ShoppingCart className="w-5 h-5" />
          {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
        </button>

        {/* Yêu thích */}
        <button
          onClick={handleToggleFavorite}
          className={`w-full flex items-center justify-center gap-2 border-2 py-3 rounded-xl transition-all font-semibold ${
            isFavorite
              ? 'bg-red-50 border-red-500 text-red-600'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
          {isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
        </button>
      </div>

      {/* Thông tin bổ sung */}
      <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Bảo hành</span>
          <span className="font-medium text-slate-900">Có</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Vận chuyển</span>
          <span className="font-medium text-emerald-600">Miễn phí</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Thanh toán</span>
          <span className="font-medium text-slate-900">Linh hoạt</span>
        </div>
      </div>
    </div>
  );
}
