import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Car from '@/models/Car';
import { formatPrice } from '@/lib/utils';

// GET - Lấy danh sách đơn hàng của user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Tạo đơn hàng mới
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shippingAddress, paymentMethod, notes } = await req.json();

    // Validate shipping address
    if (!shippingAddress?.fullName || !shippingAddress?.phone || 
        !shippingAddress?.address || !shippingAddress?.province || !shippingAddress?.city) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin giao hàng' }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Vui lòng chọn phương thức thanh toán' }, { status: 400 });
    }

    await connectDB();

    // Get cart
    const cart = await Cart.findOne({ user: session.user.id }).populate('items.car');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 });
    }

    // Build order items with car snapshots
    const orderItems = cart.items.map((item: any) => ({
      car: item.car._id,
      quantity: item.quantity,
      price: item.price,
      carSnapshot: {
        brand: item.car.brand,
        model: item.car.model,
        year: item.car.year,
        image: item.car.images?.[0] || '',
      },
    }));

    // Create order
    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    // TODO: Send confirmation email
    // const user = await User.findById(session.user.id);
    // await sendEmail({
    //   to: user.email,
    //   subject: `Xác nhận đơn hàng #${order.orderNumber}`,
    //   html: generateOrderConfirmationEmail(user.name, order.orderNumber, formatPrice(order.totalAmount)),
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'Đặt hàng thành công',
      data: order 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
