import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICar extends Document {
  slug: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: 'xăng' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'số sàn' | 'số tự động' | 'CVT';
  color: string;
  condition: 'mới' | 'cũ';
  description: string;
  images: string[];
  location: {
    province: string;
    city: string;
  };
  seller: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelType: {
      type: String,
      enum: ['xăng', 'diesel', 'hybrid', 'electric'],
      required: true,
    },
    transmission: {
      type: String,
      enum: ['số sàn', 'số tự động', 'CVT'],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ['mới', 'cũ'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    location: {
      province: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CarSchema.index({ brand: 1, model: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ year: 1 });
CarSchema.index({ status: 1, featured: 1 });
CarSchema.index({ createdAt: -1 });

const Car: Model<ICar> = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;

