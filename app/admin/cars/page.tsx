
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminCarsList } from "@/components/admin/AdminCarsList";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function getCars() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cars`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch cars');
  }
  return res.json();
}

export default async function AdminCarsPage() {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || session?.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  const cars = await getCars();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý xe</h1>
        <Link href="/admin/cars/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm">
          Add New Car
        </Link>
      </div>
      <AdminCarsList cars={cars.data} />
    </div>
  );
}
