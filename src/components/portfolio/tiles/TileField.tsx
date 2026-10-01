import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import TileGrid from "./TileGrid";
import Underglow from "./Underglow";
import { FieldState, INTRO_SECONDS, createBoard, stepBoard } from "./field";
import { TileTheme, useTileTheme } from "./theme";
import { LOWER, TIERS, Tier, TierName, initialTier, missedBudget, readDeviceHints } from "./quality";

type Pointer = { x: number; y: number; active: boolean };

/** Layout only (camera distance, board size). Rendering quality lives in the tier. */
interface Layout {
  mobile: boolean;
  n: number;
}

const layout = (): Layout => (window.innerWidth < 768 ? { mobile: true, n: 11 } : { mobile: false, n: 13 });

/**
 * Measures the frames the device actually renders against the budget, in
 * 2-second windows. Two misses in a row step the quality down one tier. The
 * first seconds (intro, shader compilation) and hidden tabs are ignored.
 */
const PerfGovernor = ({ fps, onDecline }: { fps: MutableRefObject<number>; onDecline: () => void }) => {
  const win = useRef({ start: 0, frames: 0, budget: 0, misses: 0, graceUntil: 0 });
  useFrame(() => {
    const now = performance.now();
    const w = win.current;
    if (w.graceUntil === 0) w.graceUntil = now + 3500;
    if (now < w.graceUntil || document.hidden) {
      w.start = now;
      w.frames = 0;
      w.budget = fps.current;
      return;
    }
    if (fps.current !== w.budget) {
      // the budget changed (scrolled in or out of the hero): start a fresh window
      w.start = now;
      w.frames = 0;
      w.budget = fps.current;
      return;
    }
    w.frames++;
    const elapsed = (now - w.start) / 1000;
    if (elapsed < 2) return;
    const achieved = w.frames / elapsed;
    w.misses = missedBudget(achieved, w.budget) ? w.misses + 1 : 0;
    w.start = now;
    w.frames = 0;
    if (w.misses >= 2) {
      w.misses = 0;
      w.graceUntil = now + 3000; // let the new tier settle before judging it
      onDecline();
    }
  });
  return null;
};

/** Advances the shared field clock before anything else renders this frame. */
const Driver = ({ field, reduced }: { field: MutableRefObject<FieldState>; reduced: boolean }) => {
  useFrame((_, delta) => {
    const s = field.current;
    const dt = Math.min(delta, 0.05);
    if (reduced) {
      s.intro = INTRO_SECONDS + 2;
      s.t = 0;
    } else {
      s.intro += dt;
      s.t += dt;
      stepBoard(s.board, s.t);
    }
    const scroll = window.scrollY / Math.max(window.innerHeight, 1);
    s.pan = scroll * 1.1;
  }, -1);
  return null;
};

/**
 * Drives the "demand" frameloop at a capped rate. requestAnimationFrame already
 * stops in background tabs, so nothing renders when the page is not visible.
 */
const FrameLimiter = ({ fps }: { fps: MutableRefObject<number> }) => {
  const { invalidate } = useThree();
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const target = fps.current;
      if (target > 0 && now - last >= 1000 / target - 1) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, fps]);
  return null;
};

/** Long-lens camera looking down at the field. It stays still: the cursor lights the tiles instead. */
const CameraRig = ({ mobile }: { mobile: boolean }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, mobile ? 8.2 : 6.4, mobile ? 6.4 : 5.4);
    camera.lookAt(0, 0, 0);
  }, [camera, mobile]);
  return null;
};

/**
 * A warm light that hovers above the board under the cursor. The pointer is
 * ray-cast onto the board plane and converted to board space, so the light and
 * the seam glow (via field.cursor) land exactly under the mouse.
 */
const CursorLight = ({
  pointer,
  field,
  theme,
}: {
  pointer: MutableRefObject<Pointer>;
  field: MutableRefObject<FieldState>;
  theme: TileTheme;
}) => {
  const light = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const tools = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      ndc: new THREE.Vector2(),
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.15),
      hit: new THREE.Vector3(),
    }),
    []
  );

  useFrame((_, delta) => {
    const l = light.current;
    if (!l || !l.parent) return;
    const p = pointer.current;
    const c = field.current.cursor;
    let target = 0;
    if (p.active) {
      tools.ndc.set(p.x, -p.y);
      tools.ray.setFromCamera(tools.ndc, camera);
      if (tools.ray.ray.intersectPlane(tools.plane, tools.hit)) {
        l.parent.worldToLocal(tools.hit);
        l.position.x = THREE.MathUtils.damp(l.position.x, tools.hit.x, 10, delta);
        l.position.z = THREE.MathUtils.damp(l.position.z, tools.hit.z, 10, delta);
        target = 1;
      }
    }
    c.strength = THREE.MathUtils.damp(c.strength, target, 4, delta);
    c.x = l.position.x;
    c.z = l.position.z;
    l.intensity = c.strength * (theme.dark ? 13 : 7);
  });

  return <pointLight ref={light} color={theme.hot} position={[0, 1.05, 0]} distance={4.2} decay={1.4} intensity={0} />;
};

/**
 * Studio light strips baked into the environment map. They sit up and to the
 * right of the view (world +x, -z), so every tile top picks up an orange sheen
 * that is strongest toward the upper-right, as in the reference.
 */
