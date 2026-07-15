import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FloatingCardProps {
  id: string;
  label: string;
  icon: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  visible: boolean;
  depth: number;
  activationFrame: number;
  scene: number;
}

const iconMap: Record<string, string> = {
  voice: "🎙️",
  whatsapp: "💬",
  crm: "👥",
  email: "✉️",
  calendar: "📅",
  sales: "📈",
  analytics: "📊",
  kb: "📚",
  support: "🤖",
  review: "⭐",
};

const labelMap: Record<string, string> = {
  voice: "Voice Agent",
  whatsapp: "WhatsApp",
  crm: "CRM Sync",
  email: "Email Dispatch",
  calendar: "Calendar",
  sales: "Sales Engine",
  analytics: "Analytics",
  kb: "Knowledge Base",
  support: "AI Support",
  review: "Review Auto",
};

// Scene 4 labels (Premium full names)
const orbitLabelMap: Record<string, string> = {
  voice: "AI Voice Agents",
  whatsapp: "WhatsApp Automation",
  crm: "Central CRM Systems",
  email: "Smart Email Dispatch",
  calendar: "Automated Booking",
  sales: "Automated Sales Pipeline",
  analytics: "Ecosystem Analytics",
  kb: "AI Knowledge Base",
  support: "24/7 Customer Support",
  review: "Review Generation",
};

