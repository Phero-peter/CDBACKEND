'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardCarsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/dashboard/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard/login');
    } else if (status === 'authenticated') {
      fetchCars();
    }
  }, [session, status, router]);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/admin/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCar = async (carId: string) => {
    try {
      const response = await fetch(`/api/admin/cars/${carId}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('Đã duyệt xe thành công');
        fetchCars();
      } else {
        toast.error('Không thể duyệt xe');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleRejectCar = async (carId: string) => {
    try {
      const response = await fetch(`/api/admin/cars/${carId}/reject`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('Đã từ chối xe');
        fetchCars();
      } else {
        toast.error('Không thể từ chối xe');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Bạn có chắc muốn xóa xe này?')) return;
    
    try {
      const response = await fetch(`/api/admin/cars/${carId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Đã xóa xe thành công');
        fetchCars();
      } else {
        toast.error('Không thể xóa xe');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quản lý sản phẩm</h1>
            <p className="text-slate-500 mt-1">Quản lý tất cả sản phẩm trong hệ thống</p>
          </div>
          <Link
            href="/dashboard/cars/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm sản phẩm mới</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo hãng, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'approved', 'pending', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-3 rounded-lg font-semibold cursor-pointer ${
                  filterStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {status === 'all' && 'Tất cả'}
                {status === 'approved' && 'Đã duyệt'}
                {status === 'pending' && 'Chờ duyệt'}
                {status === 'rejected' && 'Từ chối'}
              </button>
            ))}
          </div>
        </div>

        {/* Cars List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          {filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredCars.map((car) => (
                <div
                  key={car._id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Car Image */}
                    <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden bg-slate-100">
                      {car.images?.[0] ? (
                        <Image
                          src={car.images[0]}
                          alt={`${car.brand} ${car.model}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 192px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-300">Không có ảnh</span>
                        </div>
                      )}
                    </div>

                    {/* Car Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">
                            {car.brand} {car.model}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {car.year} • {car.mileage?.toLocaleString()} km
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatPrice(car.price)}
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                              car.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : car.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {car.status === 'approved' && '✓ Đã duyệt'}
                            {car.status === 'pending' && '⏳ Chờ duyệt'}
                            {car.status === 'rejected' && '✗ Từ chối'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link
                          href={`/cars/${car.slug || car._id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </Link>
                        <Link
                          href={`/dashboard/cars/edit/${car._id}`}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </Link>
                        {car.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveCar(car._id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleRejectCar(car._id)}
                              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
