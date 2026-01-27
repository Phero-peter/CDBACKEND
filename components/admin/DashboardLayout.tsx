'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Car,
  FolderKanban,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Bell,
  MessageSquare,
  Share2,
  User,
  Search,
  Plus,
  Upload,
  Download,
  MoreVertical,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 w-full">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-width duration-200 ease-out flex flex-col`}
      >
        {/* User Profile */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {session?.user?.email || 'admin@example.com'}
                </p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            )}
            {sidebarOpen && (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 text-purple-600 border-l-4 border-purple-600 cursor-pointer"
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Bảng điều khiển</span>}
          </Link>
          <Link
            href="/dashboard/cars"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Car className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sản phẩm</span>}
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <FolderKanban className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Danh mục</span>}
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Đơn hàng</span>}
          </Link>
          <Link
            href="/dashboard/stats"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Báo cáo</span>}
          </Link>
          <Link
            href="/dashboard/users"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <FolderKanban className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Người dùng</span>}
          </Link>
        </nav>

        {/* Favorites Section */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => setFavoritesOpen(!favoritesOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Yêu thích</span>
                <Plus className="w-4 h-4" />
              </div>
              {favoritesOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {favoritesOpen && (
              <div className="mt-2 space-y-1">
                <Link
                  href="/dashboard/cars"
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Sản phẩm (1,212)
                </Link>
                <Link
                  href="/dashboard/users"
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Khách hàng (898)
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Đơn hàng (32)
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Projects Section */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Dự án</span>
                <Plus className="w-4 h-4" />
              </div>
              {projectsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Cloud Storage */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-200">
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Lưu trữ đám mây</span>
                <span>89%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <button className="w-full px-3 py-2 text-xs bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 cursor-pointer">
              Nâng cấp lưu trữ (lên đến 25GB)
            </button>
          </div>
        )}

        {/* Settings & Help */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-200 space-y-2">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Cài đặt</span>
            </Link>
            <Link
              href="/dashboard/help"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Trung tâm trợ giúp</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-slate-900">BiMax CRM Platform</div>
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm AI"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
              </button>
              <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Share2 className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 cursor-pointer">
                Tùy chỉnh Widget
              </button>
              <div className="relative">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2 cursor-pointer">
                  Nhập dữ liệu
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 cursor-pointer">
                Xuất dữ liệu
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 relative z-0">{children}</main>
      </div>
    </div>
  );
}
