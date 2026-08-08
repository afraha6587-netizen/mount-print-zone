import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function GET() {
  try {
    const offers = await db.offer.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const offer = await db.offer.create({
      data: {
        code: body.code.toUpperCase().trim(),
        title: body.title,
        discountPercent: parseFloat(body.discountPercent),
        minOrderValue: body.minOrderValue ? parseFloat(body.minOrderValue) : 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create coupon' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const offer = await db.offer.update({
      where: { id: body.id },
      data: {
        code: body.code.toUpperCase().trim(),
        title: body.title,
        discountPercent: parseFloat(body.discountPercent),
        minOrderValue: body.minOrderValue ? parseFloat(body.minOrderValue) : 0,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update coupon' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireStaff();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });

    await db.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete coupon' }, { status: 400 });
  }
}
