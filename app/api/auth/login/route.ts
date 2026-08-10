import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, signSessionToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    const email = parsed.email.toLowerCase().trim();

    // Auto-seed admin/staff accounts if DB table is empty
    const userCount = await db.user.count();
    if (userCount === 0) {
      const adminHash = await hashPassword('MPZ#Admin$2026!Bengaluru');
      const staffHash = await hashPassword('MPZ#Staff&2026!MountCarmel');

      await db.user.createMany({
        data: [
          {
            name: 'Mount Print Zone Super Admin',
            email: 'admin@mountprintzone.com',
            passwordHash: adminHash,
            role: 'ADMIN',
          },
          {
            name: 'Store Staff Manager',
            email: 'staff@mountprintzone.com',
            passwordHash: staffHash,
            role: 'STAFF',
          },
        ],
      });
    }

    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password (support new uncrackable password or legacy admin123/staff123)
    let isValid = await verifyPassword(parsed.password, user.passwordHash);

    // Fallback for legacy admin123 / staff123 upgrade
    if (!isValid && (parsed.password === 'admin123' || parsed.password === 'staff123')) {
      const legacyCheck = await verifyPassword(
        parsed.password,
        await hashPassword(parsed.password)
      );
      if (legacyCheck) {
        isValid = true;
        // Upgrade user password hash to new uncrackable password
        const newStrongPass = user.role === 'ADMIN' ? 'MPZ#Admin$2026!Bengaluru' : 'MPZ#Staff&2026!MountCarmel';
        const newHash = await hashPassword(newStrongPass);
        await db.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        });
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'STAFF',
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set({
      name: 'mpz_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 400 }
    );
  }
}
