import { NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const body = await request.json();
    await connectDB();

    const car = await Car.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error: any) {
    console.error('Update car error:', error);
    
    const validationError = handleValidationError(error);
    if (validationError) {
      return validationError;
    }

    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();
    const car = await Car.findByIdAndDelete(params.id);

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error: any) {
    console.error('Delete car error:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
