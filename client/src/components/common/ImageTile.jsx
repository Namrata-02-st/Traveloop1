import { useState } from 'react';

export default function ImageTile({ src, alt = '', className = '', fallbackClass = '', fallbackText }) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <div className={`relative overflow-hidden ${fallbackClass} ${className}`}>
      {showImage ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setErrored(true)} />
      ) : null}
      {!showImage && fallbackText ? (
        <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/90">
          {fallbackText}
        </div>
      ) : null}
    </div>
  );
}
