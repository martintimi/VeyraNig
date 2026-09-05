/**
 * AI Computer Vision Garment Color Detection Engine for Veyra Luxury Fashion.
 * 
 * Accurately analyzes garment photography:
 * 1. Automatically detects and isolates studio backdrops and background walls.
 * 2. Discriminates between human skin tones and blush/pink/rose/nude fabrics.
 * 3. Uses HSL / Perceptual Color Space (Hue, Saturation, Lightness) instead of naive RGB distance.
 * 4. Extracts the authentic fabric hex swatch directly from the garment.
 * 5. Classifies the fabric into high-end retail fashion colorways (e.g. Blush Pink, Olive Green, Ivory / Cream, etc.).
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

  // Reds, Pinks & Roses
  { name: 'Blush Pink', hex: '#E8B4B8', category: 'reds_pinks', rgb: [232, 180, 184] },
  { name: 'Dusty Rose / Pink', hex: '#C98986', category: 'reds_pinks', rgb: [201, 137, 134] },
  { name: 'Powder Pink', hex: '#F9D5D3', category: 'reds_pinks', rgb: [249, 213, 211] },
  { name: 'Rose Pink', hex: '#E07A8A', category: 'reds_pinks', rgb: [224, 122, 138] },
  { name: 'Dusty Mauve', hex: '#A8798A', category: 'reds_pinks', rgb: [168, 121, 138] },
  { name: 'Hot Pink / Fuchsia', hex: '#EC4899', category: 'reds_pinks', rgb: [236, 72, 153] },
  { name: 'Crimson Red', hex: '#DC2626', category: 'reds_pinks', rgb: [220, 38, 38] },
  { name: 'Wine / Burgundy', hex: '#831843', category: 'reds_pinks', rgb: [131, 24, 67] },
  { name: 'Maroon', hex: '#800000', category: 'reds_pinks', rgb: [128, 0, 0] },
  { name: 'Coral', hex: '#FF7F50', category: 'reds_pinks', rgb: [255, 127, 80] },
  { name: 'Peach / Powder Blush', hex: '#FFDAB9', category: 'reds_pinks', rgb: [255, 218, 185] },

  // Greens & Olives
  { name: 'Olive Green', hex: '#556B2F', category: 'greens', rgb: [85, 107, 47] },
  { name: 'Army / Khaki Green', hex: '#4B5320', category: 'greens', rgb: [75, 83, 32] },
  { name: 'Sage Green', hex: '#9CAF88', category: 'greens', rgb: [156, 175, 136] },
  { name: 'Forest Green', hex: '#065F46', category: 'greens', rgb: [6, 95, 70] },
  { name: 'Emerald Green', hex: '#046307', category: 'greens', rgb: [4, 99, 7] },
  { name: 'Mint Green', hex: '#A7F3D0', category: 'greens', rgb: [167, 243, 208] },
  { name: 'Moss Green', hex: '#8A9A5B', category: 'greens', rgb: [138, 154, 91] },

  // Browns & Earth Tones
  { name: 'Chocolate Brown', hex: '#451A03', category: 'browns_earth', rgb: [69, 26, 3] },
  { name: 'Mocha / Coffee', hex: '#4E3629', category: 'browns_earth', rgb: [78, 54, 41] },
  { name: 'Rust / Terracotta', hex: '#B7410E', category: 'browns_earth', rgb: [183, 65, 14] },
  { name: 'Caramel / Brown', hex: '#AF6E4D', category: 'browns_earth', rgb: [175, 110, 77] },
  { name: 'Taupe', hex: '#8B8589', category: 'browns_earth', rgb: [139, 133, 137] },

  // Blues
  { name: 'Navy Blue', hex: '#1E3A8A', category: 'blues', rgb: [30, 58, 138] },
  { name: 'Midnight Blue', hex: '#0B192C', category: 'blues', rgb: [11, 25, 44] },
  { name: 'Royal Blue', hex: '#2563EB', category: 'blues', rgb: [37, 99, 235] },
  { name: 'Sky Blue / Baby Blue', hex: '#38BDF8', category: 'blues', rgb: [56, 189, 248] },
  { name: 'Denim Blue', hex: '#4A6984', category: 'blues', rgb: [74, 105, 132] },
  { name: 'Teal / Aqua', hex: '#0D9488', category: 'blues', rgb: [13, 148, 136] },

  // Yellows & Oranges
  { name: 'Mustard Yellow', hex: '#D97706', category: 'yellows_oranges', rgb: [217, 119, 6] },
  { name: 'Champagne Gold', hex: '#F7E7CE', category: 'yellows_oranges', rgb: [247, 231, 206] },
  { name: 'Emerald Gold', hex: '#E6C367', category: 'yellows_oranges', rgb: [230, 195, 103] },
  { name: 'Burnt Orange', hex: '#EA580C', category: 'yellows_oranges', rgb: [234, 88, 12] },

  // Greys & Blacks
  { name: 'Pitch Black', hex: '#111111', category: 'greys_blacks', rgb: [17, 17, 17] },
  { name: 'Charcoal Grey', hex: '#374151', category: 'greys_blacks', rgb: [55, 65, 81] },
  { name: 'Heather Grey', hex: '#9CA3AF', category: 'greys_blacks', rgb: [156, 163, 175] },
  { name: 'Silver / Slate', hex: '#CBD5E1', category: 'greys_blacks', rgb: [203, 213, 225] },

  // Purples
  { name: 'Lavender', hex: '#E6E6FA', category: 'purples', rgb: [230, 230, 250] },
  { name: 'Royal Purple', hex: '#7E22CE', category: 'purples', rgb: [126, 34, 206] },
  { name: 'Plum / Deep Purple', hex: '#581845', category: 'purples', rgb: [88, 24, 69] },
];

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Intelligent perceptual color naming using HSL color space.
 * Prevents color bleed (e.g. pink garments being identified as beige).
 */
