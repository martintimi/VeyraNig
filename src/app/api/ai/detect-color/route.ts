import { NextResponse } from 'next/server';
import { classifyGarmentColor } from '@/lib/utils/colorDetector';

export async function POST(request: Request) {
  try {
    const { imageUrl, r, g, b } = await request.json();

    // 1. If Gemini Vision API key is configured, use Gemini 1.5 Flash Vision Multimodal AI
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiApiKey && imageUrl) {
      try {
        let imagePart: any = null;
        if (imageUrl.startsWith('data:image')) {
          const [mimeTypePart, base64Data] = imageUrl.split(';base64,');
          const mimeType = mimeTypePart.replace('data:', '');
          imagePart = { inlineData: { mimeType, data: base64Data } };
        } else if (imageUrl.startsWith('http')) {
          const imgRes = await fetch(imageUrl);
          const buf = await imgRes.arrayBuffer();
          const base64 = Buffer.from(buf).toString('base64');
          const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
          imagePart = { inlineData: { mimeType: contentType, data: base64 } };
        }

        if (imagePart) {
          const prompt = `You are a high-end fashion colorist and apparel merchandiser.
Analyze the garment shown in this photo (ignore the background wall and the model's skin).
What is the primary garment colorway in retail fashion terminology? (e.g. "Blush Pink", "Dusty Rose", "Olive Green", "Ivory / Cream", "Wine / Burgundy", "Navy Blue", "Mustard Yellow", etc.)
Also provide the closest hex color code for this garment fabric.

Return ONLY valid JSON:
{
  "name": "Blush Pink",
  "hex": "#E8B4B8"
}`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, imagePart] }],
                generationConfig: { responseMimeType: 'application/json' }
              })
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              if (parsed.name && parsed.hex) {
                return NextResponse.json({
                  success: true,
                  source: 'gemini-vision',
                  name: parsed.name,
                  hex: parsed.hex
                });
              }
            }
          }
        }
      } catch (e) {
        console.warn('Gemini color detection fallback to HSL engine:', e);
      }
    }

    // 2. High-precision HSL Computer Vision Engine fallback
    if (r !== undefined && g !== undefined && b !== undefined) {
      const result = classifyGarmentColor(Number(r), Number(g), Number(b));
      return NextResponse.json({
        success: true,
        source: 'hsl-vision-engine',
        name: result.name,
        hex: result.hex
      });
    }

    return NextResponse.json({ success: false, error: 'Insufficient data for color detection' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
