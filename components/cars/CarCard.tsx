'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { ChevronUp, ChevronDown, Zap } from 'lucide-react';

export default function CarCard({ group }: { group: any[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mainCar = group[0];
  const versionCount = group.length;

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition border border-slate-100">
        <Link href={`/cars/${mainCar.slug}`}>
          <div className="relative h-32 w-full">
            <Image
              src={mainCar.images[0] || 'https://images.unsplash.com/photo-1492144534651-402be22a8c90?w=800&h=600&fit=crop'}
              alt={`${mainCar.brand} ${mainCar.model}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 14vw"
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1">
              {mainCar.fuelType === 'electric' && (
                <Zap className="h-4 w-4 text-blue-600" />
              )}
              <h3 className="text-sm font-semibold text-slate-900">
                {mainCar.brand} {mainCar.model}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {versionCount} {versionCount === 1 ? 'Phiên bản' : 'Phiên bản'}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Expanded versions */}
      {isExpanded && versionCount > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl p-2 z-10 shadow-xl border border-slate-200">
          {group.map((car: any, idx: number) => (
            <Link
              key={idx}
              href={`/cars/${car.slug}`}
              className="block p-2 hover:bg-slate-50 rounded-lg mb-1 last:mb-0"
            >
              <div className="text-xs text-slate-900 font-medium">
                {car.brand} {car.model} {car.year}
              </div>
              <div className="text-xs text-slate-500">
                {formatPrice(car.price)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


