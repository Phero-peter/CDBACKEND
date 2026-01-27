import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {

    const imagesDir = path.join(process.cwd(), 'public', 'imgs');
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] });
    }

    // Read directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => ({
        filename: file,
        url: `/imgs/${file}`,
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename));

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Error reading images:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
