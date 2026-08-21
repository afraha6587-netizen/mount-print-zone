import fs from 'fs';
import path from 'path';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

const MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ai': 'application/postscript',
  '.psd': 'image/vnd.adobe.photoshop',
  '.cdr': 'application/x-coreldraw',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.dwg': 'image/vnd.dwg',
};

export async function uploadFile(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const ext = path.extname(originalFilename).toLowerCase();
  const mimeType = MIME_MAP[ext] || 'application/octet-stream';

  // 1. If Cloudinary credentials exist, try Cloudinary upload
  if (cloudName && apiKey && apiSecret) {
    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
      formData.append('file', blob, originalFilename);

      if (process.env.CLOUDINARY_UPLOAD_PRESET) {
        formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return {
            url: data.secure_url,
            filename: originalFilename,
            size: fileBuffer.length,
          };
        }
      }
    } catch (err) {
      console.warn('Cloudinary upload attempted but failed, falling back:', err);
    }
  }

  // 2. Try writing to local disk (for local development)
  try {
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
  } catch (localFsError) {
    console.warn('Local filesystem read-only or unwritable (Vercel serverless), falling back to Data URI storage:', localFsError);
  }

  // 3. Fallback for Vercel / Read-Only Serverless (Data URI storage)
  const base64Data = fileBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  return {
    url: dataUrl,
    filename: originalFilename,
    size: fileBuffer.length,
  };
}
