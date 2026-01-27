
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const cars = await Car.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cars });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session?.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    
    // @ts-ignore
    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const car = await Car.create({...body, seller: user._id});
    return NextResponse.json({ success: true, data: car }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