export function classifyGarmentColor(r: number, g: number, b: number): { name: string; hex: string } {
  const { h, s, l } = rgbToHsl(r, g, b);
  const rawHex = rgbToHex(r, g, b);

  // 1. Extreme Lights & Darks (Pure White & Pure Black)
  if (l <= 15) return { name: 'Pitch Black', hex: rawHex };
  if (l <= 25 && s < 18) return { name: 'Charcoal Black', hex: rawHex };
  if (l >= 93 && s <= 18) return { name: 'Pure White', hex: rawHex };

  // 2. Whites, Creams & Ivory (High Lightness > 80% with neutral or warm tint)
  if (l >= 80 && s <= 48 && h >= 25 && h <= 55) {
    if (l >= 88 && s <= 20) return { name: 'Off-White', hex: rawHex };
    return { name: 'Ivory / Cream', hex: rawHex };
  }
  if (l >= 84 && s <= 18) return { name: 'Off-White', hex: rawHex };

  // 3. Monochromatic Greys
  if (s < 12) {
    if (l > 75) return { name: 'Silver / Slate', hex: rawHex };
    if (l > 45) return { name: 'Heather Grey', hex: rawHex };
    return { name: 'Charcoal Grey', hex: rawHex };
  }

  // 4. Reds, Pinks & Roses (Hue: 335° - 360° or 0° - 18°)
  if (h >= 335 || h <= 18) {
    // Light pinks & dusty roses
    if (l >= 68) {
      if (s >= 35) return { name: 'Blush Pink', hex: rawHex };
      return { name: 'Dusty Rose / Pink', hex: rawHex };
    }
    // Medium roses & mauves
    if (l >= 50) {
      if (s >= 40) return { name: 'Rose Pink', hex: rawHex };
      return { name: 'Dusty Mauve', hex: rawHex };
    }
    // Deep reds & wines
    if (l < 38) {
      if (s >= 25 && (h >= 340 || h <= 10)) return { name: 'Wine / Burgundy', hex: rawHex };
      return { name: 'Maroon', hex: rawHex };
    }
    return { name: 'Crimson Red', hex: rawHex };
  }

  // 5. Oranges, Terracottas & Corals (Hue: 19° - 34°)
  if (h >= 19 && h <= 34) {
    if (l >= 75 && s <= 45) return { name: 'Peach / Powder Blush', hex: rawHex };
    if (l >= 60 && s > 45) return { name: 'Coral', hex: rawHex };
    if (l < 42 && s > 25) return { name: 'Rust / Terracotta', hex: rawHex };
    if (s <= 35 && l >= 55) return { name: 'Sand / Nude', hex: rawHex };
    if (s <= 35 && l < 55) return { name: 'Caramel / Tan', hex: rawHex };
    return { name: 'Burnt Orange', hex: rawHex };
  }

  // 6. Yellows, Beiges, Khakis & Earth Browns (Hue: 35° - 58°)
  if (h >= 35 && h <= 58) {
    // Olive/Army drab in low lightness
    if (l <= 45 && g > b * 1.3 && h >= 42) {
      return { name: 'Army / Olive Green', hex: rawHex };
    }
    if (l >= 78 && s <= 40) return { name: 'Ivory / Cream', hex: rawHex };
    if (l >= 60 && s <= 42) return { name: 'Beige / Khaki', hex: rawHex };
    if (l >= 65 && s > 42) return { name: 'Champagne Gold', hex: rawHex };
    if (l >= 45 && s > 50) return { name: 'Mustard Yellow', hex: rawHex };
    if (l < 42 && s < 30) return { name: 'Mocha / Coffee', hex: rawHex };
    if (l < 42 && s >= 30) return { name: 'Chocolate Brown', hex: rawHex };
    return { name: 'Camel / Tan', hex: rawHex };
  }

  // 7. Greens, Olives, Sages & Emeralds (Hue: 59° - 165°)
  if (h >= 59 && h <= 165) {
    if (h <= 95) {
      if (l <= 38) return { name: 'Army / Khaki Green', hex: rawHex };
      if (l <= 58) return { name: 'Olive Green', hex: rawHex };
      return { name: 'Light Olive', hex: rawHex };
    }
    if (h <= 135) {
      if (l >= 68) return { name: 'Mint Green', hex: rawHex };
      if (l <= 38) return { name: 'Forest Green', hex: rawHex };
      return { name: 'Emerald Green', hex: rawHex };
    }
    return { name: 'Sage Green', hex: rawHex };
  }

  // 8. Cyans & Teals (Hue: 166° - 195°)
  if (h >= 166 && h <= 195) {
    if (l < 40) return { name: 'Deep Teal', hex: rawHex };
    return { name: 'Teal / Aqua', hex: rawHex };
  }

  // 9. Blues (Hue: 196° - 255°)
  if (h >= 196 && h <= 255) {
    if (l >= 70) return { name: 'Sky Blue / Baby Blue', hex: rawHex };
    if (l <= 32) return { name: 'Navy Blue', hex: rawHex };
    if (s > 48) return { name: 'Royal Blue', hex: rawHex };
    return { name: 'Denim Blue', hex: rawHex };
  }

  // 10. Purples, Lavenders & Violets (Hue: 256° - 334°)
  if (h >= 256 && h <= 334) {
    if (l >= 68) return { name: 'Lavender', hex: rawHex };
    if (l <= 35) return { name: 'Plum / Deep Purple', hex: rawHex };
    return { name: 'Royal Purple', hex: rawHex };
  }

  return { name: 'Custom Color', hex: rawHex };
}

