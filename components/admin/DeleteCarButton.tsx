'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteCarButtonProps {
  carId: string;
  onCarDeleted: (carId: string) => void;
}

export function DeleteCarButton({ carId, onCarDeleted }: DeleteCarButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete the car.');
      }
      
      toast.success('Car deleted successfully!');
      onCarDeleted(carId);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
      title="Delete"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
