import { Suspense } from 'react';
import CarsList from '@/components/cars/CarsList';
import CategoryFilter from '@/components/cars/CategoryFilter';

export const metadata = {
  title: 'Danh sách xe - LUXE MOTORS',
  description: 'Tìm kiếm và lọc xe ô tô theo hãng, giá, năm sản xuất và nhiều tiêu chí khác',
};

export default function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="bg-slate-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="mb-8">Đang tải bộ lọc...</div>}>
          <CategoryFilter />
        </Suspense>
        <CarsList searchParams={searchParams} />
      </div>
    </div>
  );
}
