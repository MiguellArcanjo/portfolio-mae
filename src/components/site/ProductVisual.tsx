/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

/** Mostra a foto do produto, ou um "prato" ilustrado com o emoji quando não há foto. */
export function ProductVisual({
  image,
  emoji,
  alt,
  className,
  emojiClassName,
}: {
  image?: string;
  emoji: string;
  alt: string;
  className?: string;
  emojiClassName?: string;
}) {
  if (image) {
    return <img src={image} alt={alt} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  }
  return (
    <div
      className={cn(
        "relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br from-mustard-300 via-mustard-400 to-mustard-600",
        className,
      )}
      aria-label={alt}
      role="img"
    >
      <div className="dots absolute inset-0 opacity-60" />
      <div className="absolute aspect-square w-[72%] rounded-full bg-white/90 shadow-[inset_0_-10px_20px_rgba(90,26,14,.15),0_18px_30px_rgba(90,26,14,.25)]" />
      <div className="absolute aspect-square w-[54%] rounded-full border-2 border-dashed border-mustard-300/70" />
      <span className={cn("relative select-none text-[clamp(3rem,10vw,6rem)] drop-shadow-[0_10px_12px_rgba(45,11,5,.35)]", emojiClassName)}>
        {emoji}
      </span>
    </div>
  );
}
