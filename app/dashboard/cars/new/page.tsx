'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import CarCrudForm from '@/components/admin/CarCrudForm';

export default function NewCarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/dashboard/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
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
        <div className="mb-6">
          <Link href="/dashboard/cars" className="text-purple-600 hover:underline flex items-center gap-2 cursor-pointer">
            ← Quay lại quản lý sản phẩm
          </Link>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Thêm sản phẩm mới</h1>
          <CarCrudForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
