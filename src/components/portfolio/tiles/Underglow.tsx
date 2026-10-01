import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FieldState, INTRO_SECONDS, easeOutExpo } from "./field";
import type { TileTheme } from "./theme";

const vertex = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uHot;
  uniform vec2 uSpots[3];
  uniform vec3 uCursor; // xy = plane coords, z = strength 0..1
  uniform float uIntensity;
  varying vec2 vPos;

  void main() {
    float g = 0.0;
    for (int k = 0; k < 3; k++) {
      vec2 d = vPos - uSpots[k];
      g += exp(-dot(d, d) / 14.0);
    }
    // The cursor pools extra light in the seams under it.
    vec2 dc = vPos - uCursor.xy;
    g += uCursor.z * 2.0 * exp(-dot(dc, dc) / 2.6);
    g = clamp(g, 0.0, 1.8);
    // Far edges fade out so the plane never shows a hard border.
    float edge = 1.0 - smoothstep(10.0, 18.0, length(vPos));
    vec3 col = mix(uAccent * 0.28, uHot, clamp(g, 0.0, 1.0)) * (0.35 + g * 2.4);
    gl_FragColor = vec4(col * uIntensity * edge, 1.0);
  }
`;

/**
 * Hotspot centre k at time t, in plane coordinates. Local +X of the board is
 * the top-right of the screen, so the hotspots drift around that corner: the
 * light reads as coming from the upper right, like the reference render.
 */
function spot(k: number, t: number, out: THREE.Vector2) {
  const a = t * (0.07 + k * 0.025) + k * 2.1;
  out.set(3.2 + k * 0.8 + Math.sin(a) * (1.4 + k * 0.6), Math.cos(a * 0.8) * (1.6 + k * 0.9));
  return out;
}

interface UnderglowProps {
  field: MutableRefObject<FieldState>;
  theme: TileTheme;
  /** How many travelling point lights to use (0 = shader glow only). */
  lightCount: number;
}

/**
 * Molten light under the tiles. A shader plane leaks through the gaps and a
 * point light rides each hotspot so the tile walls pick up the same glow.
 */
const Underglow = ({ field, theme, lightCount }: UnderglowProps) => {
  const spots = useMemo(() => [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()], []);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const uniforms = useMemo(
    () => ({
      uAccent: { value: new THREE.Color() },
      uHot: { value: new THREE.Color() },
      uSpots: { value: spots },
      uCursor: { value: new THREE.Vector3() },
      uIntensity: { value: 0 },
    }),
    [spots]
  );
  uniforms.uAccent.value.copy(theme.accent);
  uniforms.uHot.value.copy(theme.hot);

  useFrame(() => {
    const s = field.current;
    // The glow warms up behind the landing tiles, reaching full strength as the last ones settle.
    const fade = easeOutExpo(Math.min(Math.max((s.intro - 0.3) / (INTRO_SECONDS - 0.3), 0), 1));
    const pulse = 1 + 0.12 * Math.sin(s.t * 0.8);
    uniforms.uIntensity.value = fade * pulse * (theme.dark ? 1 : 0.85);
    // plane Y = -board Z (the plane is rotated -90° on X)
    uniforms.uCursor.value.set(s.cursor.x, -s.cursor.z, s.cursor.strength);
    spots.forEach((v, k) => {
      spot(k, s.t, v);
      const light = lightRefs.current[k];
      if (light) {
        // plane is rotated -90° on X, so local plane Y maps to world -Z
        light.position.set(v.x, 0.02, -v.y);
        light.intensity = (lightCount > 1 ? 4.5 : 6) * fade * pulse;
      }
    });
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.24, 0]}>
        <planeGeometry args={[40, 40]} />
        <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} toneMapped={false} />
      </mesh>
      {Array.from({ length: lightCount }, (_, k) => k).map((k) => (
          <pointLight
            key={k}
            ref={(el) => (lightRefs.current[k] = el)}
            color={theme.accent}
            distance={4.5}
            decay={1.6}
            intensity={0}
          />
        ))}
    </group>
  );
};

export default Underglow;
