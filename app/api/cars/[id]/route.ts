
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Params {
    params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        await dbConnect();
        const car = await Car.findById(id).populate('seller', 'name email');
        if (!car) {
            return NextResponse.json({ success: false, message: 'Car not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: car });
    } catch (error: any) {
        if (error.kind === 'ObjectId') {
             return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session?.user?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const car = await Car.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!car) {
            return NextResponse.json({ success: false, message: 'Car not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: car });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session?.user?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        await dbConnect();
        const deletedCar = await Car.findByIdAndDelete(id);
        if (!deletedCar) {
            return NextResponse.json({ success: false, message: 'Car not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