const Studio = ({ theme }: { theme: TileTheme }) => (
  <>
    <Lightformer form="rect" intensity={theme.dark ? 4.5 : 3} color={theme.accent} scale={[12, 3, 1]} position={[7, 4, -8]} target={[0, 0, 0]} />
    <Lightformer form="rect" intensity={theme.dark ? 2.2 : 1.8} color={theme.hot} scale={[5, 5, 1]} position={[9, 7, -4]} target={[0, 0, 0]} />
    <Lightformer form="rect" intensity={theme.dark ? 0.25 : 1.2} color="#fff3e6" scale={[10, 10, 1]} position={[-2, 9, 4]} target={[0, 0, 0]} />
  </>
);

interface SceneProps {
  q: Layout;
  tier: Tier;
  reduced: boolean;
  pointer: MutableRefObject<Pointer>;
  fps: MutableRefObject<number>;
  onDecline: () => void;
}

const Scene = ({ q, tier, reduced, pointer, fps, onDecline }: SceneProps) => {
  const theme = useTileTheme();
  const field = useRef<FieldState>({ t: 0, intro: 0, pan: 0, board: createBoard(q.n), cursor: { x: 0, z: 0, strength: 0 } });
  const { viewport } = useThree();
  // Push the field to the right so the headline side keeps a calm, darker area.
  const offsetX = q.mobile ? 0.3 : Math.min(viewport.width * 0.2, 1.8);

  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.background, 9, 20]} />
      <Driver field={field} reduced={reduced} />
      {!reduced && <FrameLimiter fps={fps} />}
      {!reduced && LOWER[tier.name] && <PerfGovernor fps={fps} onDecline={onDecline} />}
      <CameraRig mobile={q.mobile} />

      <group position={[offsetX, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <TileGrid n={q.n} field={field} theme={theme} />
        <Underglow field={field} theme={theme} lightCount={tier.glowLights} />
        {!q.mobile && !reduced && <CursorLight pointer={pointer} field={field} theme={theme} />}
      </group>

      {/* Key light from the top-right corner of the screen. */}
      <directionalLight position={[8, 9, -7]} intensity={theme.dark ? 1.6 : 1.4} color={theme.dark ? "#ffb877" : "#ffe0c2"} />
      <ambientLight intensity={theme.dark ? 0.03 : 0.3} />

      <Environment key={`${theme.dark ? "dark" : "light"}-${tier.envResolution}`} resolution={tier.envResolution} frames={1} background={false}>
        <Studio theme={theme} />
      </Environment>

      {tier.bloom && (
        <EffectComposer multisampling={tier.msaa}>
          <Bloom mipmapBlur levels={6} intensity={theme.dark ? 1.05 : 0.6} luminanceThreshold={0.62} luminanceSmoothing={0.22} radius={0.72} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.28} darkness={theme.dark ? 0.62 : 0.22} />
        </EffectComposer>
      )}
    </>
  );
};

/**
 * Fixed, full-viewport field of bevelled tiles lit by molten light through the
 * gaps. It sits behind the page content, dims below the hero, and falls back to
 * nothing (the CSS hero glow) without WebGL.
 */
const TileField = () => {
  const [q, setQ] = useState(layout);
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const hints = useMemo(readDeviceHints, []);
  const supported = hints.webgl;
  const [tierName, setTierName] = useState<TierName>(() => initialTier(hints));
  const tier = TIERS[tierName];
  const tierRef = useRef(tier);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const layer = useRef<HTMLDivElement>(null);
  const inHero = useRef(true);
  const fps = useRef(tier.fpsHero);

  // Keep the frame budget in sync with the current tier.
  useEffect(() => {
    tierRef.current = tier;
    fps.current = inHero.current ? tier.fpsHero : tier.fpsBelow;
  }, [tier]);

  const decline = useMemo(() => () => setTierName((t) => LOWER[t] ?? t), []);

  useEffect(() => {
    const onResize = () => {
      const next = layout();
      setQ((prev) => (prev.mobile === next.mobile ? prev : next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cursor light on fine pointers only.
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  // Full strength in the hero, dimmer behind the rest of the page.
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const k = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      if (layer.current) layer.current.style.opacity = String(1 - 0.5 * k);
      inHero.current = k < 0.9;
      fps.current = inHero.current ? tierRef.current.fpsHero : tierRef.current.fpsBelow;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lets CSS drop the flat hero glow once the real scene is showing.
  useEffect(() => {
    if (!supported) return;
    document.documentElement.classList.add("has-bg3d");
    return () => document.documentElement.classList.remove("has-bg3d");
  }, [supported]);

  if (!supported) return null;

  return (
    <div
      ref={layer}
      className="bg3d-layer pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-tier={tier.name}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 6.4, 5.4], fov: 30, near: 0.1, far: 60 }}
        dpr={[1, tier.dpr]}
        gl={{ antialias: !tier.bloom, powerPreference: "default", stencil: false }}
        frameloop="demand"
      >
        <Scene
          key={q.mobile ? "m" : "d"}
          q={q}
          tier={tier}
          reduced={reduced}
          pointer={pointer}
          fps={fps}
          onDecline={decline}
        />
      </Canvas>
      <div className="bg3d-fade absolute inset-0" />
    </div>
  );
};

export default TileField;
