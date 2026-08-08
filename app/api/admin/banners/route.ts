import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function GET() {
  try {
    const banners = await db.banner.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ banners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const banner = await db.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        link: body.link || '/services',
        isActive: body.isActive ?? true,
        order: body.order ? parseInt(body.order) : 1,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    const banner = await db.banner.update({
      where: { id: body.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        link: body.link,
        isActive: body.isActive,
        order: body.order ? parseInt(body.order) : 1,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update banner' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireStaff();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });

    await db.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete banner' }, { status: 400 });
  }
}
