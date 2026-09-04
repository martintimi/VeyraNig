'use client';

import React from 'react';
import LuxuryLoader from '@/components/common/LuxuryLoader';

interface VendorLuxuryLoaderProps {
  label?: string;
}

export default function VendorLuxuryLoader({ label = 'Connecting Ìrísí Workspace...' }: VendorLuxuryLoaderProps) {
  return (
    <LuxuryLoader
      fullScreen={false}
      label="Ì R Í S Í"
      sublabel={label}
    />
  );
}
