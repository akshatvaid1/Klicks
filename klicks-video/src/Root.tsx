import "./index.css";
import { Composition } from "remotion";
import { KlicksHero, klicksHeroSchema } from "./KlicksHero";

// Cinematic Hero Animation for Kaarighar AI
// 4K (3840x2160) at 60fps, 30 seconds = 1800 frames

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KlicksHero"
        component={KlicksHero}
        durationInFrames={1800}
        fps={60}
        width={3840}
        height={2160}
        schema={klicksHeroSchema}
        defaultProps={{}}
      />

      {/* 1080p preview for faster iteration */}
      <Composition
        id="KlicksHero-1080p"
        component={KlicksHero}
        durationInFrames={1800}
        fps={60}
        width={1920}
        height={1080}
        schema={klicksHeroSchema}
        defaultProps={{}}
      />

      {/* 720p 30fps optimized version for web delivery and fast rendering */}
      <Composition
        id="KlicksHero-720p-30fps"
        component={KlicksHero}
        durationInFrames={900}
        fps={30}
        width={1280}
        height={720}
        schema={klicksHeroSchema}
        defaultProps={{}}
      />
    </>
  );
};
