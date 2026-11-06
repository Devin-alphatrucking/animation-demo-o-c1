import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/data/images.generated";

/** Local photography with blur-up placeholder. `fill` mode needs a sized, relative parent. */
export function Photo({
  name,
  alt,
  sizes = "100vw",
  className = "",
  eager = false,
  position,
}: {
  name: PhotoKey;
  alt: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
  position?: string;
}) {
  const p = PHOTOS[name];
  return (
    <Image
      src={p.src}
      alt={alt}
      fill
      sizes={sizes}
      placeholder={p.blur as `data:image/${string}`}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      className={`object-cover ${className}`}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
