import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Car from '@/models/Car';

// GET - Lấy giỏ hàng của user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let cart = await Cart.findOne({ user: session.user.id })
      .populate('items.car', 'brand model year price images slug');

    if (!cart) {
      cart = await Cart.create({ user: session.user.id, items: [] });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Thêm sản phẩm vào giỏ hàng
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { carId, quantity = 1 } = await req.json();

    if (!carId) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.car.toString() === carId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        car: carId,
        quantity,
        price: car.price,
      });
    }

    await cart.save();

    // Populate and return
    await cart.populate('items.car', 'brand model year price images slug');

    return NextResponse.json({ 
      success: true, 
      message: 'Đã thêm vào giỏ hàng',
      data: cart 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Cập nhật số lượng sản phẩm
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { carId, quantity } = await req.json();

    if (!carId || quantity === undefined) {
      return NextResponse.json({ error: 'Car ID and quantity are required' }, { status: 400 });
    }

    await connectDB();

    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.car.toString() === carId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.car', 'brand model year price images slug');

    return NextResponse.json({ 
      success: true, 
      message: 'Đã cập nhật giỏ hàng',
      data: cart 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const carId = searchParams.get('carId');

    if (!carId) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    await connectDB();

    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item: any) => item.car.toString() !== carId
    );

    await cart.save();
    await cart.populate('items.car', 'brand model year price images slug');

    return NextResponse.json({ 
      success: true, 
      message: 'Đã xóa khỏi giỏ hàng',
      data: cart 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
