import { useEffect, useRef, useState, memo } from "react";

interface VideoCrossfadeProps {
  sources: string[];
  /** seconds between crossfades */
  intervalMs?: number;
  /** crossfade duration in ms (must match CSS transition) */
  fadeMs?: number;
  className?: string;
  overlayClassName?: string;
}

/**
 * Looping background-video crossfader.
 * Uses two stacked <video> elements and a custom JS scheduler to swap
 * sources with a smooth opacity crossfade — independent of <video> looping.
 */
const VideoCrossfade = memo(
  ({
    sources,
    intervalMs = 7000,
    fadeMs = 1200,
    className = "",
    overlayClassName = "",
  }: VideoCrossfadeProps) => {
    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);
    const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
    const [aSrc, setASrc] = useState(sources[0]);
    const [bSrc, setBSrc] = useState(sources[1 % sources.length]);
    const indexRef = useRef(0);

    useEffect(() => {
      if (sources.length === 0) return;
      // Kick off playback on both layers (B muted/hidden until first swap)
      videoARef.current?.play().catch(() => {});
      videoBRef.current?.play().catch(() => {});

      const id = window.setInterval(() => {
        const nextIndex = (indexRef.current + 1) % sources.length;
        const nextSrc = sources[nextIndex];
        indexRef.current = nextIndex;

        setActiveLayer((prev) => {
          if (prev === "A") {
            setBSrc(nextSrc);
            // Allow React to swap src before playing
            requestAnimationFrame(() => {
              videoBRef.current?.play().catch(() => {});
            });
            return "B";
          } else {
            setASrc(nextSrc);
            requestAnimationFrame(() => {
              videoARef.current?.play().catch(() => {});
            });
            return "A";
          }
        });
      }, intervalMs);

      return () => window.clearInterval(id);
    }, [sources, intervalMs]);

    const transition = `opacity ${fadeMs}ms ease-in-out`;

    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <video
          ref={videoARef}
          src={aSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover will-change-[opacity]"
          style={{ opacity: activeLayer === "A" ? 1 : 0, transition }}
        />
        <video
          ref={videoBRef}
          src={bSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover will-change-[opacity]"
          style={{ opacity: activeLayer === "B" ? 1 : 0, transition }}
        />
        {/* Darkening + tint overlay for legibility */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 ${overlayClassName}`}
        />
      </div>
    );
  }
);
VideoCrossfade.displayName = "VideoCrossfade";

export default VideoCrossfade;
