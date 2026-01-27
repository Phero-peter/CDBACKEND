import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ isAdmin: false });
    }

    const isAdmin = session.user?.role === 'admin';
    
    return NextResponse.json({ 
      isAdmin,
      userId: session.user?.id,
      name: session.user?.name,
      email: session.user?.email,
    });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
