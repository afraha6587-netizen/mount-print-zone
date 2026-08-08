import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const testimonial = await db.testimonial.update({
      where: { id: body.id },
      data: {
        isFeatured: body.isFeatured,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update review' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireStaff();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 });

    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 400 });
  }
}
