const crypto = require('crypto');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Cloudinary credentials missing' }) };
  }

  let public_id;
  try {
    const body = JSON.parse(event.body);
    public_id = body.public_id;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!public_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'public_id is required' }) };
  }

  // Generate Cloudinary signature
  const timestamp = Math.floor(Date.now() / 1000);
  const str = `public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha1').update(str).digest('hex');

  // Call Cloudinary destroy API
  const formData = new URLSearchParams();
  formData.append('public_id', public_id);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', API_KEY);
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    { method: 'POST', body: formData }
  );

  const result = await response.json();

  if (result.result === 'ok' || result.result === 'not found') {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 500, body: JSON.stringify({ error: result.result }) };
};
