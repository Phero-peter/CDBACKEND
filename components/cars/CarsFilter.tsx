'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { X } from 'lucide-react';
import { debounce } from '@/lib/utils';

const brands = [
  'Toyota', 'Honda', 'Ford', 'Mazda', 'Hyundai', 'Kia', 'Mercedes-Benz',
  'BMW', 'Audi', 'Lexus', 'Porsche', 'Volkswagen', 'Nissan', 'Mitsubishi'
];

const fuelTypes = ['xăng', 'diesel', 'hybrid', 'electric'];
const transmissions = ['số sàn', 'số tự động', 'CVT'];
const conditions = ['mới', 'cũ'];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 10000);
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [maxMileage, setMaxMileage] = useState(Number(searchParams.get('maxMileage')) || 500000);
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');

  const updateURL = debounce((params: URLSearchParams) => {
    router.push(`/cars?${params.toString()}`);
  }, 300);

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 10000) params.set('maxPrice', maxPrice.toString());
    if (year) params.set('year', year);
    if (maxMileage < 500000) params.set('maxMileage', maxMileage.toString());
    if (fuelType) params.set('fuelType', fuelType);
    if (transmission) params.set('transmission', transmission);
    if (condition) params.set('condition', condition);
    
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    
    updateURL(params);
  };

  const clearFilters = () => {
    setBrand('');
    setMinPrice(0);
    setMaxPrice(10000);
    setYear('');
    setMaxMileage(500000);
    setFuelType('');
    setTransmission('');
    setCondition('');
    router.push('/cars');
  };

  useEffect(() => {
    handleFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, minPrice, maxPrice, year, maxMileage, fuelType, transmission, condition]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Bộ lọc</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <X className="h-4 w-4" />
          <span>Xóa bộ lọc</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Hãng xe
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Khoảng giá (triệu VNĐ)
          </label>
          <div className="px-2">
            <Slider
              range
              min={0}
              max={10000}
              step={100}
              value={[minPrice, maxPrice]}
              onChange={(values) => {
                setMinPrice(values[0] as number);
                setMaxPrice(values[1] as number);
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-500 mt-2">
            <span>{minPrice.toLocaleString('vi-VN')} triệu</span>
            <span>{maxPrice.toLocaleString('vi-VN')} triệu</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Năm sản xuất
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Số km tối đa
          </label>
          <div className="px-2">
            <Slider
              min={0}
              max={500000}
              step={10000}
              value={maxMileage}
              onChange={(value) => setMaxMileage(value as number)}
            />
          </div>
          <div className="text-sm text-slate-500 mt-2 text-center">
            {maxMileage.toLocaleString('vi-VN')} km
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Loại nhiên liệu
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Hộp số
          </label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Tình trạng
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

