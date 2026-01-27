import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import { formatPrice } from '@/lib/utils';

async function getNewArrivals() {
  try {
    await connectDB();
    const cars = await Car.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export default async function NewArrivals() {
  const cars = await getNewArrivals();

  // Nếu không có xe nào, không hiển thị section này
  if (cars.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-1 h-12 bg-amber-500"></div>
            <span className="text-sm text-slate-500 uppercase tracking-wider">XE MỚI NHẤT</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">Đang cập nhật...</h2>
          <p className="text-slate-600 mb-8">Chúng tôi đang cập nhật danh sách xe mới nhất. Vui lòng quay lại sau!</p>
          <Link
            href="/cars"
            className="inline-block px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            Xem tất cả xe
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-1 h-12 bg-amber-500"></div>
              <span className="text-sm text-slate-500 uppercase tracking-wider">XE MỚI NHẤT 2024</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900">XE MỚI VỀ</h2>
          </div>
          <Link
            href="/cars"
            className="text-slate-700 hover:text-amber-600 transition-colors text-lg font-medium"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car: any) => (
            <Link
              key={car._id}
              href={`/cars/${car.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={car.images?.[0] || 'https://images.unsplash.com/photo-1492144534651-402be22a8c90?w=800&h=600&fit=crop'}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                    {car.condition === 'mới' ? 'Mới' : 'Đã qua sử dụng'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                  {car.brand} {car.model}
                </h3>
                <p className="text-slate-500 text-sm mb-3">
                  {car.year} • {car.mileage?.toLocaleString() || 0} km • {car.fuelType}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-amber-600 font-bold text-xl">
                    {formatPrice(car.price)}
                  </p>
                  <span className="text-slate-400 text-sm group-hover:text-amber-600 transition-colors">
                    Chi tiết →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link
            href="/cars"
            className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Xem tất cả xe có sẵn
          </Link>
        </div>
      </div>
    </section>
  );
}
