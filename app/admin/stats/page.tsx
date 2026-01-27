'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, ShoppingCart, 
  Users, Car, Package, Calendar, ArrowUp, ArrowDown 
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Stats {
  totalCars: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  recentOrders: any[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success || data.totalCars !== undefined) {
        setStats(data);
      }
    } catch (error) {
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-900">Thống kê & Báo cáo</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-100 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>12%</span>
              </div>
            </div>
            <p className="text-emerald-100 text-sm mb-1">Tổng doanh thu</p>
            <p className="text-3xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-blue-100 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>8%</span>
              </div>
            </div>
            <p className="text-blue-100 text-sm mb-1">Tổng đơn hàng</p>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
          </div>

          {/* Total Users */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-purple-100 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>15%</span>
              </div>
            </div>
            <p className="text-purple-100 text-sm mb-1">Tổng khách hàng</p>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </div>

          {/* Total Cars */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-orange-100 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>5%</span>
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">Tổng xe</p>
            <p className="text-3xl font-bold">{stats?.totalCars || 0}</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Trạng thái đơn hàng
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <span className="text-yellow-700">Chờ xử lý</span>
                <span className="font-bold text-yellow-700">{stats?.pendingOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-emerald-700">Hoàn thành</span>
                <span className="font-bold text-emerald-700">{stats?.completedOrders || 0}</span>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Thống kê tháng này
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Doanh thu</span>
                <span className="font-bold text-slate-900">{formatPrice(stats?.monthlyRevenue || 0)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Đơn hàng</span>
                <span className="font-bold text-slate-900">{stats?.monthlyOrders || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Thao tác nhanh
            </h3>
            <div className="space-y-3">
              <a
                href="/admin/cars"
                className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 font-medium transition-colors"
              >
                → Quản lý xe
              </a>
              <a
                href="/admin/categories"
                className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-700 font-medium transition-colors"
              >
                → Quản lý danh mục
              </a>
              <a
                href="/admin"
                className="block p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-700 font-medium transition-colors"
              >
                → Bảng điều khiển
              </a>
            </div>
          </div>
        </div>

        {/* Charts placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Doanh thu theo tháng</h3>
            <div className="h-64 flex items-center justify-center text-slate-400">
              <p>Biểu đồ sẽ được cập nhật...</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Đơn hàng theo trạng thái</h3>
            <div className="h-64 flex items-center justify-center text-slate-400">
              <p>Biểu đồ sẽ được cập nhật...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
