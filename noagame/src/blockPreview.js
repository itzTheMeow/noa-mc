import {
  ArcRotateCamera,
  Color4,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
} from "@babylonjs/core";

export default function blockPreview(glcanvas, topT, leftT, rightT, xShape) {
  let engine = new Engine(glcanvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });

  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);

  const camera = new ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 3, 4, Vector3.Zero());
  camera.attachControl(glcanvas, true);
  const light = new HemisphericLight("light", new Vector3(0.8, 1, -0.3));

  const matTop = new StandardMaterial("matTop");
  let topTex = new Texture(`img/blocks/${topT}.png`);
  topTex.hasAlpha = true;
  matTop.diffuseTexture = topTex;
  const matLeft = new StandardMaterial("matLeft");
  let leftTex = new Texture(`img/blocks/${leftT}.png`);
  leftTex.hasAlpha = true;
  matLeft.diffuseTexture = leftTex;
  const matRight = new StandardMaterial("matRight");
  let rightTex = new Texture(`img/blocks/${rightT}.png`);
  rightTex.hasAlpha = true;
  matRight.diffuseTexture = rightTex;

  let top = MeshBuilder.CreatePlane("top", { size: 1 });
  top.material = matTop;
  top.rotation.x = Math.PI / 2;
  top.position.y = 0.5;

  let left = MeshBuilder.CreatePlane("left", { size: 1 });
  left.material = matLeft;
  left.rotation.y = -Math.PI / 2;
  left.position.x = 0.5;

  let right = MeshBuilder.CreatePlane("right", { size: 1 });
  right.material = matRight;
  right.rotation.y = 0;
  right.position.z = -0.5;

  camera.fov = 0.45;

  engine.runRenderLoop(function () {
    if (scene && scene.activeCamera) {
      scene.render();
    }
  });
}
