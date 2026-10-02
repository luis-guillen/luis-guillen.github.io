import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { FieldState, TILE, TILE_HEIGHT, tilePosition } from "./field";
import type { TileTheme } from "./theme";

interface TileGridProps {
  n: number;
  field: MutableRefObject<FieldState>;
  theme: TileTheme;
}

/** The bevelled tiles: one InstancedMesh (one draw call). */
const TileGrid = ({ n, field, theme }: TileGridProps) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
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
  });

  return (
    <group>
      <instancedMesh
        ref={mesh}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  );
};

export default TileGrid;
