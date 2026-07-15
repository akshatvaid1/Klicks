import React, { useCallback, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { CinematicScene } from "./CinematicScene";
import { FloatingCard } from "./FloatingCard";
import { TypographyLayer } from "./Typography";
import { z } from "zod";

export const klicksHeroSchema = z.object({});

interface CoordProj {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  depth: number;
}

export const KlicksHero: React.FC<z.infer<typeof klicksHeroSchema>> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Helper to dynamically scale 60fps frame markers to active fps (e.g. 30fps)
  const scaleFrame = useCallback((f: number) => {
    return Math.round((f / 60) * fps);
  }, [fps]);

  // Scaled scene boundaries
  const boundaries = React.useMemo(() => {
    return [0, 300, 660, 1020, 1440, 1800].map(scaleFrame);
  }, [scaleFrame]);

  // Determine active scene based on scaled frame timings
  const scene = React.useMemo(() => {
    if (frame < boundaries[1]) return 1; // 0s - 5s
    if (frame < boundaries[2]) return 2; // 5s - 11s
    if (frame < boundaries[3]) return 3; // 11s - 17s
    if (frame < boundaries[4]) return 4; // 17s - 24s
    return 5;                            // 24s - 30s
  }, [frame, boundaries]);

  // Staggered panel activation frames in Scene 3
  const cardActivationFrames = React.useMemo<Record<string, number>>(() => {
    return {
      voice: scaleFrame(680),
      whatsapp: scaleFrame(710),
      crm: scaleFrame(740),
      email: scaleFrame(770),
      calendar: scaleFrame(800),
      sales: scaleFrame(830),
      analytics: scaleFrame(860),
      kb: scaleFrame(890),
      support: scaleFrame(920),
      review: scaleFrame(950),
    };
  }, [scaleFrame]);

  const [projectedCoords, setProjectedCoords] = useState<CoordProj[]>([]);

  const handleProjectCoordinates = useCallback((coords: CoordProj[]) => {
    setProjectedCoords(coords);
  }, []);

  // Scene transition light washes (flash overlay opacity)
  const sceneTransitionOverlay = useCallback((sceneStart: number, duration: number = 20) => {
    const fadeIn = interpolate(frame, [sceneStart - duration, sceneStart], [0, 0.22], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(frame, [sceneStart, sceneStart + duration], [0.22, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return fadeIn + fadeOut;
  }, [frame]);

  // Soft vignette overlay (extremely subtle on white backgrounds)
  const vignetteOpacity = scene === 5
    ? interpolate(frame, [boundaries[4], boundaries[4] + scaleFrame(160)], [0.06, 0.12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0.06;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fafafc", // Apple clean white studio bg
        overflow: "hidden",
      }}
    >
      {/* Layer 1: Three.js 3D Canvas */}
      <CinematicScene
        frame={frame}
        width={width}
        height={height}
        onProjectCoordinates={handleProjectCoordinates}
      />

      {/* Layer 2: Apple Vision Pro style Holographic frosted panels */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {projectedCoords.map((coord) => (
          <FloatingCard
            key={coord.id}
            id={coord.id}
            label={coord.id}
            icon="✦"
            x={coord.x}
            y={coord.y}
            visible={coord.visible}
            depth={coord.depth}
            activationFrame={cardActivationFrames[coord.id] || scaleFrame(750)}
            scene={scene}
          />
        ))}
      </div>

      {/* Layer 3: Typography Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <TypographyLayer scene={scene} frame={frame} />
      </div>

      {/* Layer 4: Volumetric Vignette (soft radial wash) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center, transparent 60%, rgba(20,20,30,${vignetteOpacity}) 100%)`,
        }}
      />

      {/* Layer 5: Clean white light transition washes between scenes */}
      {boundaries.slice(1, -1).map((boundary) => {
        const transOpacity = sceneTransitionOverlay(boundary);
        if (transOpacity <= 0.001) return null;
        return (
          <div
            key={`trans-${boundary}`}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 40,
              pointerEvents: "none",
              backgroundColor: `rgba(255, 255, 255, ${transOpacity})`,
            }}
          />
        );
      })}

      {/* Layer 6: Floating minimal branding watermark (Dark charcoal on white) */}
      <div
        style={{
          position: "absolute",
          top: "48px",
          left: "56px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          opacity: interpolate(frame, [0, scaleFrame(60), scaleFrame(1700), scaleFrame(1800)], [0, 0.45, 0.45, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#6366f1",
            boxShadow: "0 0 8px rgba(99, 102, 241, 0.4)",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "rgba(12, 12, 14, 0.5)",
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
          }}
        >
          Klicks AI
        </span>
      </div>

      {/* Layer 7: Animated minimal crystal glass dust noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
          backgroundPosition: `${(frame * 5) % 150}px ${(frame * 9) % 150}px`,
        }}
      />
    </AbsoluteFill>
  );
};
