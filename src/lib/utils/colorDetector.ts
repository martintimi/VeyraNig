/**
 * AI Computer Vision Color Detector for Boutique Fashion.
 * Analyzes uploaded garment photos using in-memory canvas pixel sampling
 * and clustering, matching dominant garment tones to a luxury fashion palette.
 * Works 100% locally with 0ms latency and no external API keys required!
 */

export interface FashionColor {
  name: string;
  hex: string;
  category: 'whites_creams' | 'greens' | 'blues' | 'reds_pinks' | 'yellows_oranges' | 'browns_earth' | 'greys_blacks' | 'purples';
  rgb: [number, number, number];
}

export const FASHION_COLOR_PALETTE: FashionColor[] = [
  // Whites, Creams & Neutrals
  { name: 'Ivory / Cream', hex: '#FAF5EF', category: 'whites_creams', rgb: [250, 245, 239] },
  { name: 'Off-White', hex: '#F5F5F0', category: 'whites_creams', rgb: [245, 245, 240] },
  { name: 'Pure White', hex: '#FFFFFF', category: 'whites_creams', rgb: [255, 255, 255] },
  { name: 'Beige / Khaki', hex: '#D4B996', category: 'whites_creams', rgb: [212, 185, 150] },
  { name: 'Sand / Nude', hex: '#E5D6C5', category: 'whites_creams', rgb: [229, 214, 197] },
  { name: 'Camel / Tan', hex: '#C19A6B', category: 'whites_creams', rgb: [193, 154, 107] },

  // Greens
  { name: 'Olive Green', hex: '#556B2F', category: 'greens', rgb: [85, 107, 47] },
  { name: 'Army / Khaki Green', hex: '#4B5320', category: 'greens', rgb: [75, 83, 32] },
  { name: 'Sage Green', hex: '#9CAF88', category: 'greens', rgb: [156, 175, 136] },
  { name: 'Forest Green', hex: '#065F46', category: 'greens', rgb: [6, 95, 70] },
  { name: 'Emerald Green', hex: '#046307', category: 'greens', rgb: [4, 99, 7] },
  { name: 'Mint Green', hex: '#A7F3D0', category: 'greens', rgb: [167, 243, 208] },
  { name: 'Pistachio', hex: '#93C572', category: 'greens', rgb: [147, 197, 114] },
  { name: 'Moss Green', hex: '#8A9A5B', category: 'greens', rgb: [138, 154, 91] },

  // Browns & Earth Tones
  { name: 'Chocolate Brown', hex: '#451A03', category: 'browns_earth', rgb: [69, 26, 3] },
  { name: 'Mocha / Coffee', hex: '#4E3629', category: 'browns_earth', rgb: [78, 54, 41] },
  { name: 'Rust / Terracotta', hex: '#B7410E', category: 'browns_earth', rgb: [183, 65, 14] },
  { name: 'Caramel', hex: '#AF6E4D', category: 'browns_earth', rgb: [175, 110, 77] },
  { name: 'Taupe', hex: '#8B8589', category: 'browns_earth', rgb: [139, 133, 137] },

  // Blues
  { name: 'Navy Blue', hex: '#1E3A8A', category: 'blues', rgb: [30, 58, 138] },
  { name: 'Midnight Blue', hex: '#0B192C', category: 'blues', rgb: [11, 25, 44] },
  { name: 'Royal Blue', hex: '#2563EB', category: 'blues', rgb: [37, 99, 235] },
  { name: 'Sky Blue', hex: '#38BDF8', category: 'blues', rgb: [56, 189, 248] },
  { name: 'Denim Blue', hex: '#4A6984', category: 'blues', rgb: [74, 105, 132] },
  { name: 'Teal / Cyan', hex: '#0D9488', category: 'blues', rgb: [13, 148, 136] },

  // Reds, Pinks & Wines
  { name: 'Crimson Red', hex: '#DC2626', category: 'reds_pinks', rgb: [220, 38, 38] },
  { name: 'Wine / Burgundy', hex: '#831843', category: 'reds_pinks', rgb: [131, 24, 67] },
  { name: 'Maroon', hex: '#800000', category: 'reds_pinks', rgb: [128, 0, 0] },
  { name: 'Dusty Rose / Mauve', hex: '#C98986', category: 'reds_pinks', rgb: [201, 137, 134] },
  { name: 'Blush Pink', hex: '#F472B6', category: 'reds_pinks', rgb: [244, 114, 182] },
  { name: 'Coral', hex: '#FF7F50', category: 'reds_pinks', rgb: [255, 127, 80] },

  // Yellows & Oranges
  { name: 'Mustard Yellow', hex: '#D97706', category: 'yellows_oranges', rgb: [217, 119, 6] },
  { name: 'Vibrant Orange', hex: '#EA580C', category: 'yellows_oranges', rgb: [234, 88, 12] },
  { name: 'Emerald Gold', hex: '#E6C367', category: 'yellows_oranges', rgb: [230, 195, 103] },
  { name: 'Champagne Gold', hex: '#F7E7CE', category: 'yellows_oranges', rgb: [247, 231, 206] },

  // Greys & Blacks
  { name: 'Pitch Black', hex: '#111111', category: 'greys_blacks', rgb: [17, 17, 17] },
  { name: 'Charcoal Grey', hex: '#374151', category: 'greys_blacks', rgb: [55, 65, 81] },
  { name: 'Heather Grey', hex: '#9CA3AF', category: 'greys_blacks', rgb: [156, 163, 175] },
  { name: 'Silver / Slate', hex: '#CBD5E1', category: 'greys_blacks', rgb: [203, 213, 225] },

  // Purples
  { name: 'Lavender', hex: '#E6E6FA', category: 'purples', rgb: [230, 230, 250] },
  { name: 'Royal Purple', hex: '#7E22CE', category: 'purples', rgb: [126, 34, 206] },
  { name: 'Plum', hex: '#581845', category: 'purples', rgb: [88, 24, 69] },
];

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

