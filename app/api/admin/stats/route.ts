import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    await connectDB();

    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCars, 
      pendingCars, 
      approvedCars, 
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      revenueResult,
      monthlyRevenueResult,
      monthlyOrders,
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'pending' }),
      Car.countDocuments({ status: 'approved' }),
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: monthStart } }),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    return NextResponse.json({
      totalCars,
      pendingCars,
      approvedCars,
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      monthlyRevenue,
      monthlyOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}


