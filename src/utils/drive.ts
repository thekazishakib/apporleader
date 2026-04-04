/** Normalize image URLs for display (Google Drive, direct URLs, data URIs). */
export function getDriveImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:')) return trimmed;
  if (trimmed.includes('drive.google.com') && trimmed.includes('/file/d/')) {
    const m = trimmed.match(/\/file\/d\/([^/]+)/);
    if (m?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${m[1]}`;
    }
  }
  return trimmed;
}
