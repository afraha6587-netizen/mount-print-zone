import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const service = await db.service.create({
      data: {
        name: body.name,
        slug: body.slug,
        categoryId: body.categoryId,
        description: body.description,
        basePrice: parseFloat(body.basePrice),
        discountPercent: parseFloat(body.discountPercent || '0'),
        estimatedDelivery: body.estimatedDelivery,
        isFeatured: Boolean(body.isFeatured),
        isHidden: Boolean(body.isHidden),
        image: body.image || null,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;

    const service = await db.service.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        basePrice: parseFloat(data.basePrice),
        discountPercent: parseFloat(data.discountPercent || '0'),
        estimatedDelivery: data.estimatedDelivery,
        isFeatured: Boolean(data.isFeatured),
        isHidden: Boolean(data.isHidden),
        image: data.image || null,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
