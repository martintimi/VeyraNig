import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, category, vendorType, genderTarget, brandName } = await request.json();

    const cleanTitle = (title || '').trim();
    const lower = cleanTitle.toLowerCase();
    const isBoutique = vendorType === 'boutique_seller' || vendorType === 'boutique_merchant';
    const brand = brandName || 'Atelier';

    let description = '';
    let tags: string[] = [];
    let suggestedPrice = 35000;
    let fabricComposition = '';
    let careInstructions = 'Dry clean recommended or gentle hand wash with cold water. Iron on low heat inside out. Do not bleach.';

    // 1. AGBADA & ROYAL CEREMONIAL WEAR
    if (lower.includes('agbada') || lower.includes('grand boubou') || lower.includes('royal')) {
      description = `Signature 3-piece ceremonial Agbada tailored from premium high-density imported fabric. Featuring intricate precision-embroidered geometric chest paneling, a flowing royal drape, matching tailored long-sleeve inner tunic, and tapered drawstring trousers. Designed for weddings, chieftancy celebrations, and prestigious red-carpet occasions.\n\n• Fabric: Super 160s Poly-Wool & Silk Thread Embroidery\n• Silhouette: Flowing Royal Majestic Cut\n• Care: Professional dry clean only. Steam iron on reverse.`;
      tags = ['Agbada', 'Ceremonial', 'Owambe', 'BespokeNative', 'GoldEmbroidery', 'NigerianRoyalty'];
      suggestedPrice = 95000;
    }
    // 2. SENATOR WEAR & KAFTAN SETS
    else if (lower.includes('senator') || lower.includes('kaftan') || lower.includes('dashiki') || lower.includes('native') || lower.includes('senate') || lower.includes('two-piece') || lower.includes('2 piece')) {
      description = `Impeccably tailored 2-piece modern Senator suit featuring a clean concealed-button placket, structured military collar, precision shoulder line, and matching tapered slim-fit trousers with side adjusters. Cut from breathable, wrinkle-resistant cashmere wool blend.\n\n• Fabric: Premium Cashmere Wool & Cotton Blend\n• Silhouette: Tailored Nigerian Slim-Fit\n• Care: Gentle hand wash or dry clean. Iron on medium heat with a pressing cloth.`;
      tags = ['SenatorSuit', 'BespokeKaftan', 'ModernNative', 'OwambeStyle', 'NigerianFashion', 'TailoredSet'];
      suggestedPrice = 65000;
    }
    // 3. BOUBOU, MAXI GOWN & CORSET DRESS (WOMEN)
    else if (lower.includes('boubou') || lower.includes('bubu') || lower.includes('gown') || lower.includes('dress') || lower.includes('corset') || lower.includes('kimono') || lower.includes('silk')) {
      description = `Luxurious flowing Boubou gown tailored from lustrous rich silk blend with hand-embellished neckline detailing, fluid graceful drape, and generous side slits. Designed for effortless glamour from festive celebrations to VIP evening galas.\n\n• Fabric: 100% Pure Silk Crepe & Satin Sheen\n• Silhouette: Fluid Oversized Relaxed Fit with Tailored Neck\n• Care: Hand wash cold with mild detergent. Hang to dry in shade. Cool iron.`;
      tags = ['SilkBoubou', 'MaxiGown', 'LagosLuxury', 'OccasionWear', 'ResortWear', 'WomenFashion'];
      suggestedPrice = 55000;
    }
    // 4. STREETWEAR HOODIE & SWEATSHIRTS
    else if (lower.includes('hoodie') || lower.includes('sweat') || lower.includes('pullover') || lower.includes('fleece')) {
      description = `Heavyweight 450 GSM luxury brushed French terry cotton hoodie. Features a double-layered structured hood with no drawstrings for a sleek minimalist aesthetic, relaxed drop-shoulder cut, kangaroo pocket, and heavy 2x2 ribbed cuffs and hem. Pre-shrunk for an enduring boxy drape.\n\n• Fabric: 100% Organic Heavyweight French Terry Cotton (450 GSM)\n• Fit: Boxy Drop-Shoulder Silhouette\n• Care: Machine wash cold inside out with like colors. Tumble dry low or air dry to preserve fabric density.`;
      tags = ['Streetwear', 'HeavyweightHoodie', '450GSM', 'LagosStreetwear', 'OversizedFit', 'UrbanDrop'];
      suggestedPrice = 45000;
    }
    // 5. DENIM & UTILITY CARGO PANTS
    else if (lower.includes('denim') || lower.includes('jean') || lower.includes('cargo') || lower.includes('pant') || lower.includes('trouser')) {
      description = `Heavy-duty 14.5oz rigid raw selvedge denim engineered with reinforced multi-pocket utility detailing, durable contrast stitching, antique brass hardware, and a relaxed wide-leg skater silhouette.\n\n• Fabric: 100% Raw Selvedge Cotton Denim (14.5oz)\n• Fit: Relaxed Straight / Wide-Leg\n• Care: Wash sparingly inside out in cold water. Hang dry to maintain authentic raw indigo fading.`;
      tags = ['RawDenim', 'CargoPants', 'StreetwearJeans', 'WideLeg', 'SelvedgeDenim', 'UrbanStyle'];
      suggestedPrice = 42000;
    }
    // 6. GRAPHIC TEE & OVERSIZED TOPS
    else if (lower.includes('tee') || lower.includes('shirt') || lower.includes('top') || lower.includes('jersey')) {
      description = `Premium 300 GSM heavyweight combed cotton t-shirt featuring high-density archival screen printing, double-needle collar ribbing, and a signature boxy drop-shoulder cut. Crafted to maintain shape and vibrant color wash after wash.\n\n• Fabric: 100% Combed Compact Cotton (300 GSM)\n• Fit: Boxy Streetwear Relaxed Cut\n• Care: Machine wash cold inside out. Iron print inside out. Do not tumble dry on high heat.`;
      tags = ['GraphicTee', 'HeavyweightTee', 'BoxyFit', 'StreetwearDrop', 'PremiumCotton', 'LagosStyle'];
      suggestedPrice = 28000;
    }
    // 7. FOOTWEAR & LEATHER SLIDES
    else if (lower.includes('slide') || lower.includes('shoe') || lower.includes('footwear') || lower.includes('leather') || lower.includes('loafer') || lower.includes('sandal') || lower.includes('mule')) {
      description = `Handcrafted genuine full-grain calfskin leather slides designed with ergonomic contoured footbed, plush memory foam cushioning, and shock-absorbing non-slip rubber tread. Finished with artisanal hand-stitched borders.\n\n• Material: 100% Genuine Full-Grain Calfskin Leather & Vibram Rubber Sole\n• Fit: True to Nigerian size standards\n• Care: Clean with a soft damp cloth. Condition regularly with neutral leather balm. Avoid prolonged water soaking.`;
      tags = ['Footwear', 'LeatherSlides', 'HandcraftedShoes', 'LuxuryLoungewear', 'HandmadeNigeria', 'Calfskin'];
      suggestedPrice = 38000;
    }
    // 8. CAPS & ACCESSORIES
    else if (lower.includes('cap') || lower.includes('hat') || lower.includes('beanie') || lower.includes('tote') || lower.includes('bag') || lower.includes('belt')) {
      description = `Structured 6-panel heavy cotton twill accessory featuring precision 3D puff embroidery, tonal ventilation eyelets, and customized brass buckle adjustable strap for all-day comfort.\n\n• Material: 100% Heavy Cotton Twill & Custom Metal Hardware\n• Fit: Universal adjustable one-size\n• Care: Spot clean with a damp sponge and mild soap. Air dry.`;
      tags = ['Accessories', 'StreetwearCap', 'CustomHardware', 'Headwear', 'LagosFashion'];
      suggestedPrice = 18000;
    }
    // 9. GENERAL FALLBACK (CONTEXTUAL TO BOUTIQUE VS ATELIER)
    else {
      if (isBoutique) {
        description = `Contemporary ready-to-wear piece tailored by ${brand} from premium breathable textiles. Featuring refined minimalist tailoring, durable reinforced seams, and modern urban comfort suited for versatile day-to-night styling.\n\n• Fabric: Premium Blended Natural Fiber\n• Fit: Modern Contemporary Tailored Silhouette\n• Care: Machine wash cold with similar colors or gentle hand wash. Cool iron.`;
        tags = ['ReadyToWear', 'ContemporaryFashion', 'BoutiqueDrop', 'LagosStreetwear', 'UrbanLuxury'];
        suggestedPrice = 35000;
      } else {
        description = `Handcrafted luxury garment custom-tailored by ${brand}. Constructed with artisanal precision, bespoke internal structuring, and clean hand-finished seams designed to accentuate traditional elegance.\n\n• Fabric: Imported Luxury Textile Blend\n• Fit: Precision Bespoke Tailored Cut\n• Care: Dry clean or delicate hand wash in cold water. Iron on medium heat with pressing cloth.`;
        tags = ['BespokeTailoring', 'ArtisanalWear', 'CustomGarment', 'NigerianFashion', 'TraditionalElegance'];
        suggestedPrice = 60000;
      }
    }

    return NextResponse.json({
      success: true,
      description,
      tags,
      suggestedPrice,
      category: category || (lower.includes('hoodie') ? 'outerwear' : lower.includes('jean') ? 'bottoms' : 'tops')
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 });
  }
}
