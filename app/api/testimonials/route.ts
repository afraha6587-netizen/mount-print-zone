import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonialSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = testimonialSchema.parse(body);

    const testimonial = await db.testimonial.create({
      data: {
        customerName: parsed.customerName,
        review: parsed.review,
        rating: parsed.rating,
        photo: parsed.photo || null,
        isFeatured: true,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit review' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
