import {
  ArcRotateCamera,
  Color4,
  Engine,
  HemisphericLight,
  Matrix,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
} from "@babylonjs/core";

export default function blockPreview(glcanvas, canvas2d, topT, leftT, rightT, xShape) {
  let engine = new Engine(glcanvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });

  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);

  const camera = new ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 3, 4, Vector3.Zero(), null);
  camera.attachControl(glcanvas, true);

  let blockSize = 1;

  if (!xShape) {
    new HemisphericLight("light", new Vector3(0.8, 1, -0.3), null);
    camera.fov = 0.45 * blockSize;

    const matTop = new StandardMaterial("matTop", null);
    let topTex = new Texture(`img/blocks/${topT}.png`, null);
    topTex.hasAlpha = true;
    matTop.diffuseTexture = topTex;
    const matLeft = new StandardMaterial("matLeft", null);
    let leftTex = new Texture(`img/blocks/${leftT}.png`, null);
    leftTex.hasAlpha = true;
    matLeft.diffuseTexture = leftTex;
    const matRight = new StandardMaterial("matRight", null);
    let rightTex = new Texture(`img/blocks/${rightT}.png`, null);
    rightTex.hasAlpha = true;
    matRight.diffuseTexture = rightTex;

    let top = MeshBuilder.CreatePlane("top", { size: blockSize });
    top.material = matTop;
    top.rotation.x = Math.PI / 2;
    top.position.y = 0.5 * blockSize;

    let left = MeshBuilder.CreatePlane("left", { size: blockSize });
    left.material = matLeft;
    left.rotation.y = -Math.PI / 2;
    left.position.x = 0.5 * blockSize;

    let right = MeshBuilder.CreatePlane("right", { size: blockSize });
    right.material = matRight;
    right.rotation.y = 0;
    right.position.z = -0.5 * blockSize;
  } else {
    new HemisphericLight("light", new Vector3(1, 1, 1), null);
    camera.alpha += Math.PI / 2.7;
    camera.fov = 0.3 * blockSize;

    let tex = new Texture(
      `img/blocks/${topT}.png`,
      undefined,
      true,
      true,
      Texture.NEAREST_SAMPLINGMODE
    );
    tex.hasAlpha = true;
    const mesh = Mesh.CreatePlane("xplane", 1, null);
    const mat = new StandardMaterial("xplane", null);
    mat.backFaceCulling = false;
    mat.diffuseTexture = tex;
    (mat.diffuseTexture as Texture).vOffset = 0.99;
    mesh.material = mat;
    mesh.rotation.y = -Math.PI / 2;
    const clone = mesh.clone("xplanec");
    clone.rotation.y = Math.PI;
  }

  let rendered = 0;
  engine.runRenderLoop(function () {
    if (scene && scene.activeCamera && rendered < 10) {
      scene.render();
      rendered++;
    } else {
      try {
        canvas2d.getContext("2d").drawImage(engine._gl.canvas, 0, 0);
        engine._gl.getExtension("WEBGL_lose_context").loseContext(); // chrome max contexts fuck you
        glcanvas.remove();
      } catch (e) {}
    }
  });
}
