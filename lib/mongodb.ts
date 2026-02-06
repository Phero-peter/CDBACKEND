import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const uri = process.env.MONGODB_URI || '';
    const isLocal = /localhost|127\.0\.0\.1|:27017/.test(uri);
    const hint = isLocal
      ? ' Kiểm tra: (1) MongoDB đã chạy chưa? (2) Hoặc dùng MongoDB Atlas và cập nhật MONGODB_URI trong .env.local'
      : ' Kiểm tra MONGODB_URI trên Vercel (Settings → Environment Variables) và IP whitelist trên MongoDB Atlas.';
    const err = e instanceof Error ? e : new Error(String(e));
    throw new Error(`Không kết nối được MongoDB.${hint} Chi tiết: ${err.message}`, { cause: e });
  }

  return cached.conn;
}

export default connectDB;

