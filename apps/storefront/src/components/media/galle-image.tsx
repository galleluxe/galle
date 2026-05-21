"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface GalleImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  rounded?: boolean;
}

/** Image wrapper with Galle defaults (object-cover, ambient shadow). */
export function GalleImage({
  alt,
  className,
  rounded = true,
  ...props
}: GalleImageProps) {
  return (
    <Image
      alt={alt}
      {...props}
      className={cn(
        "object-cover",
        rounded && "rounded-xl",
        className
      )}
    />
  );
}
