import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, category, vendorType } = await request.json();

    const cleanTitle = (title || '').trim();
    const isBoutique = vendorType === 'boutique_seller';

    // 1. Streetwear / Ready-to-Wear Boutique AI Generator
    if (isBoutique || cleanTitle.toLowerCase().includes('hoodie') || cleanTitle.toLowerCase().includes('jean') || cleanTitle.toLowerCase().includes('tee') || cleanTitle.toLowerCase().includes('shirt') || cleanTitle.toLowerCase().includes('slide') || cleanTitle.toLowerCase().includes('cap')) {
      
      let description = '';
      let tags: string[] = ['Streetwear', 'Ready-to-Wear', 'Lagos Drop'];
      let suggestedPrice = 35000;

      const lower = cleanTitle.toLowerCase();

      if (lower.includes('hoodie') || lower.includes('sweat')) {
        description = `Heavyweight 420 GSM fleece oversized hoodie with reinforced double-layer hood, drop-shoulder silhouette, and ribbed cuffs. Pre-shrunk for an enduring boxy drape.`;
        tags = ['Streetwear', 'Oversized Hoodie', 'Heavyweight', 'Fleece', 'Lagos Drop'];
        suggestedPrice = 48000;
      } else if (lower.includes('denim') || lower.includes('jean')) {
        description = `Crafted from 14.5oz raw rigid denim with deep front utility pockets, relaxed wide-leg profile, and customized hardware detailing.`;
        tags = ['Denim', 'Wide Leg', 'Baggy Jeans', 'Streetwear', 'Raw Indigo'];
        suggestedPrice = 42000;
      } else if (lower.includes('tee') || lower.includes('shirt') || lower.includes('top')) {
        description = `Premium 320 GSM combed cotton drop-shoulder t-shirt featuring high-density graphic print, reinforced collar ribbing, and a relaxed boxy streetwear fit.`;
        tags = ['Graphic Tee', 'Heavyweight Cotton', 'Streetwear', 'Boxy Fit', 'Lagos Drop'];
        suggestedPrice = 28000;
      } else if (lower.includes('slide') || lower.includes('shoe') || lower.includes('footwear')) {
        description = `Handcrafted genuine full-grain leather slides with cushioned ergonomic arch support and grooved anti-slip rubber outsoles.`;
        tags = ['Footwear', 'Leather Slides', 'Handcrafted', 'Luxury Loungewear'];
        suggestedPrice = 35000;
      } else if (lower.includes('cap') || lower.includes('hat') || lower.includes('beanie')) {
        description = `Structured 6-panel twill cap with 3D puff embroidery, brass buckle strapback closure, and curved brim.`;
        tags = ['Headwear', 'Streetwear Cap', 'Embroidery', 'Accessories'];
        suggestedPrice = 18000;
      } else {
        description = `Contemporary ready-to-wear piece tailored from premium breathable fabric with modern clean lines and durable finishing. Ideal for elevated daily wear.`;
        tags = ['Ready-to-Wear', 'Contemporary Fashion', 'Lagos Drop', 'Streetwear'];
        suggestedPrice = 35000;
      }

      return NextResponse.json({
        success: true,
        description,
        tags,
        suggestedPrice,
        category: category || (lower.includes('hoodie') ? 'outerwear' : lower.includes('jean') ? 'bottoms' : 'tops')
      });
    }

    // 2. Bespoke Tailoring / Atelier AI Generator
    let description = `Hand-tailored luxury native wear crafted from premium imported fabric with precision front seams, structured shoulder lines, and ceremonial finishing.`;
    let tags = ['Bespoke Native', 'Senator', 'Ceremonial', 'Handmade'];
    let suggestedPrice = 65000;

    const lower = cleanTitle.toLowerCase();
    if (lower.includes('agbada')) {
      description = `3-piece flowing ceremonial Agbada robe featuring high-density geometric embroidery, lightweight drape, and matching tailored trousers.`;
      tags = ['Agbada', 'Ceremonial Wear', 'Gold Embroidery', 'Royal Native'];
      suggestedPrice = 98000;
    } else if (lower.includes('senator') || lower.includes('kaftan')) {
      description = `Sharp tailored Senator kaftan set crafted with precision concealed zipper, structured collar, and tapered slim-fit trousers.`;
      tags = ['Senator Set', 'Kaftan', 'Tailored Native', 'Occasion Wear'];
      suggestedPrice = 68000;
    }

    return NextResponse.json({
      success: true,
      description,
      tags,
      suggestedPrice,
      category: category || 'tops'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 });
  }
}
