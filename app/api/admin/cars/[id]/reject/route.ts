import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    await connectDB();
    const car = await Car.findByIdAndUpdate(
      params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}


