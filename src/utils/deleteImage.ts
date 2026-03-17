/**
 * Extracts Cloudinary public_id from a URL
 * e.g. https://res.cloudinary.com/cloud/image/upload/v123/apporleader/gallery/abc.webp
 * → apporleader/gallery/abc
 */
export const extractPublicId = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

/**
 * Deletes an image from Cloudinary via Netlify serverless function
 * Safe — API Secret never exposed to browser
 */
export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  const public_id = extractPublicId(imageUrl);
  if (!public_id) return; // Not a Cloudinary image, skip

  try {
    await fetch('/.netlify/functions/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id }),
    });
  } catch (err) {
    console.error('Failed to delete image from Cloudinary:', err);
    // Don't throw — deletion failure shouldn't block UI
  }
};
