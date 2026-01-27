'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Folder, Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Đã xóa danh mục');
        fetchCategories();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Không thể xóa danh mục');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900">Quản lý danh mục</h1>
          </div>
          <Link
            href="/admin/categories/add"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm danh mục
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Tên danh mục</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Slug</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Thứ tự</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500">
                      Không có danh mục nào
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">{category.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500">{category.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {category.isActive ? 'Hoạt động' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{category.order}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/categories/edit/${category._id}`}
                            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        )}
      </div>
    </div>
  );
}
