import { OrbitControls } from "@react-three/drei";

export default function CameraControls() {
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
    />
  );
}
