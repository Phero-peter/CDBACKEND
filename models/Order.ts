import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  car: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  carSnapshot: {
    brand: string;
    model: string;
    year: number;
    image: string;
  };
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    province: string;
    city: string;
    note?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  carSnapshot: {
    brand: String,
    model: String,
    year: Number,
    image: String,
  },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'credit_card'],
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      note: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before validation
OrderSchema.pre('validate', async function (next) {
  if (!this.orderNumber || this.orderNumber === '') {
    const date = new Date();
    const prefix = `BM${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    this.orderNumber = `${prefix}-${timestamp}${random}`;
  }
  next();
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 });

// Avoid stale model in Next.js hot-reload
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
