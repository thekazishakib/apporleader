export const extractDriveId = (url: string) => {
  if (!url) return null;
  // Try to match standard Google Drive formats
  const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Try to find any 'id=' parameter
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    const urlParams = new URLSearchParams(urlParts[1]);
    const id = urlParams.get('id');
    if (id) return id;
  }

  // Try to find /d/ in the URL
  const parts = url.split('/');
  const dIndex = parts.indexOf('d');
  if (dIndex !== -1 && parts[dIndex + 1]) {
    return parts[dIndex + 1].split('/')[0];
  }

  return null;
};

export const getDriveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('data:')) {
    // Fix legacy invalid SVG data URLs that might be in local storage
    if (url.includes('data:image/svg+xml;utf8,')) {
      return url
        .replace('data:image/svg+xml;utf8,', 'data:image/svg+xml;charset=utf-8,')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/"/g, '%22');
    }
    return url;
  }
  const id = extractDriveId(url);
  // Google Drive blocked uc?export=view for images. Using thumbnail endpoint instead.
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : url;
};

export const getDriveDownloadUrl = (url: string) => {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
};
