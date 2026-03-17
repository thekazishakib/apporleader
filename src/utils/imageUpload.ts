const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Extracts public_id from a Cloudinary URL
 * e.g. https://res.cloudinary.com/cloud/image/upload/v123/apporleader/gallery/abc.webp
 * → apporleader/gallery/abc
 */
const extractPublicId = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

/**
 * Converts any image file to WebP format using Canvas API (browser-side)
 */
export const convertToWebP = (file: File, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert image to WebP'));
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
};

/**
 * Uploads an image to Cloudinary after converting it to WebP.
 * If existingUrl is a Cloudinary URL, it overwrites the same public_id (no storage waste).
 */
export const uploadImageToStorage = async (
  file: File,
  folder: 'gallery' | 'members' | 'workshops' | 'blogs',
  existingUrl?: string
): Promise<string> => {
  const webpBlob = await convertToWebP(file);

  const formData = new FormData();
  formData.append('file', webpBlob, 'image.webp');
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  // If existing Cloudinary image → overwrite same slot (saves storage!)
  const existingPublicId = existingUrl ? extractPublicId(existingUrl) : null;
  if (existingPublicId) {
    formData.append('public_id', existingPublicId);
    formData.append('overwrite', 'true');
  } else {
    // New image → put in correct folder
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    formData.append('public_id', `apporleader/${folder}/${timestamp}_${randomId}`);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Cloudinary upload failed');
  }

  const data = await response.json();
  return data.secure_url;
};

/**
 * Deletes an image from Cloudinary via Netlify Function
 */
export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

  try {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
    const publicId = match ? match[1] : null;
    if (!publicId) return;

    await fetch('/.netlify/functions/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });
  } catch {
    // Fail silently — image removed from UI regardless
  }
};
