import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CoordProj {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  depth: number;
}

interface CinematicSceneProps {
  frame: number;
  width: number;
  height: number;
  onProjectCoordinates: (coords: CoordProj[]) => void;
}

export const CinematicScene: React.FC<CinematicSceneProps> = ({
  frame,
  width,
  height,
  onProjectCoordinates,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Meshes references for Apple-style crystal and liquid metal objects
  const metalCoreRef = useRef<THREE.Mesh | null>(null);
  const crystalRing1Ref = useRef<THREE.Mesh | null>(null);
  const crystalRing2Ref = useRef<THREE.Mesh | null>(null);
  const crystalRing3Ref = useRef<THREE.Mesh | null>(null);
  const linesRef = useRef<THREE.Line[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const internalLightRef = useRef<THREE.PointLight | null>(null);

  // 10 Premium Holographic Panels positions around the core
  const cardPositionsRef = useRef<Array<{ id: string; x: number; y: number; z: number; phase: number }>>([
    { id: "voice", x: -2.7, y: 1.3, z: -0.8, phase: 0 },
    { id: "whatsapp", x: 2.6, y: 0.9, z: 1.1, phase: 1.2 },
    { id: "crm", x: -1.9, y: -0.7, z: 1.9, phase: 2.4 },
    { id: "email", x: 2.1, y: -1.1, z: -1.7, phase: 3.6 },
    { id: "calendar", x: -1.1, y: 1.7, z: 1.7, phase: 4.8 },
    { id: "sales", x: 1.1, y: 1.5, z: -2.1, phase: 0.6 },
    { id: "analytics", x: -2.9, y: 0.1, z: -1.8, phase: 1.8 },
    { id: "kb", x: 2.9, y: -0.1, z: 0.7, phase: 3.0 },
    { id: "support", x: -1.7, y: -1.5, z: -1.4, phase: 4.2 },
    { id: "review", x: 1.7, y: -1.7, z: 1.4, phase: 5.4 },
  ]);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const easeOutQuad = (t: number): number => {
    return 1 - (1 - t) * (1 - t);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup with bright white background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fafafc"); // Apple-style clean studio backdrop
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 8);
    cameraRef.current = camera;

    // 3. Renderer setup (optimized, no shadow maps for massive CPU render speedup)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting setup (Premium studio lighting: soft keys, fill, and point light accents)
    const ambientLight = new THREE.AmbientLight("#ffffff", 2.2); // Clean white global fill
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 3.0); // Bright key light
    keyLight.position.set(6, 10, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#b3c5ff", 1.8); // Subtle blue/violet fill
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const internalLight = new THREE.PointLight("#8b5cf6", 0, 15); // Pulsing core light (purple/violet)
    internalLight.position.set(0, 0, 0);
    scene.add(internalLight);
    internalLightRef.current = internalLight;

    // 5. Central AI Core Elements
    // Core 1: Central Liquid Metal Sphere
    const sphereGeo = new THREE.SphereGeometry(0.55, 64, 64);
    const metalMat = new THREE.MeshStandardMaterial({
      color: "#e2e8f0", // Clean chrome/liquid silver
      metalness: 0.98,
      roughness: 0.05,
    });
    const metalCore = new THREE.Mesh(sphereGeo, metalMat);
    scene.add(metalCore);
    metalCoreRef.current = metalCore;

    // Core 2: Crystal Glass Rings (Nested & Intersecting)
    // Using standard transparent materials instead of physical transmission for speed
    const ringGeo1 = new THREE.TorusGeometry(0.85, 0.04, 16, 100);
    const ringGeo2 = new THREE.TorusGeometry(1.05, 0.03, 16, 100);
    const ringGeo3 = new THREE.TorusGeometry(1.25, 0.02, 16, 100);

    const crystalMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.38,
      roughness: 0.08,
      metalness: 0.9,
    });

    const crystalRing1 = new THREE.Mesh(ringGeo1, crystalMat);
    const crystalRing2 = new THREE.Mesh(ringGeo2, crystalMat);
    const crystalRing3 = new THREE.Mesh(ringGeo3, crystalMat);

    scene.add(crystalRing1);
    scene.add(crystalRing2);
    scene.add(crystalRing3);

    crystalRing1Ref.current = crystalRing1;
    crystalRing2Ref.current = crystalRing2;
    crystalRing3Ref.current = crystalRing3;

    // 6. Energy Streams (gradient lines)
    const beamLines: THREE.Line[] = [];
    cardPositionsRef.current.forEach(() => {
      const lineMat = new THREE.LineBasicMaterial({
        color: "#6366f1", // Indigo glowing line color
        transparent: true,
        opacity: 0,
        linewidth: 1.5,
      });
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      beamLines.push(line);
    });
    linesRef.current = beamLines;

    // 7. Ambient Liquid/Crystal Particles
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Custom glowing particle sprite texture
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(99, 102, 241, 0.8)"); // Indigo core
      grad.addColorStop(0.3, "rgba(139, 92, 246, 0.4)"); // Violet halo
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.15,
      map: texture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Cleanup
    return () => {
      renderer.dispose();
      sphereGeo.dispose();
      metalMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringGeo3.dispose();
      crystalMat.dispose();
      particleGeo.dispose();
      pMat.dispose();
      texture.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [width, height]);

  // Animation updates hook
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const metalCore = metalCoreRef.current;
    const crystalRing1 = crystalRing1Ref.current;
    const crystalRing2 = crystalRing2Ref.current;
    const crystalRing3 = crystalRing3Ref.current;
    const internalLight = internalLightRef.current;
    const particles = particlesRef.current;
    const beamLines = linesRef.current;

    if (!scene || !camera || !metalCore || !crystalRing1 || !crystalRing2 || !crystalRing3) return;

    // Camera movement animations
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    if (frame <= 300) {
      // Scene 1: Slow dolly in empty white space
      const t = frame / 300;
      camera.position.set(0, 0.3 - t * 0.1, 7.5 - t * 1.5);
      targetLookAt.set(0, 0, 0);
    } else if (frame <= 660) {
      // Scene 2: Core materializes, camera begins to orbit
      const t = (frame - 300) / 360;
      const easeT = easeInOutCubic(t);
      const angle = easeT * Math.PI * 0.28;
      const radius = 6.0;
      camera.position.set(radius * Math.sin(angle), 0.2 + easeT * 0.4, radius * Math.cos(angle));
      targetLookAt.set(0, 0, 0);
    } else if (frame <= 1020) {
      // Scene 3: Holographic panels materialize sequentially
      const t = (frame - 660) / 360;
      const easeT = easeInOutCubic(t);
      const startAngle = Math.PI * 0.28;
      const currentAngle = startAngle - easeT * startAngle;
      const radius = 6.0 + easeT * 0.8;
      camera.position.set(
        radius * Math.sin(currentAngle),
        0.6 + easeT * 0.8,
        radius * Math.cos(currentAngle)
      );
      targetLookAt.set(0, 0, 0);
    } else if (frame <= 1440) {
      // Scene 4: Orbiting 360 degrees through the synchronized ecosystem
      const t = (frame - 1020) / 420;
      const easeT = easeInOutCubic(t);
      const angle = easeT * Math.PI * 2.0;
      const radius = 6.8 - Math.sin(easeT * Math.PI) * 0.6;
      camera.position.set(radius * Math.sin(angle), 1.4 - easeT * 0.6, radius * Math.cos(angle));
      targetLookAt.set(0, 0, 0);
    } else {
      // Scene 5: Core merges into logo, pull back
      const t = (frame - 1440) / 360;
      const easeT = easeInOutCubic(t);
      const radius = 6.2 + easeT * 5.8;
      camera.position.set(0, 0.8 + easeT * 0.4, radius);
      targetLookAt.set(0, easeT * 0.6, 0);
    }
    camera.lookAt(targetLookAt);

    // AI Core scale transitions
    let coreScale = 0;
    if (frame < 300) {
      coreScale = 0;
      metalCore.visible = false;
      crystalRing1.visible = false;
      crystalRing2.visible = false;
      crystalRing3.visible = false;
    } else if (frame <= 480) {
      metalCore.visible = true;
      crystalRing1.visible = true;
      crystalRing2.visible = true;
      crystalRing3.visible = true;
      const t = (frame - 300) / 180;
      coreScale = easeOutQuad(t);
    } else if (frame <= 1440) {
      coreScale = 1.0;
    } else if (frame <= 1520) {
      const t = (frame - 1440) / 80;
      coreScale = 1.0 + Math.sin(t * Math.PI) * 0.22; // Core swells briefly on explosion
    } else {
      // Scale down slightly as it morphs into the geometric logo
      const t = (frame - 1520) / 280;
      coreScale = 1.0 - t * 0.15;
    }

    // Dynamic rotation of nested crystal rings (Apple style)
    if (metalCore && crystalRing1 && crystalRing2 && crystalRing3) {
      metalCore.scale.setScalar(coreScale);
      crystalRing1.scale.setScalar(coreScale);
      crystalRing2.scale.setScalar(coreScale);
      crystalRing3.scale.setScalar(coreScale);

      // Rotate liquid core
      metalCore.rotation.y = frame * 0.006;
      metalCore.rotation.z = frame * 0.003;

      // Rotate crystal rings in different speeds and axes
      crystalRing1.rotation.x = frame * 0.008;
      crystalRing1.rotation.y = frame * 0.004;

      crystalRing2.rotation.y = -frame * 0.006;
      crystalRing2.rotation.z = -frame * 0.008;

      crystalRing3.rotation.x = -frame * 0.004;
      crystalRing3.rotation.z = frame * 0.005;

      // In Scene 5 (morph into logo), crystal rings align and compress together
      if (frame >= 1440) {
        const morphT = Math.min((frame - 1440) / 180, 1.0);
        const easeM = easeInOutCubic(morphT);
        
        // Flatten rotations to zero (aligned look)
        crystalRing1.rotation.x = THREE.MathUtils.lerp(crystalRing1.rotation.x, 0, easeM);
        crystalRing1.rotation.y = THREE.MathUtils.lerp(crystalRing1.rotation.y, 0, easeM);
        crystalRing2.rotation.y = THREE.MathUtils.lerp(crystalRing2.rotation.y, 0, easeM);
        crystalRing2.rotation.z = THREE.MathUtils.lerp(crystalRing2.rotation.z, 0, easeM);
        crystalRing3.rotation.x = THREE.MathUtils.lerp(crystalRing3.rotation.x, 0, easeM);
        crystalRing3.rotation.z = THREE.MathUtils.lerp(crystalRing3.rotation.z, 0, easeM);

        // Align ring orientations to form an interlocking geometry logo
        crystalRing1.rotation.y = easeM * Math.PI * 0.25;
        crystalRing2.rotation.x = easeM * Math.PI * 0.25;
        crystalRing3.rotation.z = easeM * Math.PI * 0.25;
      }
    }

    // Pulse core light color and intensity (violet/indigo transitions)
    if (internalLight) {
      let intensity = 0;
      if (frame >= 300) {
        const pulseCycle = Math.sin((frame - 300) * 0.045) * 0.5 + 0.5;
        intensity = pulseCycle * 3.5;

        // Color shifts from purple (Materialization) to bright indigo (Active Sync)
        if (frame >= 660 && frame <= 1440) {
          intensity += 2.5;
          internalLight.color.setHex(0x6366f1); // Indigo
        } else {
          internalLight.color.setHex(0x8b5cf6); // Purple/violet
        }
      }
      internalLight.intensity = intensity;
    }

    // UI Panels positions calculations
    const currentCardPositions = cardPositionsRef.current.map((card) => {
      let x = card.x;
      let y = card.y;
      let z = card.z;
      let visible = true;

      if (frame < 300) {
        // Scene 1: Drifting invisibly
        y += Math.sin(frame * 0.02 + card.phase) * 0.25;
        visible = false;
      } else if (frame < 660) {
        // Scene 2: Drifting floating state
        y += Math.sin(frame * 0.015 + card.phase) * 0.15;
        visible = false;
      } else if (frame < 1020) {
        // Scene 3: Holographic panels materialize sequentially
        y += Math.sin(frame * 0.015 + card.phase) * 0.08;
      } else if (frame < 1440) {
        // Scene 4: Orbit around the core
        const orbitSpeed = (frame - 1020) * 0.005;
        const radius = Math.sqrt(card.x * card.x + card.z * card.z) * 1.1;
        const initialAngle = Math.atan2(card.z, card.x);
        const currentAngle = initialAngle + orbitSpeed;

        x = radius * Math.cos(currentAngle);
        z = radius * Math.sin(currentAngle);
        y = card.y * 0.8 + Math.sin(frame * 0.012 + card.phase) * 0.08;
      } else {
        // Scene 5: Particles explode/dissolve
        visible = false;
      }

      return { id: card.id, x, y, z, visible };
    });

    // Drawing Energy Streams linking Core center to Panels
    if (beamLines && beamLines.length > 0) {
      currentCardPositions.forEach((card, idx) => {
        const line = beamLines[idx];
        if (!line) return;

        let opacity = 0;

        // Lines appear and connect during Scene 3 and 4
        if (frame >= 660 && frame <= 1440) {
          const connectT = Math.min((frame - 660) / 140, 1.0);
          opacity = connectT * 0.42;

          const targetPos = new THREE.Vector3(card.x, card.y, card.z);
          const currentBeamPos = new THREE.Vector3().copy(targetPos).multiplyScalar(connectT);

          const positions = new Float32Array([0, 0, 0, currentBeamPos.x, currentBeamPos.y, currentBeamPos.z]);
          line.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          line.geometry.attributes.position.needsUpdate = true;
        }

        const lineMat = line.material as THREE.LineBasicMaterial;
        lineMat.opacity = opacity;
      });
    }

    // Drifting particles and Scene 5 spiral intake effect
    if (particles) {
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        let px = posAttr.array[idx];
        let py = posAttr.array[idx + 1];
        let pz = posAttr.array[idx + 2];

        if (frame < 1440) {
          // Ambient slow float drift
          posAttr.array[idx] += Math.sin(frame * 0.004 + i) * 0.0015;
          posAttr.array[idx + 1] += Math.cos(frame * 0.003 + i) * 0.001;
          posAttr.array[idx + 2] += Math.cos(frame * 0.004 + i) * 0.0015;
        } else {
          // Scene 5: Explosion then spiral vortex intake toward core center
          const spiralT = (frame - 1440) / 240;
          if (spiralT >= 0 && spiralT <= 1) {
            const easeS = easeInOutCubic(spiralT);
            
            // Push out initially (explosion flash)
            const pushRadius = spiralT < 0.15 ? 1.0 + Math.sin((spiralT / 0.15) * Math.PI * 0.5) * 0.25 : 1.25;

            // Spiral angle rotation around Y axis
            const currentAngle = Math.atan2(pz, px) + easeS * Math.PI * 4.0;
            const horizontalRadius = Math.sqrt(px * px + pz * pz) * pushRadius * (1 - easeS * 0.85);

            // Interpolate coords
            posAttr.array[idx] = horizontalRadius * Math.cos(currentAngle);
            posAttr.array[idx + 2] = horizontalRadius * Math.sin(currentAngle);
            posAttr.array[idx + 1] = py * (1 - easeS * 0.85);
          }
        }
      }
      posAttr.needsUpdate = true;
    }

    // Project 3D Coordinates to 2D Screen Space percentages for React overlays
    const projectedCoords: CoordProj[] = currentCardPositions.map((card) => {
      const vec = new THREE.Vector3(card.x, card.y, card.z);
      vec.project(camera);

      const depth = vec.z;
      const screenX = (vec.x * 0.5 + 0.5) * 100;
      const screenY = (-(vec.y * 0.5) + 0.5) * 100;

      let visible = card.visible;
      if (depth < 0 || depth > 1) {
        visible = false;
      }

      return {
        id: card.id,
        x: screenX,
        y: screenY,
        visible,
        depth,
      };
    });

    onProjectCoordinates(projectedCoords);

    rendererRef.current.render(scene, camera);
  }, [frame, width, height, onProjectCoordinates]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    />
  );
};
