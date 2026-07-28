"use client";

import { useCallback } from "react";

type SilentVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  preload?: "none" | "metadata" | "auto";
  controls?: boolean;
  loop?: boolean;
  playsInline?: boolean;
};

export function SilentVideo({
  src,
  poster,
  className,
  preload = "metadata",
  controls = true,
  loop = true,
  playsInline = true,
}: SilentVideoProps) {
  const forceMuted = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;

    // Keep playback silent even if user tries to unmute via controls.
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
  }, []);

  return (
    <video
      ref={forceMuted}
      className={className}
      controls={controls}
      muted
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      poster={poster}
      onLoadedMetadata={(event) => forceMuted(event.currentTarget)}
      onPlay={(event) => forceMuted(event.currentTarget)}
      onVolumeChange={(event) => forceMuted(event.currentTarget)}
    >
      <source src={src} type="video/mp4" />
      Seu navegador nao suporta reproducao de video.
    </video>
  );
}