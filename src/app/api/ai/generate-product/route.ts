import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, category, vendorType, genderTarget, brandName, imageUrl } = await request.json();

    const cleanTitle = (title || '').trim();
    const lower = cleanTitle.toLowerCase();
    const isBoutique = vendorType === 'boutique_seller' || vendorType === 'boutique_merchant';
    const brand = brandName || 'Veyra Partner';
    const cat = (category || '').toLowerCase();
    const gender = (genderTarget || 'unisex').toLowerCase();

    // 0. Optional Gemini Vision integration if API Key is configured in environment
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
          const prompt = `You are a luxury Nigerian fashion and streetwear merchandise copywriter for Veyra Store.
Analyze this garment photo and details:
Piece Title: "${cleanTitle || 'Garment'}"
Category: "${category || 'Ready-to-Wear'}"
Department: "${genderTarget || 'Unisex'}"
Brand: "${brand}"
Vendor Type: "${vendorType || 'boutique_merchant'}"

RULES:
1. Write a concise, punchy 2-sentence luxury product description highlighting the exact garment cut, silhouette, textures, and occasions.
2. If vendorType is boutique or ready-to-wear, NEVER use the words "tailored" or "tailoring". Use words like "designed by", "styled by", "crafted with", "features".
3. Append two short bullet points for "• Fabric: ..." and "• Care: ...".
4. Provide 5-6 relevant hashtags (without #).
5. Provide a realistic suggested retail price in Nigerian Naira (e.g. 25000, 35000, 65000).

Return ONLY valid JSON matching this schema:
{
  "description": "2-sentence description\\n\\n• Fabric: ...\\n• Care: ...",
  "tags": ["tag1", "tag2", "tag3"],
  "suggestedPrice": 35000
}`;

          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  imagePart
                ]
              }],
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          });

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              return NextResponse.json({
                success: true,
                description: parsed.description,
                tags: parsed.tags || [],
                suggestedPrice: parsed.suggestedPrice || 35000,
                category: category || 'tops'
              });
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini vision generation fallback to high-precision rules:', geminiErr);
      }
    }

    // High-Precision Rule Synthesis Engine (Contextual by Piece, Category, and Gender)
    let description = '';
    let tags: string[] = [];
    let suggestedPrice = 30000;

    // 1. LACE / CORSET / HALTER / CROP TOPS / BRALETTES (WOMEN / FEMALE)
    if (
      lower.includes('lace') ||
      lower.includes('corset') ||
      lower.includes('halter') ||
      lower.includes('crop') ||
      lower.includes('bralette') ||
      lower.includes('bustier') ||
      lower.includes('ruched') ||
      cat.includes('corset') ||
      (cat.includes('tops') && gender === 'female')
    ) {
      description = `Statement ${lower.includes('lace') ? 'lace ' : ''}${lower.includes('corset') ? 'corset ' : 'crop '}top styled by ${brand} with a flattering sweetheart neckline, intricate textured overlay, and a figure-sculpting ruched silhouette. Designed for standout nightlife glamour, festival aesthetics, and effortless elevated layering.\n\n• Fabric: Floral Embroidered Lace & Breathable Stretch Spandex\n• Care: Gentle cold hand wash. Lay flat to dry. Do not tumble dry.`;
      tags = ['LaceTop', 'CorsetTop', 'HalterTop', 'NightlifeGlam', 'WomensFashion', 'BoutiqueDrop'];
      suggestedPrice = 22000;
    }
    // 2. DRESSES / GOWNS / MAXIS / BODYCON (WOMEN)
    else if (
      lower.includes('gown') ||
      lower.includes('dress') ||
      lower.includes('maxi') ||
      lower.includes('bodycon') ||
      lower.includes('mini dress') ||
      cat.includes('dresses') ||
      cat.includes('gowns')
    ) {
      description = `Alluring feminine silhouette dress styled by ${brand} featuring fluid contour lines, flattering drape, and sophisticated finishing. Perfect for cocktail evenings, festive galas, and VIP celebrations.\n\n• Fabric: Lustrous Silk Crepe & Stretch Satin Sheen\n• Care: Hand wash cold or dry clean. Cool iron inside out.`;
      tags = ['MaxiDress', 'CocktailDress', 'EveningGown', 'OccasionWear', 'Womenswear', 'LagosLuxury'];
      suggestedPrice = 45000;
    }
    // 3. SILK BOUBOU / KAFTANS / ABAYAS
    else if (lower.includes('boubou') || lower.includes('bubu') || lower.includes('abaya') || cat.includes('boubou')) {
      description = `Regal flowing Boubou gown crafted by ${brand} from lustrous pure silk crepe, accentuated by hand-embellished neckline detailing and a graceful silhouette for festive celebrations.\n\n• Fabric: 100% Pure Silk Crepe\n• Care: Gentle hand wash in cold water with mild soap. Cool iron.`;
      tags = ['SilkBoubou', 'Abaya', 'OwambeStyle', 'RegalNative', 'LagosLuxury', 'WomenFashion'];
      suggestedPrice = 55000;
    }
    // 4. SKIRTS & CO-ORD SETS
    else if (lower.includes('skirt') || lower.includes('co-ord') || lower.includes('two piece') || lower.includes('2 piece') || cat.includes('skirts') || cat.includes('two_piece')) {
      description = `Chic modern two-piece coordinate set crafted by ${brand} featuring clean contour lines and effortless comfort, styled seamlessly from daytime brunch to evening cocktails.\n\n• Fabric: Premium Structured Cotton-Spandex Blend\n• Care: Machine wash cold with like colors. Line dry.`;
      tags = ['CoordSet', 'TwoPiece', 'ChicStyle', 'Womenswear', 'BoutiqueDrop'];
      suggestedPrice = 32000;
    }
    // 5. AGBADA (ROYAL CEREMONIAL BESPOKE)
    else if (lower.includes('agbada') || cat.includes('agbada')) {
      description = `Signature 3-piece ceremonial Agbada tailored from premium high-density fabric, featuring precision-embroidered geometric chest paneling and a majestic royal drape for landmark celebrations.\n\n• Fabric: Super 160s Poly-Wool & Silk Thread\n• Care: Professional dry clean only. Steam iron on reverse.`;
      tags = ['Agbada', 'Ceremonial', 'Owambe', 'BespokeNative', 'RoyalWear', 'NigerianFashion'];
      suggestedPrice = 95000;
    }
    // 6. SENATOR WEAR & MALE KAFTAN SETS
    else if (lower.includes('senator') || lower.includes('kaftan') || lower.includes('dashiki') || cat.includes('senator')) {
      description = `Sharp 2-piece modern Senator suit tailored from breathable, wrinkle-resistant cashmere wool blend with a minimalist concealed placket and tapered slim-fit trousers.\n\n• Fabric: Premium Cashmere Wool Blend\n• Care: Dry clean or gentle hand wash. Medium iron with pressing cloth.`;
      tags = ['SenatorSuit', 'BespokeKaftan', 'ModernNative', 'OwambeStyle', 'NigerianFashion'];
      suggestedPrice = 65000;
    }
    // 7. STREETWEAR HOODIES & SWEATSHIRTS
    else if (lower.includes('hoodie') || lower.includes('sweat') || lower.includes('fleece') || cat.includes('hoodie')) {
      description = `Heavyweight 450 GSM luxury brushed French terry cotton hoodie by ${brand} featuring a structured double-layer hood, relaxed drop-shoulder cut, and snug ribbed cuffs.\n\n• Fabric: 100% Organic Heavyweight French Terry (450 GSM)\n• Care: Machine wash cold inside out. Tumble dry low or air dry.`;
      tags = ['Streetwear', 'HeavyweightHoodie', '450GSM', 'OversizedFit', 'LagosDrop'];
      suggestedPrice = 45000;
    }
    // 8. DENIM JEANS & CARGO PANTS
    else if (lower.includes('denim') || lower.includes('jean') || lower.includes('cargo') || cat.includes('denim') || cat.includes('jeans')) {
      description = `Heavy-duty 14.5oz raw rigid denim pants engineered by ${brand} with multi-pocket utility detailing and a relaxed wide-leg profile.\n\n• Fabric: 100% Raw Selvedge Cotton Denim (14.5oz)\n• Care: Wash sparingly inside out in cold water. Hang dry.`;
      tags = ['RawDenim', 'CargoPants', 'WideLeg', 'StreetwearJeans', 'UrbanDrop'];
      suggestedPrice = 42000;
    }
    // 9. GRAPHIC TEES & OVERSIZED TOPS
    else if (lower.includes('tee') || lower.includes('shirt') || lower.includes('jersey') || cat.includes('tees')) {
      description = `Premium 300 GSM combed cotton t-shirt styled by ${brand} with high-density archival screen printing and a signature boxy drop-shoulder cut.\n\n• Fabric: 100% Combed Compact Cotton (300 GSM)\n• Care: Machine wash cold inside out. Iron print inside out.`;
      tags = ['GraphicTee', 'HeavyweightTee', 'BoxyFit', 'StreetwearDrop', 'LagosStyle'];
      suggestedPrice = 28000;
    }
    // 10. FOOTWEAR & LEATHER SLIDES
    else if (lower.includes('slide') || lower.includes('shoe') || lower.includes('heel') || lower.includes('mule') || lower.includes('loafer') || cat.includes('footwear')) {
      description = `Handcrafted genuine full-grain leather footwear designed by ${brand} with an ergonomic cushioned footbed and durable anti-slip outsoles.\n\n• Material: 100% Genuine Full-Grain Leather & Shock-Absorbing Rubber\n• Care: Wipe clean with a soft damp cloth. Condition with neutral leather balm.`;
      tags = ['Footwear', 'LeatherSlides', 'Handcrafted', 'LuxuryFootwear', 'LagosFashion'];
      suggestedPrice = 38000;
    }
    // 11. GENERAL FALLBACK (STRICTLY NO "TAILORING" FOR BOUTIQUE)
    else {
      if (isBoutique) {
        description = `Contemporary ready-to-wear piece styled by ${brand} from lightweight breathable textiles, designed for effortless elegance and versatile day-to-night wear.\n\n• Fabric: Premium Natural Textile Blend\n• Care: Machine wash cold on gentle cycle or hand wash. Cool iron.`;
        tags = ['ReadyToWear', 'ContemporaryFashion', 'BoutiqueDrop', 'LagosStyle', 'UrbanLuxury'];
        suggestedPrice = 30000;
      } else {
        description = `Handcrafted bespoke garment custom-tailored by ${brand} with precision seamwork, internal structuring, and clean hand-finished hems.\n\n• Fabric: Premium Imported Textile Blend\n• Care: Dry clean or delicate cold hand wash. Medium iron with pressing cloth.`;
        tags = ['BespokeTailoring', 'CustomGarment', 'NigerianFashion', 'TraditionalElegance'];
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
