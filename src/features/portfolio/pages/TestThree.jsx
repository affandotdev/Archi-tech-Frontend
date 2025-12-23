import ProjectScene from "../three/ProjectScene";
import ModelLoader from "../three/ModelLoader";

export default function TestThree() {
  return (
    <ProjectScene>
      <ModelLoader url="/glb/tower_house_design.glb" />
    </ProjectScene>
  );
}
