import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file selected for upload' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadFile(buffer, file.name);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      filename: uploadResult.filename,
      size: uploadResult.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 400 }
    );
  }
}
