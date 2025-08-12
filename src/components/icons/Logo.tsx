'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Logo() {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Always use local image for both development and production
  const localImageUrl = "/images/aqua-logo.png";

  const handleImageError = () => {
    console.error('Local logo image failed to load');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image 
        src={localImageUrl}
        alt="AQUA VN Logo"
        width={100}
        height={28}
        priority
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100px',
          maxHeight: '28px',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {/* Text fallback if image fails */}
      {!imageLoaded && (
        <span className="text-lg font-bold text-blue-600">AQUA VN</span>
      )}
    </Link>
  );
}
