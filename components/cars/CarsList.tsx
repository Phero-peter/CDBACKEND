import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import CarCard from './CarCard';

async function getCars(searchParams: { [key: string]: string | string[] | undefined }) {
  await connectDB();

  const query: any = { status: 'approved' };

  // Brand filter
  if (searchParams.brand) {
    query.brand = searchParams.brand;
  }

  if (searchParams.q) {
    const searchTerm = searchParams.q as string;
    query.$or = [
      { brand: { $regex: searchTerm, $options: 'i' } },
      { model: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    query.price = {};
    if (searchParams.minPrice) {
      query.price.$gte = Number(searchParams.minPrice) * 1000000;
    }
    if (searchParams.maxPrice) {
      query.price.$lte = Number(searchParams.maxPrice) * 1000000;
    }
  }

  if (searchParams.year) {
    query.year = Number(searchParams.year);
  }

  if (searchParams.maxMileage) {
    query.mileage = { $lte: Number(searchParams.maxMileage) };
  }

  if (searchParams.fuelType) {
    query.fuelType = searchParams.fuelType;
  }

  if (searchParams.transmission) {
    query.transmission = searchParams.transmission;
  }

  if (searchParams.condition) {
    query.condition = searchParams.condition;
  }

  const cars = await Car.find(query)
    .populate('seller', 'name phone')
    .sort({ createdAt: -1 })
    .lean();

  // Group cars by brand and model
  const groupedCars: { [key: string]: any[] } = {};
  cars.forEach((car: any) => {
    const key = `${car.brand}-${car.model}`;
    if (!groupedCars[key]) {
      groupedCars[key] = [];
    }
    groupedCars[key].push(car);
  });

  return {
    groupedCars: JSON.parse(JSON.stringify(groupedCars)),
    allCars: JSON.parse(JSON.stringify(cars)),
  };
}

export default async function CarsList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { groupedCars, allCars } = await getCars(searchParams);
  const carGroups = Object.values(groupedCars);
  const featuredCars = allCars.slice(0, 2);

  return (
    <div>
      {/* Main Grid */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500">
            {carGroups.length} {carGroups.length === 1 ? 'Mẫu xe' : 'Mẫu xe'}
          </span>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 shadow-sm">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <button className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 shadow-sm">
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {carGroups.map((group: any[], index: number) => (
            <CarCard key={index} group={group} />
          ))}
        </div>
      </div>

      {/* Featured Cars Section */}
      {featuredCars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCars.map((car: any) => (
            <Link
              key={car._id}
              href={`/cars/${car.slug}`}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition group border border-slate-100"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={car.images[0] || 'https://images.unsplash.com/photo-1492144534651-402be22a8c90?w=800&h=600&fit=crop'}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {car.fuelType === 'electric' && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-sm">
                    <Zap className="h-4 w-4" />
                    <span>Xe điện</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {car.brand} {car.model}
                </h3>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-sm">
                  Khám phá ngay
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {carGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">Không tìm thấy xe nào phù hợp</p>
        </div>
      )}
    </div>
  );
}
