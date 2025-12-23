import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import Lights from "./Lights";

export default function ProjectScene({ children }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ height: "100%", width: "100%", minHeight: "500px", borderRadius: "12px" }}
      shadows
    >
      <Suspense fallback={null}>
        {/* Environmental Lighting */}
        <Environment preset="city" />

        {/* Lights (Keep existing or rely on Environment) */}
        <Lights />

        {/* Controls */}
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />

        {/* Shadows for grounding */}
        <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={10} blur={1.5} far={0.8} />

        {/* The 3D Model */}
        {children}
      </Suspense>
    </Canvas>
  );
}
