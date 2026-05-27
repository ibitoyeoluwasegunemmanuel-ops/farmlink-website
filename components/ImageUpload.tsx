'use client';
import { useRef } from 'react';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 4 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = maxImages - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    toProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const result = ev.target?.result as string;
        onChange([...images, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src={src} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
            <button onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors">
              ✕
            </button>
            {i === 0 && <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">MAIN</div>}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-brand-400 hover:bg-brand-50 transition-all text-gray-400"
          >
            <span className="text-2xl">📷</span>
            <span className="text-xs font-medium">Add photo</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} photos · JPG or PNG · Max 5MB each · First photo is the main image
      </p>
    </div>
  );
}
