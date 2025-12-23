import { useGLTF, Center, Html, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  return <Html center><span style={{ color: "black", background: "white", padding: "4px", borderRadius: "4px" }}>{progress.toFixed(0)}% loaded</span></Html>;
}

export default function ModelLoader({ url }) {
  const { scene } = useGLTF(url);

  // Clone scene to avoid re-use issues if necessary, but standard useGLTF is cached.
  // Using Center to ensure model is always in view focus
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

// Preload is good practice
// useGLTF.preload(url) - can do this in parent if url is known upfront
