import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireStaff();
    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await db.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value, group: 'general' },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Permission denied' }, { status: 403 });
  }
}
