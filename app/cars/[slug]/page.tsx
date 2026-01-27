import Image from 'next/image';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import { formatPrice, formatNumber } from '@/lib/utils';
import CarActions from '@/components/cars/CarActions';

interface CarPageProps {
  params: { slug: string };
}

async function getCarBySlug(slug: string) {
  await connectDB();
  const car = await Car.findOne({ slug, status: 'approved' })
    .populate('seller', 'name phone email')
    .lean();
  return car ? JSON.parse(JSON.stringify(car)) : null;
}

export async function generateMetadata({ params }: CarPageProps) {
  const car = await getCarBySlug(params.slug);
  if (!car) {
    return { title: 'Không tìm thấy xe - LUXE MOTORS' };
  }

  return {
    title: `${car.brand} ${car.model} - LUXE MOTORS`,
    description: `Thông tin chi tiết xe ${car.brand} ${car.model} ${car.year}`,
  };
}

export default async function CarDetailPage({ params }: CarPageProps) {
  const car = await getCarBySlug(params.slug);
  if (!car) {
    notFound();
  }

  const images = car.images?.length ? car.images : [
    'https://images.unsplash.com/photo-1492144534651-402be22a8c90?w=1200&h=800&fit=crop',
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-slate-500 text-sm">Trang chủ / Xe / {car.brand} {car.model}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            {car.brand} {car.model} ({car.year})
          </h1>
          <p className="text-emerald-600 text-2xl font-semibold mt-2">{formatPrice(car.price)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-white border border-slate-200">
              <Image
                src={images[0]}
                alt={`${car.brand} ${car.model}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.slice(0, 3).map((img: string, idx: number) => (
                <div key={idx} className="relative h-24 w-full rounded-xl overflow-hidden bg-white border border-slate-200">
                  <Image 
                    src={img} 
                    alt={`${car.brand} ${car.model} ${idx + 1}`} 
                    fill 
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Action Buttons - Thêm vào giỏ hàng và Mua ngay */}
            <CarActions car={car} />

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông số nổi bật</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Hãng xe</p>
                  <p className="text-slate-900 font-medium">{car.brand}</p>
                </div>
                <div>
                  <p className="text-slate-500">Dòng xe</p>
                  <p className="text-slate-900 font-medium">{car.model}</p>
                </div>
                <div>
                  <p className="text-slate-500">Năm sản xuất</p>
                  <p className="text-slate-900 font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-slate-500">Số km</p>
                  <p className="text-slate-900 font-medium">{formatNumber(car.mileage || 0)} km</p>
                </div>
                <div>
                  <p className="text-slate-500">Nhiên liệu</p>
                  <p className="text-slate-900 font-medium">{car.fuelType}</p>
                </div>
                <div>
                  <p className="text-slate-500">Hộp số</p>
                  <p className="text-slate-900 font-medium">{car.transmission}</p>
                </div>
                <div>
                  <p className="text-slate-500">Màu sắc</p>
                  <p className="text-slate-900 font-medium">{car.color}</p>
                </div>
                <div>
                  <p className="text-slate-500">Tình trạng</p>
                  <p className="text-slate-900 font-medium">{car.condition}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500">Địa điểm</p>
                  <p className="text-slate-900 font-medium">
                    {car.location?.city || '-'}{car.location?.province ? `, ${car.location.province}` : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Mô tả</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {car.description || 'Chưa có mô tả chi tiết.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Liên hệ người bán</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-900 font-medium">{car.seller?.name || 'Người bán'}</p>
                  <p className="text-slate-500 text-sm">{car.seller?.email || 'Chưa cập nhật email'}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm">Số điện thoại</p>
                  <p className="text-slate-900 font-semibold">{car.seller?.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
              {car.seller?.phone && (
                <a
                  href={`tel:${car.seller.phone}`}
                  className="block w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition shadow-sm text-center font-medium"
                >
                  📞 Gọi ngay: {car.seller.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
