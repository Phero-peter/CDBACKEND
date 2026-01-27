'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ICar } from '@/models/Car';

interface CarCrudFormProps {
  carId?: string;
}

const FUEL_TYPES = ['xăng', 'diesel', 'hybrid', 'electric'];
const TRANSMISSIONS = ['số sàn', 'số tự động', 'CVT'];
const CONDITIONS = ['mới', 'cũ'];

export default function CarCrudForm({ carId }: CarCrudFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    slug: '',
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
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    if (carId) {
      setIsNew(false);
      setLoading(true);
      fetch(`/api/cars/${carId}`)
        .then(res => res.json())
        .then(data => {
            if(data.data){
                setFormData({
                    ...data.data,
                    images: data.data.images && data.data.images.length > 0 ? data.data.images : [''],
                });
            } else {
                toast.error("Car not found");
                router.push('/admin/cars');
            }
        })
        .catch(() => {
            toast.error("Failed to fetch car data.");
            router.push('/admin/cars');
        })
        .finally(() => setLoading(false));
    }
  }, [carId, router]);

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

    const dataToSend = {
        ...formData,
        slug: formData.brand.toLowerCase().replace(/ /g, "-") + "-" + formData.model.toLowerCase().replace(/ /g, "-") + "-" + new Date().getTime(),
        images: formData.images.filter((img) => img.trim() !== ''),
    };

    try {
      const url = isNew ? `/api/cars` : `/api/cars/${carId}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred.');
      }

      toast.success(isNew ? 'Car created successfully!' : 'Car updated successfully!');
      router.push('/admin/cars');
      router.refresh();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !isNew) {
    return <div className="text-center p-8">Loading form...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isNew ? 'Add New Car' : 'Edit Car'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="p-4 border rounded">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                      <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Model</label>
                      <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Year</label>
                      <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Price (VND)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Color</label>
                      <input type="text" name="color" value={formData.color} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                  </div>
              </div>
            </div>

            {/* Specs */}
            <div className="p-4 border rounded">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mileage (km)</label>
                  <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fuel Type</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm">
                    {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm">
                    {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm">
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="p-4 border rounded">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Province</label>
                        <input type="text" name="location.province" value={formData.location.province} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">City/District</label>
                        <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                </div>
            </div>
            
            {/* Description */}
            <div className="p-4 border rounded">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Description</h3>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full border-gray-300 rounded-md shadow-sm"/>
            </div>

            {/* Images */}
            <div className="p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Images (URL)</h3>
                    <button type="button" onClick={addImageField} className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div className="space-y-3">
                    {formData.images.map((img, index) => (
                        <div key={index} className="flex gap-3">
                            <input type="text" value={img} onChange={(e) => handleImageChange(index, e.target.value)} className="flex-1 w-full border-gray-300 rounded-md shadow-sm" placeholder="https://example.com/image.jpg"/>
                            {formData.images.length > 1 && (
                                <button type="button" onClick={() => removeImageField(index)} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => router.push('/admin/cars')} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" disabled={loading}>
                    Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    </div>
  );
}
