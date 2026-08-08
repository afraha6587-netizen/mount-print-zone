import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function GET() {
  try {
    const items = await db.portfolioItem.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const item = await db.portfolioItem.create({
      data: {
        title: body.title,
        categoryId: body.categoryId,
        image: body.image,
        description: body.description || '',
        isFeatured: body.isFeatured ?? true,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create portfolio item' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const item = await db.portfolioItem.update({
      where: { id: body.id },
      data: {
        title: body.title,
        categoryId: body.categoryId,
        image: body.image,
        description: body.description,
        isFeatured: body.isFeatured,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update portfolio item' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireStaff();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Portfolio item ID required' }, { status: 400 });

    await db.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete portfolio item' }, { status: 400 });
  }
}
