import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls, ContactShadows, Html, useProgress } from "@react-three/drei";
import Lights from "./Lights";

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
        <div className="text-indigo-400 font-bold text-2xl mb-1">{progress.toFixed(0)}%</div>
        <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Loading Model</div>
        <div className="w-32 h-1 bg-slate-700 mt-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

export default function ProjectScene({ children }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ height: "100%", width: "100%", minHeight: "500px", borderRadius: "12px" }}
      shadows
    >
      <Suspense fallback={<CanvasLoader />}>
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
