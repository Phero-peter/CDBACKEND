
import CarCrudForm from '@/components/admin/CarCrudForm';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function NewCarPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session?.user?.role !== 'admin') {
        redirect('/admin/login');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/admin/cars" className="text-indigo-600 hover:underline">
                    &larr; Back to Car Management
                </Link>
            </div>
            <CarCrudForm />
        </div>
    );
}