/**
 * Perceptual color distance metric (Redmean algorithm)
 * Significantly more accurate for human color perception than naive Euclidean distance
 */
export function perceptualColorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const rmean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((((512 + rmean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rmean) * db * db) >> 8));
}

/**
 * Find the best matching fashion color name and palette hex code
 */
export function matchFashionColor(r: number, g: number, b: number): { name: string; hex: string } {
  let bestMatch = FASHION_COLOR_PALETTE[0];
  let minDistance = Infinity;

  for (const color of FASHION_COLOR_PALETTE) {
    const dist = perceptualColorDistance(r, g, b, color.rgb[0], color.rgb[1], color.rgb[2]);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = color;
    }
  }

  return { name: bestMatch.name, hex: bestMatch.hex };
}

/**
 * Detect the dominant garment color from an image data URL or image element.
 * Samples the central garment zone and returns { name, hex, rawHex }
 */
export async function detectGarmentColor(
  imageUrlOrDataUrl: string
): Promise<{ name: string; hex: string; rawHex: string }> {
  if (typeof window === 'undefined') {
    return { name: 'Ivory / Cream', hex: '#FAF5EF', rawHex: '#FAF5EF' };
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 120; // 120x120 is plenty for sampling and executes in ~2ms
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve({ name: 'Black', hex: '#111111', rawHex: '#111111' });
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);

        // Sample garment zone (focus on central 60% of the image)
        const startX = Math.round(size * 0.2);
        const endX = Math.round(size * 0.8);
        const startY = Math.round(size * 0.25);
        const endY = Math.round(size * 0.85);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        const colorBuckets = new Map<string, { count: number; totalR: number; totalG: number; totalB: number }>();

        let totalValidPixels = 0;

        for (let y = startY; y < endY; y += 2) {
          for (let x = startX; x < endX; x += 2) {
            const idx = (y * size + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const a = imgData[idx + 3];

            if (a < 128) continue; // transparent

            // Check if human skin tone
            const isSkin =
              r > 120 &&
              g > 70 &&
              b > 40 &&
              r > g &&
              g > b &&
              r - g > 15 &&
              r - b > 25;

            // Quantize colors into 16-step clusters
            const qR = Math.round(r / 16) * 16;
            const qG = Math.round(g / 16) * 16;
            const qB = Math.round(b / 16) * 16;
            const key = `${qR},${qG},${qB}`;

            // Weight skin tone pixels lower so garment fabric dominates
            const weight = isSkin ? 0.2 : 1.0;

            const existing = colorBuckets.get(key) || { count: 0, totalR: 0, totalG: 0, totalB: 0 };
            existing.count += weight;
            existing.totalR += r * weight;
            existing.totalG += g * weight;
            existing.totalB += b * weight;
            colorBuckets.set(key, existing);
            totalValidPixels++;
          }
        }

        if (totalValidPixels === 0 || colorBuckets.size === 0) {
          resolve({ name: 'Black', hex: '#111111', rawHex: '#111111' });
          return;
        }

        // Find the dominant color bucket
        let dominantBucket = { count: 0, totalR: 0, totalG: 0, totalB: 0 };
        for (const bucket of colorBuckets.values()) {
          if (bucket.count > dominantBucket.count) {
            dominantBucket = bucket;
          }
        }

        const avgR = Math.round(dominantBucket.totalR / dominantBucket.count);
        const avgG = Math.round(dominantBucket.totalG / dominantBucket.count);
        const avgB = Math.round(dominantBucket.totalB / dominantBucket.count);
        const rawHex = rgbToHex(avgR, avgG, avgB);

        const matched = matchFashionColor(avgR, avgG, avgB);

        resolve({
          name: matched.name,
          hex: matched.hex,
          rawHex: rawHex
        });
      } catch (e) {
        console.error('Error in detectGarmentColor:', e);
        resolve({ name: 'Black', hex: '#111111', rawHex: '#111111' });
      }
    };

    img.onerror = () => {
      resolve({ name: 'Black', hex: '#111111', rawHex: '#111111' });
    };

    img.src = imageUrlOrDataUrl;
  });
}
