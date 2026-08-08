import fs from 'fs';
import path from 'path';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadFile(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const ext = path.extname(originalFilename).toLowerCase();
  const allowedExts = ['.pdf', '.ai', '.psd', '.cdr', '.png', '.jpg', '.jpeg', '.docx'];

  if (!allowedExts.includes(ext)) {
    throw new Error(`File type ${ext} is not supported. Allowed formats: PDF, AI, PSD, CDR, PNG, JPG, DOCX.`);
  }

  // If Cloudinary credentials are missing, fallback to local storage
  if (!cloudName || !apiKey || !apiSecret) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timeStamp = Date.now();
    const cleanName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timeStamp}_${cleanName}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, fileBuffer);

    return {
      url: `/uploads/${filename}`,
      filename: originalFilename,
      size: fileBuffer.length,
    };
  }

  // Cloudinary upload implementation
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)]);
  formData.append('file', blob, originalFilename);
  formData.append('upload_preset', 'mpz_preset');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    filename: originalFilename,
    size: fileBuffer.length,
  };
}
