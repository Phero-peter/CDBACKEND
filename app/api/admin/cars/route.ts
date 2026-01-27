import { NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import mongoose from 'mongoose';

export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();
    const cars = await Car.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(cars);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const body = await request.json();
    await connectDB();

    // Validate required fields (images is optional)
    const requiredFields = ['brand', 'model', 'year', 'price', 'mileage', 'fuelType', 'transmission', 'color', 'condition', 'description', 'location'];
    const missingFields = requiredFields.filter(field => {
      if (field === 'location') {
        return !body.location?.province || !body.location?.city;
      }
      return !body[field];
    });

    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Thiếu các trường bắt buộc',
          missingFields,
          message: `Các trường bắt buộc: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = `${body.brand}-${body.model}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    console.log('Generated slug:', slug);

    // Ensure seller is set correctly and convert to ObjectId
    const sellerId = body.seller || authResult.session.user?.id;
    if (!sellerId) {
      console.error('No seller ID found');
      return NextResponse.json(
        { error: 'Không tìm thấy thông tin người bán' },
        { status: 400 }
      );
    }

    // Validate and convert seller ID to ObjectId
    let sellerObjectId;
    try {
      sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    } catch (err) {
      console.error('Invalid seller ID format:', sellerId);
      return NextResponse.json(
        { error: 'ID người bán không hợp lệ' },
        { status: 400 }
      );
    }

    // Prepare car data with proper types
    const carData = {
      brand: String(body.brand).trim(),
      model: String(body.model).trim(),
      year: parseInt(String(body.year), 10),
      price: parseInt(String(body.price), 10),
      mileage: parseInt(String(body.mileage), 10) || 0,
      fuelType: String(body.fuelType),
      transmission: String(body.transmission),
      color: String(body.color).trim(),
      condition: String(body.condition),
      description: String(body.description).trim(),
      location: {
        province: String(body.location.province).trim(),
        city: String(body.location.city).trim(),
      },
      images: Array.isArray(body.images) ? body.images.filter(img => img && img.trim()) : [],
      slug,
      seller: sellerObjectId,
      status: body.status || 'approved',
    };

    // Validate numeric fields
    if (isNaN(carData.year) || carData.year < 1900 || carData.year > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Năm sản xuất không hợp lệ' },
        { status: 400 }
      );
    }

    if (isNaN(carData.price) || carData.price < 0) {
      return NextResponse.json(
        { error: 'Giá không hợp lệ' },
        { status: 400 }
      );
    }

    if (isNaN(carData.mileage) || carData.mileage < 0) {
      return NextResponse.json(
        { error: 'Số km không hợp lệ' },
        { status: 400 }
      );
    }

    console.log('Creating car with data:', JSON.stringify(carData, null, 2));

    const car = await Car.create(carData);
    console.log('Car created successfully:', car._id);

    return NextResponse.json(car, { status: 201 });
  } catch (error: any) {
    console.error('Create car error:', error);
    
    const validationError = handleValidationError(error);
    if (validationError) {
      return validationError;
    }

    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra', details: error.toString() },
      { status: 500 }
    );
  }
}


