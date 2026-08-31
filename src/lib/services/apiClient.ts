// Centralized, Production-Grade API Client for Veyra Platform

export function getActiveVendorId(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('veyra_vendor_id');
    if (stored && stored.trim().length > 0 && stored !== 'undefined' && stored !== 'null') {
      return stored.trim();
    }
    const storedEmail = localStorage.getItem('veyra_vendor_email');
    if (storedEmail && storedEmail.trim().length > 0 && storedEmail !== 'undefined' && storedEmail !== 'null') {
      return storedEmail.trim();
    }
  }
  return '';
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
    'Cache-Control': 'no-cache',
    ...(options.headers as Record<string, string> || {}),
  };

  if (vendorId) {
    customHeaders['x-vendor-id'] = vendorId;
  }

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
