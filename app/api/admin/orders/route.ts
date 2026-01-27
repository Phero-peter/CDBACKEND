import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getPaginationParams, createPaginationResult } from '@/lib/pagination';

// GET - Lấy danh sách orders (admin)
export async function GET(req: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    await connectDB();

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const { currentPage, itemsPerPage, skip } = getPaginationParams({ page, limit });

    const [orders, totalItems] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      Order.countDocuments(query),
    ]);

    const result = createPaginationResult(orders, totalItems, currentPage, itemsPerPage);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
