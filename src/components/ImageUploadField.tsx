import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImageToStorage } from '../utils/imageUpload';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder: 'gallery' | 'members' | 'workshops' | 'blogs';
  label?: string;
  required?: boolean;
}

export default function ImageUploadField({
  value,
  onChange,
  folder,
  label = 'Image',
  required = false,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress('Converting to WebP...');

    try {
      setProgress('Uploading to storage...');
      const downloadUrl = await uploadImageToStorage(file, folder, value);
      onChange(downloadUrl);
      setProgress('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress('');
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-white/10"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
          <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-green-400 px-1 rounded font-mono">
            WebP ✓
          </span>
        </div>
      )}

      {/* Upload Area */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2
          w-full h-24 rounded-lg border-2 border-dashed
          transition-all cursor-pointer
          ${isUploading
            ? 'border-primary/40 bg-primary/5 cursor-not-allowed'
            : 'border-white/10 bg-[#0a0a0a] hover:border-primary/50 hover:bg-primary/5'
          }
        `}
      >
        {isUploading ? (
          <>
            <Loader2 size={24} className="text-primary animate-spin" />
            <span className="text-xs text-gray-400">{progress}</span>
          </>
        ) : (
          <>
            <Upload size={20} className="text-gray-500" />
            <span className="text-xs text-gray-400">
              {value ? 'Click to replace image' : 'Click to upload image'}
            </span>
            <span className="text-[10px] text-gray-600">
              JPG, PNG, WebP — auto-converted to WebP
            </span>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        required={required && !value}
      />

      {/* Error message */}
      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  );
}
