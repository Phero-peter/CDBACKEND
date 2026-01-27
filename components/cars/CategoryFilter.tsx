'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import Image from 'next/image';

const brands = [
  { id: 'all', label: 'Các mẫu xe', logo: null },
  { id: 'Toyota', label: 'Toyota', logo: '/imgs/toyota-vios-1.png.webp' },
  { id: 'Honda', label: 'Honda', logo: null },
  { id: 'Ford', label: 'Ford', logo: '/imgs/ford-mustang.jpg' },
  { id: 'Mazda', label: 'Mazda', logo: null },
  { id: 'Hyundai', label: 'Hyundai', logo: null },
  { id: 'Kia', label: 'Kia', logo: '/imgs/carens-icon-3.png' },
  { id: 'Mercedes-Benz', label: 'Mercedes-Benz', logo: null },
  { id: 'BMW', label: 'BMW', logo: '/imgs/7_series.avif' },
  { id: 'Audi', label: 'Audi', logo: '/imgs/audi-e-tronGT.webp' },
  { id: 'Lexus', label: 'Lexus', logo: null },
  { id: 'Porsche', label: 'Porsche', logo: null },
  { id: 'Volkswagen', label: 'Volkswagen', logo: null },
  { id: 'Nissan', label: 'Nissan', logo: null },
  { id: 'Mitsubishi', label: 'Mitsubishi', logo: null },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrand = searchParams.get('brand') || 'all';

  const handleBrandChange = (brandId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brandId === 'all') {
      params.delete('brand');
    } else {
      params.set('brand', brandId);
    }
    params.delete('page'); // Reset to page 1
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {brands.map((brand) => {
          const isSelected = selectedBrand === brand.id;
          
          return (
            <button
              key={brand.id}
              onClick={() => handleBrandChange(brand.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
              {brand.logo ? (
                <div className="relative h-5 w-5 flex-shrink-0">
                  <Image
                    src={brand.logo}
                    alt={brand.label}
                    fill
                    sizes="20px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-5 w-5 flex-shrink-0" />
              )}
              <span>{brand.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
