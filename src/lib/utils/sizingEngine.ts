import { BodyProfile, FitMatchResult, Product } from '@/types';

export function calculateFitMatch(profile?: BodyProfile, product?: Product): FitMatchResult {
  if (!product) {
    return {
      recommendedSize: 'M',
      matchScore: 92,
      fitLabel: 'Perfect Bespoke Match',
      insights: ['Perfect fit for standard silhouette', 'Tailored drape compatible with Nigerian proportions'],
    };
  }

  const sizeChart = product.sizeChart || {};
  const availableSizes = Object.keys(sizeChart);

  if (!availableSizes.length) {
    const fallbackSize = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : 'M';
    return {
      recommendedSize: fallbackSize,
      matchScore: 94,
      fitLabel: 'Perfect Bespoke Match',
      insights: ['Tailored true to size', 'Compatible with standard Nigerian silhouette proportions'],
    };
  }

  let bestSize = availableSizes[0];
  let highestScore = -1;
  let bestInsights = {
    chest: 'perfect' as 'tight' | 'perfect' | 'loose',
    waist: 'perfect' as 'tight' | 'perfect' | 'loose',
    hips: 'perfect' as 'tight' | 'perfect' | 'loose',
    length: 'perfect' as 'short' | 'perfect' | 'long',
  };

  const safeProfile = profile || {
    name: 'default',
    heightCm: 178,
    weightKg: 75,
    gender: 'male' as const,
    bodyShape: 'athletic' as const,
    fitPreference: 'regular' as const,
    avatarStyle: 'minimal_editorial' as const,
    skinTone: 'deep' as const,
    skinToneHex: '#8B4513',
    hairStyle: 'high_fade' as const,
    hairColor: '#000000',
    facialHair: 'clean' as const,
    avatarDisplayMode: 'bitmoji' as const,
    chestCm: 100,
    waistCm: 84,
    hipsCm: 104,
    shoulderWidthCm: 45,
    inseamCm: 81,
    twinId: '',
    isInitialized: false,
  };

  // Preference multiplier
  const prefMultiplier = safeProfile.fitPreference === 'skinny' ? -2 
    : safeProfile.fitPreference === 'relaxed' ? 2 
    : safeProfile.fitPreference === 'oversized' ? 4 
    : 0;

  for (const size of availableSizes) {
    const specs = sizeChart[size];
    let dimensionScores: number[] = [];

    // Chest check
    if (specs.chest) {
      const [min, max] = specs.chest;
      const target = safeProfile.chestCm - prefMultiplier;
      if (target >= min && target <= max) {
        dimensionScores.push(100);
      } else if (target < min) {
        const diff = min - target;
        dimensionScores.push(Math.max(60, 100 - diff * 4));
        if (diff > 4) bestInsights.chest = 'loose';
      } else {
        const diff = target - max;
        dimensionScores.push(Math.max(50, 100 - diff * 6));
        if (diff > 3) bestInsights.chest = 'tight';
      }
    }

    // Waist check
    if (specs.waist) {
      const [min, max] = specs.waist;
      const target = safeProfile.waistCm - prefMultiplier;
      if (target >= min && target <= max) {
        dimensionScores.push(100);
      } else if (target < min) {
        const diff = min - target;
        dimensionScores.push(Math.max(60, 100 - diff * 4));
        if (diff > 4) bestInsights.waist = 'loose';
      } else {
        const diff = target - max;
        dimensionScores.push(Math.max(50, 100 - diff * 6));
        if (diff > 3) bestInsights.waist = 'tight';
      }
    }

    // Hips check
    if (specs.hips) {
      const [min, max] = specs.hips;
      const target = safeProfile.hipsCm - prefMultiplier;
      if (target >= min && target <= max) {
        dimensionScores.push(100);
      } else if (target < min) {
        const diff = min - target;
        dimensionScores.push(Math.max(65, 100 - diff * 3));
        if (diff > 4) bestInsights.hips = 'loose';
      } else {
        const diff = target - max;
        dimensionScores.push(Math.max(55, 100 - diff * 5));
        if (diff > 3) bestInsights.hips = 'tight';
      }
    }

    // Shoulder / Inseam checks if applicable
    if (specs.shoulder) {
      const [min, max] = specs.shoulder;
      if (safeProfile.shoulderWidthCm >= min && safeProfile.shoulderWidthCm <= max) {
        dimensionScores.push(100);
      } else {
        dimensionScores.push(85);
      }
    }

    const avgScore = dimensionScores.length
      ? Math.round(dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length)
      : 90;

    if (avgScore > highestScore) {
      highestScore = avgScore;
      bestSize = size;
    }
  }

  // Adjust display score based on body shape nuance
  let adjustedScore = Math.min(99, Math.max(78, highestScore));
  let fitLabel: 'Perfect Bespoke Match' | 'Slightly Snug' | 'Relaxed Drape' | 'Check Alterations' = 'Perfect Bespoke Match';
  
  if (adjustedScore >= 93) {
    fitLabel = 'Perfect Bespoke Match';
  } else if (adjustedScore >= 85) {
    if (safeProfile.fitPreference === 'skinny' || bestInsights.waist === 'tight' || bestInsights.chest === 'tight') {
      fitLabel = 'Slightly Snug';
    } else {
      fitLabel = 'Relaxed Drape';
    }
  } else {
    fitLabel = 'Check Alterations';
  }

  const insightMessages: string[] = [];
  if (bestInsights.chest === 'tight') insightMessages.push('Chest runs slightly snug');
  if (bestInsights.chest === 'loose') insightMessages.push('Chest runs loose');
  if (bestInsights.waist === 'tight') insightMessages.push('Waist runs slightly snug');
  if (bestInsights.waist === 'loose') insightMessages.push('Waist runs loose');
  if (bestInsights.hips === 'tight') insightMessages.push('Hips run slightly snug');
  if (bestInsights.hips === 'loose') insightMessages.push('Hips run loose');
  
  if (insightMessages.length === 0) {
    insightMessages.push(`Size ${bestSize} provides an optimal fit for your measurements`);
  }

  return {
    recommendedSize: bestSize,
    matchScore: adjustedScore,
    fitLabel,
    insights: insightMessages,
  };
}
