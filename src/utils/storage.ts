import { supabase } from '../supabase';

const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'apporleader';

export type ImageFolder = 'gallery' | 'members' | 'workshops' | 'blogs' | 'leadership';

export const getStorageBucket = () => BUCKET;

/** True if URL is a public object in our Supabase Storage bucket. */
export function isSupabaseStorageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const marker = '/storage/v1/object/public/';
  if (!url.includes(marker)) return false;
  const rest = url.split(marker)[1];
  if (!rest) return false;
  const bucket = rest.split('/')[0];
  return bucket === BUCKET;
}

/** Path inside bucket from public URL, or null if not our storage URL. */
export function pathFromPublicUrl(imageUrl: string): string | null {
  if (!isSupabaseStorageUrl(imageUrl)) return null;
  const marker = '/storage/v1/object/public/';
  const idx = imageUrl.indexOf(marker);
  const rest = imageUrl.slice(idx + marker.length);
  const slash = rest.indexOf('/');
  if (slash === -1) return null;
  const bucket = rest.slice(0, slash);
  if (bucket !== BUCKET) return null;
  return decodeURIComponent(rest.slice(slash + 1));
}

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

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Upload WebP to Supabase Storage. After success, deletes previous object if URL changed.
 */
export async function uploadImageToStorage(
  file: File,
  folder: ImageFolder,
  existingUrl?: string
): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not set');
  }

  const webpBlob = await convertToWebP(file);
  const path = `${folder}/${Date.now()}_${randomId()}.webp`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, webpBlob, {
    contentType: 'image/webp',
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message || 'Upload failed — check Storage bucket and policies');
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const newUrl = data.publicUrl;

  if (existingUrl && existingUrl !== newUrl) {
    const removed = await deleteImageFromStorage(existingUrl);
    if (!removed) {
      console.warn('Old image could not be removed from storage; new URL is still saved.');
    }
  }

  return newUrl;
}

/** Returns true if delete succeeded or nothing to delete. */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !imageUrl.trim()) return true;
  const path = pathFromPublicUrl(imageUrl);
  if (!path) {
    return true;
  }
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error('Storage delete:', error.message);
    return false;
  }
  return true;
}

/** After replacing in DB, ensure old file is gone (redundant if upload already deleted). */
export async function replaceImageInStorage(oldUrl: string | undefined, newUrl: string): Promise<void> {
  if (!oldUrl || oldUrl === newUrl) return;
  await deleteImageFromStorage(oldUrl);
}