export const FloatingCard: React.FC<FloatingCardProps> = ({
  id,
  label,
  icon,
  x,
  y,
  visible,
  depth,
  activationFrame,
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  // Clamp layout positions
  const clampedX = Math.max(3, Math.min(97, x));
  const clampedY = Math.max(3, Math.min(97, y));

  // Depth scaling for 3D realism (closer cards are bigger)
  const depthScale = interpolate(depth, [0, 0.5, 1], [1.35, 1.0, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entry animation using a snappy spring
  const entryProgress = spring({
    frame: frame,
    fps,
    config: { damping: 24, stiffness: 120, mass: 0.8 },
    durationInFrames: 50,
  });

  // Activation states inside the card (Scene 3 onward)
  let isActivated = false;
  let activationProgress = 0;
  if (frame >= activationFrame) {
    isActivated = true;
    const activeFrame = frame - activationFrame;
    activationProgress = spring({
      frame: activeFrame,
      fps,
      config: { damping: 18, stiffness: 90, mass: 1.0 },
      durationInFrames: 30,
    });
  }

  // Label switching in Scene 4
  const displayLabel = scene >= 4 ? (orbitLabelMap[id] || label) : (labelMap[id] || label);

  // Dissolve/fade card in Scene 5
  let dissolveOpacity = 1;
  if (scene >= 5) {
    dissolveOpacity = interpolate(frame, [1440, 1490], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const scale = depthScale * entryProgress;
  const opacity = entryProgress * dissolveOpacity;

  // Render card specific Apple-style interactive micro-workflows
  const renderWorkflowSimulation = () => {
    if (!isActivated) return null;

    const localF = frame - activationFrame;

    switch (id) {
      case "voice": {
        // Siri-like colored audio waveform
        const lineOffset = Math.sin(localF * 0.25) * 6;
        return (
          <div style={{ display: "flex", gap: "3px", height: "14px", alignItems: "center", marginLeft: "12px" }}>
            <div style={{ width: "2px", height: `${6 + lineOffset}px`, background: "#3b82f6", borderRadius: "1px", transition: "height 0.1s ease" }} />
            <div style={{ width: "2px", height: `${12 - lineOffset}px`, background: "#8b5cf6", borderRadius: "1px", transition: "height 0.1s ease" }} />
            <div style={{ width: "2px", height: `${8 + lineOffset * 0.5}px`, background: "#a78bfa", borderRadius: "1px", transition: "height 0.1s ease" }} />
          </div>
        );
      }
      case "whatsapp": {
        // Blinking green chat bubble indicator
        const isBlinking = Math.floor(localF / 10) % 2 === 0;
        return (
          <div style={{
            marginLeft: "12px",
            fontSize: "11px",
            background: "rgba(34, 197, 94, 0.22)",
            color: "#4ade80",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: 600,
            opacity: isBlinking ? 0.7 : 1,
          }}>
            ONLINE
          </div>
        );
      }
      case "email": {
        // Flying email animation state
        const sent = localF > 30;
        return (
          <div style={{
            marginLeft: "12px",
            fontSize: "11px",
            color: sent ? "#a78bfa" : "#e2e8f0",
            fontWeight: 500,
          }}>
            {sent ? "Sent ✓" : "Sending..."}
          </div>
        );
      }
      case "calendar": {
        // Booking confirmation state
        const booked = localF > 25;
        return (
          <div style={{
            marginLeft: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: booked ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.06)",
            padding: "2px 8px",
            borderRadius: "8px",
            fontSize: "11px",
            border: booked ? "1px solid rgba(139, 92, 246, 0.4)" : "1px solid rgba(255,255,255,0.1)",
          }}>
            <span style={{ color: booked ? "#a78bfa" : "#ffffff" }}>{booked ? "Booked" : "Pending"}</span>
          </div>
        );
      }
      case "sales": {
        // Mini line chart SVG animating upwards
        const chartProgress = interpolate(localF, [0, 45], [10, 0], { extrapolateRight: "clamp" });
        return (
          <svg width="28" height="14" style={{ marginLeft: "12px" }}>
            <path
              d={`M0 12 Q 10 ${chartProgress} 28 ${chartProgress * 0.2}`}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      }
      case "analytics": {
        // Numeric growth counter
        const score = Math.round(interpolate(localF, [0, 50], [80, 96], { extrapolateRight: "clamp" }));
        return (
          <div style={{
            marginLeft: "12px",
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#4ade80",
            fontWeight: "bold",
          }}>
            +{score}%
          </div>
        );
      }
      case "review": {
        // Gold stars reveal
        const starCount = Math.min(5, Math.floor(localF / 8) + 1);
        return (
          <div style={{ display: "flex", gap: "1px", marginLeft: "10px", color: "#fbbf24" }}>
            {Array.from({ length: starCount }).map((_, i) => (
              <span key={i} style={{ fontSize: "11px" }}>★</span>
            ))}
          </div>
        );
      }
      case "kb": {
        // KB sync pulses
        const synced = localF > 35;
        return (
          <div style={{
            marginLeft: "12px",
            fontSize: "10px",
            letterSpacing: "0.05em",
            color: synced ? "#38bdf8" : "#94a3b8",
            textTransform: "uppercase",
            fontWeight: 600,
          }}>
            {synced ? "Synced" : "Syncing"}
          </div>
        );
      }
      default:
        return null;
    }
  };

  // Outer panel container (3D coordinate projected)
  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: `${clampedX}%`,
    top: `${clampedY}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    pointerEvents: "none",
    zIndex: Math.round((1 - depth) * 1000),
  };

  // Apple-style Black Frosted Obsidian Glass Card Material
  const glassStyle: React.CSSProperties = {
    background: isActivated
      ? "linear-gradient(135deg, rgba(20, 20, 30, 0.72) 0%, rgba(10, 10, 15, 0.88) 100%)"
      : "linear-gradient(135deg, rgba(25, 25, 35, 0.45) 0%, rgba(15, 15, 20, 0.65) 100%)",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    
    // Dynamic border glow based on activation progress
    border: isActivated
      ? `1px solid rgba(139, 92, 246, ${0.25 + 0.3 * activationProgress})` // violet active border
      : "1px solid rgba(255, 255, 255, 0.08)",
    
    borderRadius: "18px",
    padding: "14px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    
    // Shadow gets deep and glows dynamically on activation
    boxShadow: isActivated
      ? `0 25px 60px rgba(0, 0, 0, 0.45), 0 0 35px rgba(99, 102, 241, ${0.28 * activationProgress})`
      : "0 15px 45px rgba(0, 0, 0, 0.32)",
    
    whiteSpace: "nowrap" as const,
    minWidth: "140px",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "18px",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    background: isActivated
      ? "rgba(139, 92, 246, 0.22)" // Violet glow
      : "rgba(255, 255, 255, 0.05)",
    marginRight: "10px",
  };

  const textContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const labelStyle: React.CSSProperties = {
    color: isActivated ? "#ffffff" : "rgba(255, 255, 255, 0.68)",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    fontFamily: "'Inter', 'SF Pro Text', -apple-system, sans-serif",
    textShadow: isActivated ? "0 1px 8px rgba(255, 255, 255, 0.15)" : "none",
  };

  // Activated blue-violet energy pulse dot
  const dotStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: isActivated ? "#6366f1" : "rgba(255,255,255,0.15)",
    marginLeft: "12px",
    boxShadow: isActivated ? "0 0 10px rgba(99, 102, 241, 0.8)" : "none",
  };

  return (
    <div style={cardStyle}>
      <div style={glassStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={iconStyle}>{iconMap[id] || icon}</div>
          <div style={textContainerStyle}>
            <span style={labelStyle}>{displayLabel}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderWorkflowSimulation()}
          <div style={dotStyle} />
        </div>
      </div>
    </div>
  );
};
