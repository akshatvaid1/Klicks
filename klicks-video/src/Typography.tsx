import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TypographyLayerProps {
  scene: number;
  frame: number;
}

export const TypographyLayer: React.FC<TypographyLayerProps> = ({
  scene,
  frame,
}) => {
  const { fps } = useVideoConfig();

  // Premium Apple-style font stack
  const fontFamily = "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";

  // Scene 1: "The future of business..."
  const renderScene1 = () => {
    if (scene !== 1) return null;

    // Fade in/out timings
    const fadeIn = interpolate(frame, [80, 140], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const fadeOut = interpolate(frame, [250, 290], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const opacity = fadeIn * fadeOut;

    const translateY = interpolate(frame, [80, 140], [25, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: `translateX(-50%) translateY(${translateY}px)`,
          opacity,
          textAlign: "center",
          zIndex: 200,
        }}
      >
        <h2
          style={{
            fontFamily,
            fontSize: "46px",
            fontWeight: 300,
            color: "rgba(12, 12, 14, 0.4)", // Muted charcoal
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          The future of{" "}
          <span
            style={{
              fontWeight: 500,
              color: "#0c0c0e", // Deep charcoal black
            }}
          >
            business...
          </span>
        </h2>
      </div>
    );
  };

  // Scene 4: "Every workflow." / "One intelligent system."
  const renderScene4 = () => {
    if (scene !== 4) return null;

    const localFrame = frame - 1020; // Starts at frame 1020

    // Timing 1: "Every workflow." (from localFrame 20 to 180)
    const text1FadeIn = interpolate(localFrame, [20, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const text1FadeOut = interpolate(localFrame, [160, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const text1Opacity = text1FadeIn * text1FadeOut;
    const text1Y = interpolate(localFrame, [20, 70], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Timing 2: "One intelligent system." (from localFrame 220 to 390)
    const text2FadeIn = interpolate(localFrame, [220, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const text2FadeOut = interpolate(localFrame, [370, 410], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const text2Opacity = text2FadeIn * text2FadeOut;
    const text2Y = interpolate(localFrame, [220, 270], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 200,
          width: "100%",
        }}
      >
        {/* Phase 1 Text */}
        {text1Opacity > 0 && (
          <h2
            style={{
              fontFamily,
              fontSize: "48px",
              fontWeight: 300,
              color: "rgba(12, 12, 14, 0.4)",
              letterSpacing: "-0.025em",
              margin: 0,
              opacity: text1Opacity,
              transform: `translateY(${text1Y}px)`,
            }}
          >
            Every{" "}
            <span style={{ fontWeight: 600, color: "#0c0c0e" }}>
              workflow.
            </span>
          </h2>
        )}

        {/* Phase 2 Text */}
        {text2Opacity > 0 && (
          <h2
            style={{
              fontFamily,
              fontSize: "48px",
              fontWeight: 300,
              color: "rgba(12, 12, 14, 0.4)",
              letterSpacing: "-0.025em",
              margin: 0,
              opacity: text2Opacity,
              transform: `translateY(${text2Y}px)`,
            }}
          >
            One{" "}
            <span style={{ fontWeight: 600, color: "#6366f1" }}>
              intelligent system.
            </span>
          </h2>
        )}
      </div>
    );
  };

  // Scene 5: Final Keynote Apple-style Logo Reveal & Typography
  const renderScene5 = () => {
    if (scene !== 5) return null;

    const localFrame = frame - 1440; // Starts at frame 1440

    // Staggered premium reveals
    const headlineFadeIn = interpolate(localFrame, [80, 160], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const headlineY = interpolate(localFrame, [80, 160], [35, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const subFadeIn = interpolate(localFrame, [130, 200], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const subY = interpolate(localFrame, [130, 200], [20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const logoFadeIn = interpolate(localFrame, [180, 250], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "10%",
          zIndex: 200,
        }}
      >
        {/* Headline: AI Operating Systems */}
        <h1
          style={{
            fontFamily,
            fontSize: "76px",
            fontWeight: 700,
            color: "#0c0c0e", // Pure elegant deep charcoal
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            margin: 0,
            opacity: headlineFadeIn,
            transform: `translateY(${headlineY}px)`,
            textAlign: "center",
          }}
        >
          AI Operating Systems
        </h1>

        {/* Subheadline: Custom systems that automate your business */}
        <p
          style={{
            fontFamily,
            fontSize: "24px",
            fontWeight: 300,
            color: "rgba(12, 12, 14, 0.45)", // soft silver charcoal
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
            margin: 0,
            marginTop: "20px",
            opacity: subFadeIn,
            transform: `translateY(${subY}px)`,
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Custom systems that automate your business.
        </p>

        {/* Minimal branding badge at the very bottom */}
        <div
          style={{
            marginTop: "48px",
            opacity: logoFadeIn,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#6366f1",
              boxShadow: "0 0 8px rgba(99, 102, 241, 0.5)",
            }}
          />
          <span
            style={{
              fontFamily,
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(12, 12, 14, 0.45)",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            Klicks AI
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderScene1()}
      {renderScene4()}
      {renderScene5()}
    </>
  );
};
