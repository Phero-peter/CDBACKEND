import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

/**
 * Kiểm tra quyền admin
 */
export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return {
    authorized: true,
    session,
  };
}

/**
 * Kết nối database và kiểm tra quyền admin
 */
export async function withAdminAuth<T>(
  handler: (session: any) => Promise<T>
): Promise<NextResponse> {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authorized) {
      return authResult.response;
    }

    await connectDB();
    const result = await handler(authResult.session);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

/**
 * Xử lý lỗi validation của Mongoose
 */
export function handleValidationError(error: any) {
  if (error.name === 'ValidationError') {
    const validationErrors: any = {};
    Object.keys(error.errors).forEach(key => {
      validationErrors[key] = error.errors[key].message;
    });
    return NextResponse.json(
      {
        error: 'Validation failed',
        validationErrors,
        message: Object.values(validationErrors).join(', '),
      },
      { status: 400 }
    );
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return NextResponse.json(
      {
        error: `Giá trị ${field} đã tồn tại`,
        message: `Giá trị ${field} này đã tồn tại trong hệ thống`,
      },
      { status: 400 }
    );
  }

  return null;
}

/**
 * Kết nối database (đã được cache, không cần lo lắng về performance)
 */
export async function ensureDBConnection() {
  await connectDB();
}
