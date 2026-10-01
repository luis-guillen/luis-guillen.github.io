import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { FieldState, TILE, TILE_HEIGHT, tilePosition } from "./field";
import { LABELS, makeLabelTexture } from "./labels";
import type { TileTheme } from "./theme";

interface TileGridProps {
  n: number;
  field: MutableRefObject<FieldState>;
  theme: TileTheme;
}

/** The bevelled tiles: one InstancedMesh (one draw call) plus engraved label planes. */
const TileGrid = ({ n, field, theme }: TileGridProps) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const labelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pos = useMemo(() => [0, 0, 0], []);
  const count = n * n;

  const geometry = useMemo(() => new RoundedBoxGeometry(TILE, TILE_HEIGHT, TILE, 3, 0.085), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: theme.tile,
        metalness: theme.dark ? 0.65 : 0.12,
        roughness: theme.dark ? 0.36 : 0.4,
        envMapIntensity: theme.dark ? 1.7 : 1.05,
      }),
    [theme]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  useEffect(() => {
    let alive = true;
    Promise.all(LABELS.map((l) => makeLabelTexture(l.lines))).then((tex) => {
      if (alive) setTextures(tex);
      else tex.forEach((t) => t.dispose());
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  // Labels ride on a specific tile (by id), so they travel with it when rows and columns slide.
  const c = Math.floor(n / 2);
  const labelIds = LABELS.map((l) => (c + l.di) * n + (c + l.dj));

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const s = field.current;
    for (let id = 0; id < count; id++) {
      tilePosition(id, s, pos);
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      m.setMatrixAt(id, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

    labelIds.forEach((id, k) => {
      const label = labelRefs.current[k];
      if (!label) return;
      tilePosition(id, s, pos);
      label.position.set(pos[0], pos[1] + TILE_HEIGHT / 2 + 0.002, pos[2]);
    });
  });

  return (
    <group>
      <instancedMesh
        ref={mesh}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
      {textures.length === LABELS.length &&
        LABELS.map((l, k) => (
          <mesh
            key={l.lines.join("-")}
            ref={(el) => (labelRefs.current[k] = el)}
            rotation={[-Math.PI / 2, 0, l.rotation]}
            renderOrder={2}
          >
            <planeGeometry args={[0.86, 0.86]} />
            <meshBasicMaterial
              map={textures[k]}
              color={theme.label}
              transparent
              opacity={theme.dark ? 0.42 : 0.38}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
    </group>
  );
};

export default TileGrid;
