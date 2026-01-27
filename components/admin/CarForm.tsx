'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CarFormProps {
  initialData?: any;
  onSave: () => void;
  onCancel: () => void;
}

const FUEL_TYPES = ['xăng', 'diesel', 'hybrid', 'electric'];
const TRANSMISSIONS = ['số sàn', 'số tự động', 'CVT'];
const CONDITIONS = ['mới', 'cũ'];

export default function CarForm({ initialData, onSave, onCancel }: CarFormProps) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    fuelType: 'xăng',
    transmission: 'số tự động',
    color: '',
    condition: 'cũ',
    description: '',
    location: {
      province: '',
      city: '',
    },
    images: [''],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: initialData.images && initialData.images.length > 0 ? initialData.images : [''],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages.length ? newImages : [''] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `/api/admin/cars/${initialData._id}`
        : '/api/admin/cars';
      const method = initialData ? 'PUT' : 'POST';

      // Filter empty images
      const dataToSend = {
        ...formData,
        images: formData.images.filter((img) => img.trim() !== ''),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Có lỗi xảy ra');
      }

      toast.success(initialData ? 'Cập nhật thành công' : 'Tạo mới thành công');
      onSave();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
        <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Thông tin cơ bản</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Hãng xe</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                  placeholder="BMW, Audi, Toyota..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Dòng xe (Model)</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                  placeholder="X5, Camry, A4..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Năm sản xuất</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Giá (VNĐ)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Màu sắc</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Thông số kỹ thuật</h3>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Số ODO (km)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nhiên liệu</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                >
                  {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Hộp số</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                >
                  {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tình trạng</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Địa điểm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  name="location.province"
                  value={formData.location.province}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                  placeholder="Hà Nội"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Quận/Huyện</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                  placeholder="Đống Đa"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Mô tả</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
              placeholder="Mô tả chi tiết về xe..."
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-600">Hình ảnh (URL)</h3>
              <button
                type="button"
                onClick={addImageField}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-100 hover:bg-blue-100 transition flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Thêm ảnh
              </button>
            </div>
            <div className="space-y-2">
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded p-2 text-slate-900 focus:border-blue-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition text-rose-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
