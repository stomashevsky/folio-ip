"use client";

import { useState } from "react";
import { Button } from "@plexui/ui/components/Button";
import { MapPin } from "@plexui/ui/components/Icon";

export function MapEmbed({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [interactive, setInteractive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div
      className="relative"
      onMouseLeave={() => setInteractive(false)}
    >
      <iframe
        key={resetKey}
        title="Session location"
        width="100%"
        height="300"
        className="border-0"
        loading="lazy"
        suppressHydrationWarning
        src={src}
      />
      {!interactive && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setInteractive(true)}
        />
      )}
      {interactive && (
        <Button
          color="secondary"
          variant="ghost"
          size="sm"
          uniform
          className="absolute right-2 top-2 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
          onClick={() => { setResetKey((k) => k + 1); setInteractive(false); }}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
