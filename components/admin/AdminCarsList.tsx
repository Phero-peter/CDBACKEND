'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { DeleteCarButton } from './DeleteCarButton';
import { ICar } from '@/models/Car';
import { Eye, Pencil } from 'lucide-react';

interface AdminCarsListProps {
  cars: ICar[];
}

export function AdminCarsList({ cars: initialCars }: AdminCarsListProps) {
  const [cars, setCars] = useState<ICar[]>(initialCars);

  const handleCarDeleted = (deletedCarId: string) => {
    setCars(currentCars => currentCars.filter(car => String(car._id) !== deletedCarId));
  };

  if (cars.length === 0) {
    return <div className="text-center py-12 text-gray-500">No cars found.</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cars.map((car) => (
            <tr key={String(car._id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex-shrink-0 h-16 w-24 relative">
                    <Image
                        src={car.images?.[0] || '/placeholder.png'}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        sizes="96px"
                        className="object-cover rounded"
                    />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{car.brand} {car.model}</div>
                <div className="text-sm text-gray-500">{car.year} - {car.mileage} km</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatPrice(car.price)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : car.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {car.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                    <Link href={`/cars/${car.slug}`} title="View" className="text-gray-400 hover:text-gray-600">
                        <Eye size={18} />
                    </Link>
                    <Link href={`/admin/cars/edit/${car._id}`} title="Edit" className="text-indigo-600 hover:text-indigo-900">
                        <Pencil size={18} />
                    </Link>
                    <DeleteCarButton carId={String(car._id)} onCarDeleted={handleCarDeleted} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
