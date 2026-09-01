import { NextResponse } from 'next/server';
import { calculateLiveShippingRate, PackageShippingRequest } from '@/lib/services/logistics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packages } = body as { packages: PackageShippingRequest[] };

    if (!Array.isArray(packages) || packages.length === 0) {
      return NextResponse.json({ error: 'Packages array is required' }, { status: 400 });
    }

    const results: Record<string, any> = {};

    for (const pkg of packages) {
      const rate = await calculateLiveShippingRate(pkg);
      results[pkg.vendorId] = rate;
    }

    return NextResponse.json({
      success: true,
      rates: results
    });
  } catch (error: any) {
    console.error('Logistics API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to calculate shipping rates' }, { status: 500 });
  }
}
