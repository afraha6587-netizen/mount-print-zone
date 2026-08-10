import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role === 'ADMIN' ? 'ADMIN' : 'STAFF',
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ error: 'User ID and new password are required' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await db.user.update({
      where: { id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update password' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 400 });
  }
}
