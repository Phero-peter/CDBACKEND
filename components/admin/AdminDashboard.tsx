'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  X,
  Eye,
  Trash2,
  Search,
  TrendingUp,
  Car,
  Users,
  Clock,
  BarChart3,
  Activity,
  RefreshCw,
  AlertCircle,
  Shield,
  UserPlus,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'users' | 'activities'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [chartData, setChartData] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    password: '',
  });
  const [userActionLoading, setUserActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats for overview
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (activeTab === 'cars') {
        const response = await fetch('/api/admin/cars');
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        }
      } else if (activeTab === 'users') {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
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
        fetchData();
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
        fetchData();
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
        fetchData();
      } else {
        toast.error('Không thể xóa xe');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'user',
      password: '',
    });
    setIsUserModalOpen(true);
  };

  const openEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      password: '',
    });
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email) {
      toast.error('Vui lòng nhập tên và email');
      return;
    }

    if (!editingUser && !userForm.password) {
      toast.error('Vui lòng nhập mật khẩu cho khách hàng');
      return;
    }

    setUserActionLoading(true);
    try {
      const payload: any = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        address: userForm.address,
        role: userForm.role,
      };

      if (userForm.password) {
        payload.password = userForm.password;
      }

      const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Có lỗi xảy ra');
      }

      toast.success(editingUser ? 'Cập nhật khách hàng thành công' : 'Tạo khách hàng thành công');
      closeUserModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Đã xóa khách hàng');
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Không thể xóa khách hàng');
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

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bảng Điều Khiển Admin</h2>
            <p className="text-blue-100">Quản lý và theo dõi hệ thống</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchData()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Làm mới</span>
            </button>
            <Link
              href="/admin/cars/new"
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Car className="w-4 h-4" />
              <span>Thêm xe mới</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview - Always visible */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Car className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalCars || 0}</div>
            <div className="text-blue-100 text-sm">Tổng số xe</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <AlertCircle className="w-5 h-5 text-yellow-200" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.pendingCars || 0}</div>
            <div className="text-yellow-100 text-sm">Xe chờ duyệt</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Check className="w-6 h-6" />
              </div>
              <BarChart3 className="w-5 h-5 text-green-200" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.approvedCars || 0}</div>
            <div className="text-green-100 text-sm">Xe đã duyệt</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 text-purple-200" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalUsers || 0}</div>
            <div className="text-purple-100 text-sm">Người dùng</div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-1 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              } whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 rounded-t-lg`}
            >
              <BarChart3 className="w-4 h-4" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={`${
                activeTab === 'cars'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              } whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 rounded-t-lg`}
            >
              <Car className="w-4 h-4" />
              Quản lý xe
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              } whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 rounded-t-lg`}
            >
              <Users className="w-4 h-4" />
              Người dùng
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              } whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 rounded-t-lg`}
            >
              <Activity className="w-4 h-4" />
              Hoạt động
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-500 mb-4"></div>
              <p className="text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Thống kê nhanh
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500">Tỷ lệ duyệt</span>
                          <span className="text-emerald-600 font-bold">
                            {stats?.totalCars > 0 
                              ? Math.round((stats.approvedCars / stats.totalCars) * 100) 
                              : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500">Xe chờ xử lý</span>
                          <span className="text-amber-600 font-bold">{stats?.pendingCars || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500">Người dùng mới (tháng này)</span>
                          <span className="text-indigo-600 font-bold">-</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Actions */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Hành động nhanh
                      </h3>
                      <div className="space-y-3">
                        <Link
                          href="/admin/cars"
                          className="block p-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-blue-700 font-semibold">Xem tất cả xe</span>
                            <Car className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                        <button
                          onClick={() => setActiveTab('cars')}
                          className="w-full p-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-lg transition-all group text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-amber-700 font-semibold">Duyệt xe chờ</span>
                            <Clock className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab('users')}
                          className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all group text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-indigo-700 font-semibold">Quản lý khách hàng</span>
                            <Users className="w-4 h-4 text-indigo-700 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === 'cars' && (
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm xe theo hãng, model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div className="flex gap-2">
                      {['all', 'approved', 'pending', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status as any)}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                            filterStatus === status
                              ? 'bg-blue-600 text-white'
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
                  <div className="space-y-4">
                    {filteredCars.length === 0 ? (
                      <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                        <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">Không tìm thấy xe nào</p>
                      </div>
                    ) : (
                      filteredCars.map((car) => (
                        <div
                          key={car._id}
                          className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all hover:scale-[1.01]"
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
                                  <Car className="w-12 h-12 text-slate-300" />
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
                                  <div className="text-2xl font-bold text-blue-600">
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
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                  Xem chi tiết
                                </Link>
                                {car.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveCar(car._id)}
                                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all"
                                    >
                                      <Check className="w-4 h-4" />
                                      Duyệt
                                    </button>
                                    <button
                                      onClick={() => handleRejectCar(car._id)}
                                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                      Từ chối
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteCar(car._id)}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all ml-auto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Search + Create */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <button
                      onClick={openCreateUser}
                      className="w-full sm:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition shadow-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      Thêm khách hàng
                    </button>
                  </div>

                  {/* Users List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUsers.length === 0 ? (
                      <div className="col-span-2 text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">Không tìm thấy khách hàng</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                                <p className="text-sm text-slate-500">{user.email}</p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                user.role === 'admin'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {user.role === 'admin' && <Shield className="w-3 h-3" />}
                              {user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </div>
                          <div className="pt-4 border-t border-slate-200 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Ngày tham gia</span>
                              <span className="text-slate-900 font-semibold">
                                {user.createdAt 
                                  ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                                  : '-'
                                }
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Số điện thoại</span>
                              <span className="text-slate-900 font-semibold">
                                {user.phone || '-'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Địa chỉ</span>
                              <span className="text-slate-900 font-semibold text-right max-w-[60%]">
                                {user.address || '-'}
                              </span>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                              <button
                                onClick={() => openEditUser(user)}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-2 transition"
                              >
                                <Pencil className="w-4 h-4" />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                disabled={session?.user?.id === user._id}
                                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition ${
                                  session?.user?.id === user._id
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <div className="space-y-4">
                  <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-2">Tính năng đang phát triển</p>
                    <p className="text-slate-500 text-sm">
                      Lịch sử hoạt động sẽ được cập nhật trong phiên bản tiếp theo
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingUser ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
                </h3>
                <p className="text-slate-500 text-sm">
                  Quản lý thông tin và quyền truy cập của khách hàng
                </p>
              </div>
              <button
                onClick={closeUserModal}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Họ tên</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Số điện thoại</label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Vai trò</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={userForm.address}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  {editingUser ? 'Đổi mật khẩu (tuỳ chọn)' : 'Mật khẩu'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={closeUserModal}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveUser}
                disabled={userActionLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
              >
                {userActionLoading ? 'Đang lưu...' : editingUser ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


