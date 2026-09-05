/**
 * Utility functions for video normalization.
 * Handles Apple QuickTime (.mov / video/quicktime) to MP4 normalization,
 * rewriting ISOBMFF ftyp container brands to mp42 so Chromium, Chrome,
 * Safari, Firefox, iOS, and Android decode seamlessly.
 */

export function normalizeVideoBuffer(
  buffer: Buffer,
  originalMime: string
): { buffer: Buffer; mimeType: string } {
  let finalBuffer = buffer;
  let finalMime = originalMime || 'video/mp4';

  if (
    finalMime.includes('quicktime') ||
    finalMime.includes('mov') ||
    (finalBuffer.length >= 20 && finalBuffer.subarray(4, 8).toString('ascii') === 'ftyp')
  ) {
    if (finalBuffer.subarray(8, 12).toString('ascii') === 'qt  ') {
      const patched = Buffer.from(finalBuffer);
      patched.write('mp42', 8, 4, 'ascii');
      if (patched.subarray(16, 20).toString('ascii') === 'qt  ') {
        patched.write('mp42', 16, 4, 'ascii');
      }
      finalBuffer = patched;
    }
    finalMime = 'video/mp4';
  }

  return { buffer: finalBuffer, mimeType: finalMime };
}

export function normalizeVideoUrl(url: string | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  // Handle QuickTime / MOV data URLs
  if (url.startsWith('data:video/quicktime') || url.startsWith('data:video/mov')) {
    const commaIndex = url.indexOf(',');
    if (commaIndex === -1) {
      return url.replace(/^data:video\/(quicktime|mov)/, 'data:video/mp4');
    }

    const base64Str = url.slice(commaIndex + 1);
    try {
      const buf = Buffer.from(base64Str, 'base64');
      if (buf.length >= 20 && buf.subarray(4, 8).toString('ascii') === 'ftyp') {
        if (buf.subarray(8, 12).toString('ascii') === 'qt  ') {
          buf.write('mp42', 8, 4, 'ascii');
          if (buf.subarray(16, 20).toString('ascii') === 'qt  ') {
            buf.write('mp42', 16, 4, 'ascii');
          }
        }
      }
      return `data:video/mp4;base64,${buf.toString('base64')}`;
    } catch {
      return url.replace(/^data:video\/(quicktime|mov)/, 'data:video/mp4');
    }
  }

  return url;
}
