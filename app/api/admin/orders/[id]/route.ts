import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

interface Params {
  params: { id: string };
}

// GET - Lấy chi tiết order
export async function GET(req: NextRequest, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    await connectDB();

    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Cập nhật trạng thái order
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const { status, paymentStatus, notes } = await req.json();

    await connectDB();

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Xóa order
export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    await connectDB();

    const order = await Order.findByIdAndDelete(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa đơn hàng thành công',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