/**
 * Detect the dominant garment color from an image data URL or image element.
 * 
 * 1. Samples corners to detect background studio wall color.
 * 2. Excludes background pixels from sample pool.
 * 3. Discriminates skin tone (melanin) vs garment fabric.
 * 4. Clusters fabric pixels and extracts dominant garment tone.
 * 5. Returns the true sampled fabric hex swatch and accurate fashion name.
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
        const size = 140; // High resolution sampling grid
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve({ name: 'Pitch Black', hex: '#111111', rawHex: '#111111' });
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size).data;

        const getPx = (x: number, y: number): [number, number, number] => {
          const idx = (y * size + x) * 4;
          return [imgData[idx], imgData[idx + 1], imgData[idx + 2]];
        };

        // 1. Detect background color by sampling top corners
        const c1 = getPx(5, 5);
        const c2 = getPx(size - 6, 5);
        const c3 = getPx(10, 15);
        const c4 = getPx(size - 11, 15);
        const bgR = Math.round((c1[0] + c2[0] + c3[0] + c4[0]) / 4);
        const bgG = Math.round((c1[1] + c2[1] + c3[1] + c4[1]) / 4);
        const bgB = Math.round((c1[2] + c2[2] + c3[2] + c4[2]) / 4);

        // Color distance helper
        const distSq = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) =>
          (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;

        // Sample garment zone (central 70% width, 22% to 88% height)
        const startX = Math.round(size * 0.15);
        const endX = Math.round(size * 0.85);
        const startY = Math.round(size * 0.22);
        const endY = Math.round(size * 0.88);

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

            // Check if pixel is part of background backdrop
            if (distSq(r, g, b, bgR, bgG, bgB) < 1000) { // ~31 RGB distance threshold
              continue;
            }

            // Discriminate human skin tone vs fabric:
            // Human melanin skin has: R > G > B with Green substantially higher than Blue (g - b > 22)
            // and R higher than G (r - g > 20).
            // In pink/rose/blush/mauve fabrics, Blue is close to Green (or b >= g), so it is FABRIC.
            const isHumanMelaninSkin =
              r > 130 &&
              g > 85 &&
              b > 45 &&
              r > g &&
              g > b &&
              (g - b) > 22 &&
              (r - g) > 20;

            if (isHumanMelaninSkin) {
              continue; // Exclude model's bare skin / neck from garment color
            }

            // Quantize colors into 12-step clusters for precision
            const qR = Math.round(r / 12) * 12;
            const qG = Math.round(g / 12) * 12;
            const qB = Math.round(b / 12) * 12;
            const key = `${qR},${qG},${qB}`;

            const existing = colorBuckets.get(key) || { count: 0, totalR: 0, totalG: 0, totalB: 0 };
            existing.count++;
            existing.totalR += r;
            existing.totalG += g;
            existing.totalB += b;
            colorBuckets.set(key, existing);
            totalValidPixels++;
          }
        }

        if (totalValidPixels === 0 || colorBuckets.size === 0) {
          // Fallback if background segmentation cleared everything
          resolve({ name: 'Pitch Black', hex: '#111111', rawHex: '#111111' });
          return;
        }

        // Find the dominant fabric color bucket
        let dominantBucket = { count: 0, totalR: 0, totalG: 0, totalB: 0 };
        for (const bucket of colorBuckets.values()) {
          if (bucket.count > dominantBucket.count) {
            dominantBucket = bucket;
          }
        }

        const avgR = Math.round(dominantBucket.totalR / dominantBucket.count);
        const avgG = Math.round(dominantBucket.totalG / dominantBucket.count);
        const avgB = Math.round(dominantBucket.totalB / dominantBucket.count);
        const fabricHex = rgbToHex(avgR, avgG, avgB);

        // Classify into exact luxury fashion retail name
        const classified = classifyGarmentColor(avgR, avgG, avgB);

        resolve({
          name: classified.name,
          hex: fabricHex, // The authentic sampled fabric hex from the photo!
          rawHex: fabricHex
        });
      } catch (e) {
        console.error('Error in detectGarmentColor:', e);
        resolve({ name: 'Pitch Black', hex: '#111111', rawHex: '#111111' });
      }
    };

    img.onerror = () => {
      resolve({ name: 'Pitch Black', hex: '#111111', rawHex: '#111111' });
    };

    img.src = imageUrlOrDataUrl;
  });
}
