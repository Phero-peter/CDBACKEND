'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Camera, Save, Package, Heart, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    image: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [status, session, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' || tab === 'favorites' || tab === 'profile') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success) {
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          image: data.data.image || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/order');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      toast.success('Cập nhật thành công!');
      update(); // Refresh session
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt={formData.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {formData.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
                <p className="text-slate-500 text-sm">{formData.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Đơn hàng của tôi
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Xe yêu thích
                </button>
                <hr className="my-4" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <Settings className="w-6 h-6 text-emerald-600" />
                  <h1 className="text-2xl font-bold text-slate-900">Thông tin cá nhân</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0901234567"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ảnh đại diện (URL)
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Địa chỉ
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <h1 className="text-2xl font-bold text-slate-900">Đơn hàng của tôi</h1>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có đơn hàng</h3>
                    <p className="text-slate-500 mb-6">Bạn chưa đặt đơn hàng nào</p>
                    <Link
                      href="/cars"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Khám phá xe ngay
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Mã đơn hàng</p>
                              <p className="font-bold text-slate-900">{order.orderNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Ngày đặt</p>
                            <p className="font-medium text-slate-700">
                              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                              {/* Car Image */}
                              <div className="relative w-24 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                {item.carSnapshot?.image ? (
                                  <Image
                                    src={item.carSnapshot.image}
                                    alt={`${item.carSnapshot?.brand} ${item.carSnapshot?.model}`}
                                    fill
                                    className="object-contain"
                                    sizes="96px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Package className="w-8 h-8" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Car Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900">
                                  {item.carSnapshot?.brand} {item.carSnapshot?.model}
                                </h4>
                                <p className="text-sm text-slate-500">
                                  Năm sản xuất: {item.carSnapshot?.year || 'N/A'}
                                </p>
                                <p className="text-sm text-slate-500">
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <p className="font-bold text-emerald-600">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Địa chỉ giao hàng
                            </p>
                            <p className="text-sm text-blue-600">
                              {order.shippingAddress.fullName} - {order.shippingAddress.phone}
                            </p>
                            <p className="text-sm text-blue-600">
                              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province}
                            </p>
                          </div>
                        )}

                        {/* Order Summary */}
                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500">Phương thức thanh toán</p>
                            <p className="font-medium text-slate-900">
                              {order.paymentMethod === 'cash' && 'Tiền mặt'}
                              {order.paymentMethod === 'bank_transfer' && 'Chuyển khoản'}
                              {order.paymentMethod === 'credit_card' && 'Thẻ tín dụng'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Tổng tiền</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                            </p>
                          </div>
                        </div>

                        {/* Order Notes */}
                        {order.notes && (
                          <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                            <p className="text-sm font-medium text-amber-700 mb-1">Ghi chú:</p>
                            <p className="text-sm text-amber-600">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Danh sách yêu thích</h3>
                <p className="text-slate-500 mb-6">Tính năng đang được phát triển</p>
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Khám phá xe ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
