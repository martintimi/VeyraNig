import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { normalizeVideoBuffer } from '@/lib/utils/videoUtils';

// Configure Cloudinary if environment variables are set
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read bytes
    const bytes = await file.arrayBuffer();
    let buffer: any = Buffer.from(bytes);

    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov');

    let mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

    if (isVideo) {
      const normalized = normalizeVideoBuffer(buffer, mimeType);
      buffer = normalized.buffer;
      mimeType = normalized.mimeType;
    }

    // 1. Cloudinary Upload (Direct high-speed CDN video streaming)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: isVideo ? 'video' : 'image',
            folder: 'veyra_drops',
            ...(isVideo ? { eager: [{ format: 'mp4', quality: 'auto' }] } : {}),
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url || uploadResult.url,
        publicId: uploadResult.public_id,
        fileName: file.name,
        fileSize: file.size,
      });
    }

    // 2. Fallback: Base64 data URL if Cloudinary keys are not yet added in .env.local
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error('Upload error in /api/upload:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
