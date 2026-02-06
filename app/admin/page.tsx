'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SessionManager } from '@/lib/session-manager';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users, 
  Car, 
  Package,
  BarChart3,
  X,
  Save,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cars' | 'users' | 'orders' | 'diagram'>('cars');
  const [cars, setCars] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'>('all');
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderCountData, setOrderCountData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    // Kiểm tra session từ localStorage nếu NextAuth session không phải admin
    const adminSession = SessionManager.getSession('admin');
    
    if (status === 'unauthenticated') {
      // Nếu không có NextAuth session, kiểm tra localStorage
      if (adminSession) {
        // Có session admin trong localStorage, tiếp tục
        fetchData();
      } else {
        router.push('/admin/login');
      }
    } else if (status === 'authenticated') {
      // Nếu NextAuth session là admin, tiếp tục
      if (session?.user?.role === 'admin') {
        // Lưu lại session vào localStorage
        SessionManager.setSession('admin', {
          userId: session.user.id || '',
          email: session.user.email || '',
          name: session.user.name || '',
          role: 'admin',
          timestamp: Date.now(),
        });
        fetchData();
      } else {
        // NextAuth session không phải admin, kiểm tra localStorage
        if (adminSession) {
          // Có session admin trong localStorage, tiếp tục
          fetchData();
        } else {
          router.push('/admin/login');
        }
      }
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [carsRes, usersRes, statsRes, ordersRes] = await Promise.allSettled([
        fetch('/api/admin/cars'),
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders?limit=1000')
      ]);
      
      // Fetch cars
      if (carsRes.status === 'fulfilled' && carsRes.value.ok) {
        try {
          const carsData = await carsRes.value.json();
          setCars(Array.isArray(carsData) ? carsData : []);
        } catch (err) {
          console.error('Error parsing cars data:', err);
          setCars([]);
        }
      } else {
        console.error('Failed to fetch cars:', carsRes);
        setCars([]);
      }
      
      // Fetch users
      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        try {
          const usersData = await usersRes.value.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (err) {
          console.error('Error parsing users data:', err);
          setUsers([]);
        }
      } else {
        console.error('Failed to fetch users:', usersRes);
        setUsers([]);
      }

      // Fetch stats
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        try {
          const statsData = await statsRes.value.json();
          setStats(statsData);
        } catch (err) {
          console.error('Error parsing stats data:', err);
          setStats(null);
        }
      } else {
        console.error('Failed to fetch stats:', statsRes);
        setStats(null);
      }

      // Fetch orders
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        try {
          const ordersData = await ordersRes.value.json();
          const orders = ordersData.data || ordersData.items || [];
          setOrders(Array.isArray(orders) ? orders : []);
          
          // Tính doanh thu theo tháng (6 tháng gần nhất)
          const monthlyRevenue: any = {};
          const monthlyOrderCount: any = {};
          const now = new Date();
          
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenue[monthKey] = 0;
            monthlyOrderCount[monthKey] = 0;
          }

          if (Array.isArray(orders)) {
            orders.forEach((order: any) => {
              if (!order || !order.createdAt) return;
              
              try {
                const orderDate = new Date(order.createdAt);
                const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
                
                // Tính doanh thu
                if (order.paymentStatus === 'paid' && order.totalAmount) {
                  if (monthlyRevenue.hasOwnProperty(monthKey)) {
                    monthlyRevenue[monthKey] += Number(order.totalAmount) || 0;
                  }
                }
                
                // Tính số lượng đơn hàng
                if (monthlyOrderCount.hasOwnProperty(monthKey)) {
                  monthlyOrderCount[monthKey] += 1;
                }
              } catch (err) {
                console.error('Error processing order:', err, order);
              }
            });
          }

          const revenueArray = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
            month,
            revenue: revenue as number
          }));

          const orderCountArray = Object.entries(monthlyOrderCount).map(([month, count]) => ({
            month,
            count: count as number
          }));

          setRevenueData(revenueArray);
          setOrderCountData(orderCountArray);
        } catch (err) {
          console.error('Error processing orders data:', err);
          setOrders([]);
          setRevenueData([]);
          setOrderCountData([]);
        }
      } else {
        console.error('Failed to fetch orders:', ordersRes);
        setOrders([]);
        setRevenueData([]);
        setOrderCountData([]);
      }
      
      // Kiểm tra nếu có lỗi nghiêm trọng
      const hasErrors = [
        carsRes.status === 'rejected',
        usersRes.status === 'rejected',
        statsRes.status === 'rejected',
        ordersRes.status === 'rejected'
      ].some(Boolean);
      
      if (hasErrors) {
        toast.error('Một số dữ liệu không thể tải được. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Error in fetchData:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa xe này?')) return;
    
    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
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

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Đã xóa người dùng thành công');
        fetchData();
      } else {
        toast.error('Không thể xóa người dùng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleUpdateOrder = async (id: string, status: string, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });

      if (response.ok) {
        toast.success('Đã cập nhật đơn hàng');
        setShowOrderModal(false);
        setEditingOrder(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Đã xóa đơn hàng thành công');
        fetchData();
      } else {
        toast.error('Không thể xóa đơn hàng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };


  useEffect(() => {
    if (showCarForm) {
      // Set selected images from editing car if exists
      if (editingCar?.images) {
        setSelectedImages(editingCar.images);
      } else {
        setSelectedImages([]);
      }
    }
  }, [showCarForm, editingCar]);

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} không phải là ảnh`);
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn (tối đa 5MB)`);
        return null;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.url) {
          return data.url;
        } else {
          toast.error(`Lỗi upload ${file.name}: ${data.error || 'Unknown error'}`);
          return null;
        }
      } catch (error) {
        toast.error(`Lỗi upload ${file.name}`);
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];

    if (validUrls.length > 0) {
      setSelectedImages(prev => [...prev, ...validUrls]);
      toast.success(`Đã upload ${validUrls.length} ảnh thành công`);
    }

    setUploadingImages(false);
    // Reset input
    e.target.value = '';
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    // Sử dụng selectedImages từ state
    const images = selectedImages.filter(url => url && url.trim().length > 0);

    const data: any = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      year: parseInt(formData.get('year') as string),
      price: parseInt(formData.get('price') as string),
      mileage: parseInt(formData.get('mileage') as string) || 0,
      description: formData.get('description'),
      condition: formData.get('condition'),
      color: formData.get('color'),
      transmission: formData.get('transmission'),
      fuelType: formData.get('fuelType'),
      location: {
        province: formData.get('province'),
        city: formData.get('city'),
      },
      images: images.length > 0 ? images : [],
      seller: session?.user?.id || editingCar?.seller,
      status: 'approved', // Admin tạo thì tự động approved
    };

    try {
      // Validate data before sending
      console.log('Sending car data:', data);
      
      if (!data.brand || !data.model || !data.year || !data.price) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const url = editingCar ? `/api/admin/cars/${editingCar._id}` : '/api/admin/cars';
      const method = editingCar ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        toast.success(editingCar ? 'Đã cập nhật xe' : 'Đã thêm xe mới');
        setShowCarForm(false);
        setEditingCar(null);
        setSelectedImages([]);
        fetchData();
      } else {
        const errorMessage = responseData.error || responseData.message || 'Có lỗi xảy ra';
        const missingFields = responseData.missingFields || [];
        const validationErrors = responseData.validationErrors || {};
        
        let fullErrorMessage = errorMessage;
        if (missingFields.length > 0) {
          fullErrorMessage += `\nThiếu: ${missingFields.join(', ')}`;
        }
        if (Object.keys(validationErrors).length > 0) {
          fullErrorMessage += `\nLỗi validation: ${Object.values(validationErrors).join(', ')}`;
        }
        
        toast.error(fullErrorMessage);
        console.error('Error details:', responseData);
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra: ' + (error.message || 'Unknown error'));
      console.error('Error:', error);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      role: formData.get('role'),
      password: formData.get('password'),
    };

    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingUser ? 'Đã cập nhật người dùng' : 'Đã thêm người dùng mới');
        setShowUserForm(false);
        setEditingUser(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const filteredCars = cars.filter(car =>
    car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Quản trị hệ thống</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">{session.user?.email}</span>
              <Link
                href="/"
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'cars'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4 inline mr-2" />
              Quản lý sản phẩm
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Quản lý khách hàng
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Quản lý đơn hàng
            </button>
            <button
              onClick={() => setActiveTab('diagram')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'diagram'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Biểu đồ doanh thu
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingCar(null);
                  setShowCarForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </button>
            </div>

            {/* Car Form Modal */}
            {showCarForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-xl font-bold">{editingCar ? 'Chỉnh sửa' : 'Thêm mới'} sản phẩm</h2>
                    <button onClick={() => { setShowCarForm(false); setEditingCar(null); setSelectedImages([]); }} className="p-1 hover:bg-slate-100 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveCar}>
                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Hãng <span className="text-red-500">*</span></label>
                          <input name="brand" defaultValue={editingCar?.brand} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Model <span className="text-red-500">*</span></label>
                          <input name="model" defaultValue={editingCar?.model} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Năm <span className="text-red-500">*</span></label>
                          <input name="year" type="number" defaultValue={editingCar?.year} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Giá (VNĐ) <span className="text-red-500">*</span></label>
                          <input name="price" type="number" defaultValue={editingCar?.price} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Số km <span className="text-red-500">*</span></label>
                          <input name="mileage" type="number" defaultValue={editingCar?.mileage} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      </div>

                      {/* Car Details */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Tình trạng <span className="text-red-500">*</span></label>
                          <select name="condition" defaultValue={editingCar?.condition} required className="w-full px-3 py-2 border rounded-lg">
                            <option value="">Chọn tình trạng</option>
                            <option value="mới">Mới</option>
                            <option value="cũ">Cũ</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Màu sắc <span className="text-red-500">*</span></label>
                          <input name="color" defaultValue={editingCar?.color} required className="w-full px-3 py-2 border rounded-lg" placeholder="Ví dụ: Đen, Trắng, Xám" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Hộp số <span className="text-red-500">*</span></label>
                          <select name="transmission" defaultValue={editingCar?.transmission} required className="w-full px-3 py-2 border rounded-lg">
                            <option value="">Chọn hộp số</option>
                            <option value="số sàn">Số sàn</option>
                            <option value="số tự động">Số tự động</option>
                            <option value="CVT">CVT</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Loại nhiên liệu <span className="text-red-500">*</span></label>
                        <select name="fuelType" defaultValue={editingCar?.fuelType} required className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Chọn loại nhiên liệu</option>
                          <option value="xăng">Xăng</option>
                          <option value="diesel">Diesel</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="electric">Điện</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                          <input name="province" defaultValue={editingCar?.location?.province} required className="w-full px-3 py-2 border rounded-lg" placeholder="Ví dụ: Hà Nội, TP.HCM" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
                          <input name="city" defaultValue={editingCar?.location?.city} required className="w-full px-3 py-2 border rounded-lg" placeholder="Ví dụ: Quận 1, Ba Đình" />
                        </div>
                      </div>

                      {/* Images */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Ảnh sản phẩm</label>
                        
                        {/* Hidden input để lưu selected images */}
                        <input 
                          type="hidden" 
                          name="images" 
                          value={selectedImages.join(', ')} 
                        />
                        
                        {/* Selected images preview */}
                        {selectedImages.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-600 mb-2">Ảnh đã chọn ({selectedImages.length}):</p>
                            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                              {selectedImages.map((imgUrl, idx) => (
                                <div key={idx} className="relative w-full h-20 bg-slate-100 rounded overflow-hidden border-2 border-blue-500">
                                  <Image 
                                    src={imgUrl} 
                                    alt={`Selected ${idx + 1}`} 
                                    fill 
                                    className="object-cover" 
                                    sizes="100px" 
                                  />
                                  <button
                                    type="button"
                                    onClick={() => toggleImageSelection(imgUrl)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upload images from computer */}
                        <div className="mb-3">
                          <label className="block text-xs text-slate-600 mb-2">Upload ảnh từ máy tính:</label>
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              disabled={uploadingImages}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className={`flex flex-col items-center justify-center cursor-pointer ${
                                uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {uploadingImages ? (
                                <>
                                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
                                  <p className="text-sm text-slate-600">Đang upload...</p>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-8 h-8 text-slate-400 mb-2" />
                                  <p className="text-sm text-slate-600 mb-1">Click để chọn ảnh hoặc kéo thả ảnh vào đây</p>
                                  <p className="text-xs text-slate-500">Hỗ trợ: JPG, PNG, WEBP, GIF, AVIF (Tối đa 5MB/ảnh)</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Manual URL input (optional) */}
                        <div>
                          <p className="text-xs text-slate-600 mb-2">Hoặc nhập URL ảnh thủ công:</p>
                          <textarea 
                            rows={2} 
                            className="w-full px-3 py-2 border rounded-lg text-sm" 
                            placeholder="Nhập URL ảnh, cách nhau bởi dấu phẩy. Ví dụ: https://example.com/image1.jpg, https://example.com/image2.jpg"
                            onChange={(e) => {
                              const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url.length > 0);
                              setSelectedImages(prev => {
                                const newUrls = urls.filter(url => !prev.includes(url));
                                return [...prev, ...newUrls];
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Mô tả <span className="text-red-500">*</span></label>
                        <textarea 
                          name="description" 
                          defaultValue={editingCar?.description} 
                          required 
                          rows={4} 
                          className="w-full px-3 py-2 border rounded-lg" 
                          placeholder="Mô tả chi tiết về xe..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6 sticky bottom-0 bg-white pt-4 border-t">
                      <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </button>
                      <button type="button" onClick={() => { setShowCarForm(false); setEditingCar(null); setSelectedImages([]); }} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Cars List */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hình ảnh</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sản phẩm</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Năm</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Giá</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCars.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          Không tìm thấy sản phẩm nào
                        </td>
                      </tr>
                    ) : (
                      filteredCars.map((car) => (
                        <tr key={car._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            {car.images && car.images.length > 0 && car.images[0] ? (
                              <div className="relative w-20 h-20 bg-slate-100 rounded overflow-hidden">
                                {car.images[0].startsWith('http') || car.images[0].startsWith('/') ? (
                                  <Image 
                                    src={car.images[0]} 
                                    alt={`${car.brand} ${car.model}`} 
                                    fill
                                    sizes="80px"
                                    className="rounded object-cover" 
                                    unoptimized={car.images[0].startsWith('http') && !car.images[0].includes('cloudinary.com') && !car.images[0].includes('unsplash.com')}
                                  />
                                ) : (
                                  <img 
                                    src={car.images[0]} 
                                    alt={`${car.brand} ${car.model}`} 
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>';
                                      }
                                    }}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="w-20 h-20 bg-slate-200 rounded flex items-center justify-center">
                                <span className="text-slate-400 text-xs">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{car.brand} {car.model}</div>
                            <div className="text-sm text-slate-500">{car.mileage?.toLocaleString()} km</div>
                          </td>
                          <td className="px-6 py-4">{car.year}</td>
                          <td className="px-6 py-4 font-medium">{formatPrice(car.price)}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingCar(car);
                                  setShowCarForm(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCar(String(car._id))}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowUserForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm khách hàng
              </button>
            </div>

            {/* User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{editingUser ? 'Chỉnh sửa' : 'Thêm mới'} khách hàng</h2>
                    <button onClick={() => { setShowUserForm(false); setEditingUser(null); }}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveUser}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Họ và tên</label>
                        <input name="name" defaultValue={editingUser?.name} required className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                        <input name="phone" defaultValue={editingUser?.phone} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Vai trò</label>
                        <select name="role" defaultValue={editingUser?.role || 'user'} className="w-full px-3 py-2 border rounded-lg">
                          <option value="user">Người dùng</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                      </div>
                      {!editingUser && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                          <input name="password" type="password" required={!editingUser} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Save className="w-4 h-4 inline mr-2" />
                        Lưu
                      </button>
                      <button type="button" onClick={() => { setShowUserForm(false); setEditingUser(null); }} className="px-4 py-2 bg-slate-200 rounded-lg">
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Số điện thoại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vai trò</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.phone || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserForm(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(String(user._id))}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status as any)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      orderStatusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' && 'Tất cả'}
                    {status === 'pending' && 'Chờ xử lý'}
                    {status === 'confirmed' && 'Đã xác nhận'}
                    {status === 'processing' && 'Đang xử lý'}
                    {status === 'completed' && 'Hoàn thành'}
                    {status === 'cancelled' && 'Đã hủy'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sản phẩm</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thanh toán</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày tạo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-blue-600">{order.orderNumber}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{order.user?.name || order.shippingAddress?.fullName}</div>
                          <div className="text-sm text-slate-500">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {order.items?.length || 0} sản phẩm
                          </div>
                          {order.items?.[0] && (
                            <div className="text-xs text-slate-500">
                              {order.items[0].carSnapshot?.brand} {order.items[0].carSnapshot?.model}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">{formatPrice(order.totalAmount || 0)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status === 'pending' && 'Chờ xử lý'}
                            {order.status === 'confirmed' && 'Đã xác nhận'}
                            {order.status === 'processing' && 'Đang xử lý'}
                            {order.status === 'completed' && 'Hoàn thành'}
                            {order.status === 'cancelled' && 'Đã hủy'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                            order.paymentStatus === 'refunded' ? 'bg-orange-100 text-orange-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.paymentStatus === 'paid' && 'Đã thanh toán'}
                            {order.paymentStatus === 'pending' && 'Chờ thanh toán'}
                            {order.paymentStatus === 'failed' && 'Thất bại'}
                            {order.paymentStatus === 'refunded' && 'Đã hoàn tiền'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(String(order._id))}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Không tìm thấy đơn hàng nào</p>
                </div>
              )}
            </div>

            {/* Order Detail Modal */}
            {showOrderModal && editingOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
                    <button onClick={() => { setShowOrderModal(false); setEditingOrder(null); }}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Mã đơn hàng</label>
                        <p className="font-medium">{editingOrder.orderNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Ngày tạo</label>
                        <p>{new Date(editingOrder.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                      <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <p><span className="font-medium">Tên:</span> {editingOrder.user?.name || editingOrder.shippingAddress?.fullName}</p>
                        <p><span className="font-medium">Email:</span> {editingOrder.user?.email || '-'}</p>
                        <p><span className="font-medium">Điện thoại:</span> {editingOrder.shippingAddress?.phone || '-'}</p>
                        <p><span className="font-medium">Địa chỉ:</span> {editingOrder.shippingAddress?.address}, {editingOrder.shippingAddress?.city}, {editingOrder.shippingAddress?.province}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3">Sản phẩm</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium">Sản phẩm</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Số lượng</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Giá</th>
                              <th className="px-4 py-2 text-right text-sm font-medium">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {editingOrder.items?.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-3">
                                  <div className="font-medium">{item.carSnapshot?.brand} {item.carSnapshot?.model}</div>
                                  <div className="text-sm text-slate-500">Năm: {item.carSnapshot?.year}</div>
                                </td>
                                <td className="px-4 py-3">{item.quantity}</td>
                                <td className="px-4 py-3">{formatPrice(item.price)}</td>
                                <td className="px-4 py-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-right font-semibold">Tổng cộng:</td>
                              <td className="px-4 py-3 text-right font-bold text-lg">{formatPrice(editingOrder.totalAmount)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h3 className="font-semibold mb-3">Cập nhật trạng thái</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Trạng thái đơn hàng</label>
                          <select
                            id="order-status"
                            defaultValue={editingOrder.status}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Trạng thái thanh toán</label>
                          <select
                            id="payment-status"
                            defaultValue={editingOrder.paymentStatus}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="pending">Chờ thanh toán</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="failed">Thất bại</option>
                            <option value="refunded">Đã hoàn tiền</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => {
                          const statusSelect = document.getElementById('order-status') as HTMLSelectElement;
                          const paymentSelect = document.getElementById('payment-status') as HTMLSelectElement;
                          handleUpdateOrder(editingOrder._id, statusSelect.value, paymentSelect.value);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Cập nhật
                      </button>
                      <button
                        onClick={() => { setShowOrderModal(false); setEditingOrder(null); }}
                        className="px-4 py-2 bg-slate-200 rounded-lg"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Revenue Chart Tab */}
        {activeTab === 'diagram' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="text-sm text-slate-500 mb-2">Tổng doanh thu</div>
                  <div className="text-2xl font-bold text-slate-900">{formatPrice(stats.totalRevenue || 0)}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="text-sm text-slate-500 mb-2">Doanh thu tháng này</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatPrice(stats.monthlyRevenue || 0)}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="text-sm text-slate-500 mb-2">Tổng đơn hàng</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalOrders || 0}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="text-sm text-slate-500 mb-2">Đơn hàng tháng này</div>
                  <div className="text-2xl font-bold text-purple-600">{stats.monthlyOrders || 0}</div>
                </div>
              </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-bold mb-6">Biểu đồ doanh thu</h2>
                <div className="bg-slate-50 rounded-lg p-6">
                  {revenueData.length > 0 ? (
                    <div className="relative">
                      <svg viewBox="0 0 700 350" className="w-full h-auto">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <line
                            key={`grid-${i}`}
                            x1="70"
                            y1={70 + i * 50}
                            x2="630"
                            y2={70 + i * 50}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Y-axis labels */}
                        {(() => {
                          const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
                          const maxValue = Math.ceil(maxRevenue * 1.2);
                          return [0, 1, 2, 3, 4, 5].map((i) => {
                            const value = maxValue - (maxValue / 5) * i;
                            return (
                              <text
                                key={`y-label-${i}`}
                                x="65"
                                y={70 + i * 50 + 5}
                                textAnchor="end"
                                fill="#64748b"
                                fontSize="11"
                              >
                                {formatPrice(value)}
                              </text>
                            );
                          });
                        })()}

                        {/* Bars */}
                        {revenueData.map((data, index) => {
                          const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
                          const maxValue = Math.ceil(maxRevenue * 1.2);
                          const barHeight = (data.revenue / maxValue) * 250;
                          const barWidth = 70;
                          const barX = 100 + index * 95;
                          const barY = 320 - barHeight;
                          const monthName = new Date(data.month + '-01').toLocaleDateString('vi-VN', { month: 'short' });

                          return (
                            <g key={data.month}>
                              <rect
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={barHeight}
                                fill="#3b82f6"
                                rx="4"
                                className="hover:fill-blue-700 transition"
                              />
                              <text
                                x={barX + barWidth / 2}
                                y="340"
                                textAnchor="middle"
                                fill="#64748b"
                                fontSize="11"
                              >
                                {monthName}
                              </text>
                              <text
                                x={barX + barWidth / 2}
                                y={barY - 5}
                                textAnchor="middle"
                                fill="#1e293b"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {formatPrice(data.revenue)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Axes */}
                        <line x1="70" y1="70" x2="70" y2="320" stroke="#1e293b" strokeWidth="2" />
                        <line x1="70" y1="320" x2="630" y2="320" stroke="#1e293b" strokeWidth="2" />
                      </svg>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm">Chưa có dữ liệu doanh thu</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Count Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-bold mb-6">Biểu đồ số lượng đơn hàng</h2>
                <div className="bg-slate-50 rounded-lg p-6">
                  {orderCountData.length > 0 ? (
                    <div className="relative">
                      <svg viewBox="0 0 700 350" className="w-full h-auto">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <line
                            key={`grid-orders-${i}`}
                            x1="70"
                            y1={70 + i * 50}
                            x2="630"
                            y2={70 + i * 50}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Y-axis labels */}
                        {(() => {
                          const maxCount = Math.max(...orderCountData.map(d => d.count), 1);
                          const maxValue = Math.ceil(maxCount * 1.2);
                          return [0, 1, 2, 3, 4, 5].map((i) => {
                            const value = maxValue - (maxValue / 5) * i;
                            return (
                              <text
                                key={`y-label-orders-${i}`}
                                x="65"
                                y={70 + i * 50 + 5}
                                textAnchor="end"
                                fill="#64748b"
                                fontSize="11"
                              >
                                {Math.round(value)}
                              </text>
                            );
                          });
                        })()}

                        {/* Line chart */}
                        {orderCountData.length > 0 && (() => {
                          const maxCount = Math.max(...orderCountData.map(d => d.count), 1);
                          const maxValue = Math.ceil(maxCount * 1.2);
                          const points = orderCountData.map((data, index) => {
                            const x = 100 + index * 95 + 35;
                            const y = 320 - (data.count / maxValue) * 250;
                            return `${x},${y}`;
                          }).join(' ');

                          return (
                            <>
                              {/* Area under line */}
                              <polygon
                                points={`70,320 ${points} 630,320`}
                                fill="url(#gradient)"
                                opacity="0.3"
                              />
                              {/* Line */}
                              <polyline
                                points={points}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {/* Points */}
                              {orderCountData.map((data, index) => {
                                const maxCount = Math.max(...orderCountData.map(d => d.count), 1);
                                const maxValue = Math.ceil(maxCount * 1.2);
                                const x = 100 + index * 95 + 35;
                                const y = 320 - (data.count / maxValue) * 250;
                                const monthName = new Date(data.month + '-01').toLocaleDateString('vi-VN', { month: 'short' });

                                return (
                                  <g key={data.month}>
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="5"
                                      fill="#10b981"
                                      stroke="white"
                                      strokeWidth="2"
                                      className="hover:r-7 transition"
                                    />
                                    <text
                                      x={x}
                                      y={y - 10}
                                      textAnchor="middle"
                                      fill="#1e293b"
                                      fontSize="10"
                                      fontWeight="bold"
                                    >
                                      {data.count}
                                    </text>
                                    <text
                                      x={x}
                                      y="340"
                                      textAnchor="middle"
                                      fill="#64748b"
                                      fontSize="11"
                                    >
                                      {monthName}
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          );
                        })()}

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Axes */}
                        <line x1="70" y1="70" x2="70" y2="320" stroke="#1e293b" strokeWidth="2" />
                        <line x1="70" y1="320" x2="630" y2="320" stroke="#1e293b" strokeWidth="2" />
                      </svg>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm">Chưa có dữ liệu đơn hàng</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
