/**
 * Returns the URL for the original-size X image while preserving other query parameters.
 */
export function getOriginalImageUrl(url: string): string {
  const originalImageUrl = new URL(url);
  originalImageUrl.searchParams.set('name', 'orig');
  return originalImageUrl.href;
}
