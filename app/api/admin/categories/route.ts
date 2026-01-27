import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - Lấy danh sách categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find()
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Tạo category mới
export async function POST(req: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const { name, description, image, parent, isActive, order } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Tên danh mục là bắt buộc' }, { status: 400 });
    }

    await connectDB();

    // Generate slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Danh mục đã tồn tại' }, { status: 400 });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parent: parent || null,
      isActive: isActive !== false,
      order: order || 0,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Tạo danh mục thành công',
      data: category 
    }, { status: 201 });
  } catch (error: any) {
    const validationError = handleValidationError(error);
    if (validationError) {
      return validationError;
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
