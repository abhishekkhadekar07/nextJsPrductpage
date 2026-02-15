'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: string;
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  fallbackSrc = '/images/product-fallback.svg',
  alt,
  unoptimized,
  ...props
}: SafeImageProps) {
  const initialSrc = src && src.trim().length > 0 ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const isRemote = /^https?:\/\//i.test(currentSrc);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={unoptimized || isRemote}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
