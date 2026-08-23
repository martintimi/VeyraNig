import { BodyProfile, FitMatchResult, Product } from '@/types';

export function calculateFitMatch(profile: BodyProfile, product: Product): FitMatchResult {
  const sizeChart = product.sizeChart;
  const availableSizes = Object.keys(sizeChart);

  if (!availableSizes.length) {
    return {
      recommendedSize: 'M',
      matchScore: 92,
      status: 'optimal',
      fitInsights: { chest: 'perfect', waist: 'perfect', hips: 'perfect', length: 'perfect' },
      narrativeReason: 'Standard fit compatible with your body silhouette.',
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

  // Preference multiplier
  const prefMultiplier = profile.fitPreference === 'skinny' ? -2 
    : profile.fitPreference === 'relaxed' ? 2 
    : profile.fitPreference === 'oversized' ? 4 
    : 0;

  for (const size of availableSizes) {
    const specs = sizeChart[size];
    let dimensionScores: number[] = [];

    // Chest check
    if (specs.chest) {
      const [min, max] = specs.chest;
      const target = profile.chestCm - prefMultiplier;
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
      const target = profile.waistCm - prefMultiplier;
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
      const target = profile.hipsCm - prefMultiplier;
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
      if (profile.shoulderWidthCm >= min && profile.shoulderWidthCm <= max) {
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
  let status: 'optimal' | 'snug' | 'relaxed' = 'optimal';
  if (adjustedScore >= 93) {
    status = 'optimal';
  } else if (profile.fitPreference === 'skinny' || bestInsights.waist === 'tight' || bestInsights.chest === 'tight') {
    status = 'snug';
  } else {
    status = 'relaxed';
  }

  let narrativeReason = `Size ${bestSize} gives an optimal drape tailored to your ${profile.bodyShape.replace('_', ' ')} silhouette.`;
  if (product.category === 'tops') {
    narrativeReason = `Size ${bestSize} aligns with your ${profile.chestCm}cm chest and ${profile.shoulderWidthCm}cm shoulder width for a clean line.`;
  } else if (product.category === 'bottoms') {
    narrativeReason = `Size ${bestSize} matches your ${profile.waistCm}cm waist and ${profile.hipsCm}cm hip contour with zero gaping.`;
  } else if (product.category === 'outerwear') {
    narrativeReason = `Size ${bestSize} allows smooth layering over tops while maintaining structured shoulder line.`;
  }

  return {
    recommendedSize: bestSize,
    matchScore: adjustedScore,
    status,
    fitInsights: bestInsights,
    narrativeReason,
  };
}
