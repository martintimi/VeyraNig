// Centralized, Production-Grade API Client for Veyra Platform

export function getActiveVendorId(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('veyra_vendor_id');
    if (stored && stored.trim().length > 0) return stored.trim();
  }
  return 'moji-wears';
}

export function getActiveVendorToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('veyra_vendor_token');
  }
  return null;
}

export async function vendorFetch(url: string, options: RequestInit = {}) {
  const vendorId = getActiveVendorId();
  const token = getActiveVendorToken();

  const customHeaders: Record<string, string> = {
    'x-vendor-id': vendorId,
    'Cache-Control': 'no-cache',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    customHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Ensure JSON content type for mutation bodies
  if (options.body && typeof options.body === 'string' && !customHeaders['Content-Type']) {
    customHeaders['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers: customHeaders,
  });
}
