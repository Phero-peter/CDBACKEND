import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, handleValidationError } from '@/lib/api-helpers';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

interface Params {
  params: { id: string };
}

// GET - Lấy chi tiết category
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const category = await Category.findById(params.id).lean();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Cập nhật category
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const { name, description, image, parent, isActive, order } = await req.json();

    await connectDB();

    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Update slug if name changed
    if (name && name !== category.name) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existing = await Category.findOne({ slug, _id: { $ne: params.id } });
      if (existing) {
        return NextResponse.json({ error: 'Danh mục đã tồn tại' }, { status: 400 });
      }
      category.slug = slug;
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (parent !== undefined) category.parent = parent || null;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = order;

    await category.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Cập nhật danh mục thành công',
      data: category 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Xóa category
export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    await connectDB();

    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Xóa danh mục thành công' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
