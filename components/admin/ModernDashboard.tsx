'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  KPICard,
  RevenueChart,
  CalendarWidget,
  LeadsManagement,
  TopCountry,
  RetentionRate,
} from './DashboardWidgets';
import { Users, DollarSign, Target, TrendingUp } from 'lucide-react';

export default function ModernDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok && mounted) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const leadsValue = useMemo(() => stats?.totalUsers?.toString() || '129', [stats?.totalUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Khách hàng tiềm năng"
          value={leadsValue}
          change="2%"
          changeType="up"
          period="tuần trước"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <KPICard
          title="Giá trị khách hàng"
          value="14d"
          change="4%"
          changeType="down"
          period="tuần trước"
          icon={<Target className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <KPICard
          title="Tỷ lệ chuyển đổi"
          value="24%"
          change="2%"
          changeType="up"
          period="tuần trước"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-emerald-500"
        />
        <KPICard
          title="Doanh thu"
          value="$1.4K"
          change="4%"
          changeType="down"
          period="tháng trước"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-amber-500"
        />
      </div>

      {/* Charts and Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <CalendarWidget />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadsManagement />
        <TopCountry />
        <RetentionRate />
      </div>
    </div>
  );
}
