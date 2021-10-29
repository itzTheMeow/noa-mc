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
} from "@babylonjs/core";
import { GameOptions } from ".";

let previewCache: { [key: string]: ImageData } = {};

export default class BlockPreview {
  public done: Promise<void>;
  public texString: string;

  constructor(
    glcanvas: HTMLCanvasElement,
    canvas2d: HTMLCanvasElement,
    topT: string,
    leftT: string,
    rightT: string,
    xShape: boolean,
    count?: number
  ) {
    this.texString = `${topT}-${leftT}-${rightT}`;

    this.done = new Promise(async (res) => {
      let tex = previewCache[this.texString];
      if (!tex) tex = await this.getRender(glcanvas, canvas2d, topT, leftT, rightT, xShape);

      let ctx2d = canvas2d.getContext("2d");
      ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
      ctx2d.putImageData(tex, 0, 0);

      if (count > 1) {
        let cpad = 2 * GameOptions.hotbarScale;
        ctx2d.font = 7 * GameOptions.hotbarScale + 1 + "px Minecraft";

        let meas = ctx2d.measureText(String(count));
        let x = canvas2d.width - meas.actualBoundingBoxRight - cpad;
        let y =
          canvas2d.height -
          meas.actualBoundingBoxAscent +
          cpad * (1 + 0.3 * GameOptions.hotbarScale);

        ctx2d.fillStyle = "#3f3f3f";
        ctx2d.fillText(String(count), x + 2, y + 2);
        ctx2d.fillStyle = "#ffffff";
        ctx2d.fillText(String(count), x, y);
      }

      res(void 0);
    });
  }

  async getRender(
    glcanvas: HTMLCanvasElement,
    canvas2d: HTMLCanvasElement,
    topT: string,
    leftT: string,
    rightT: string,
    xShape: boolean
  ): Promise<ImageData> {
    return new Promise((res) => {
      let engine = new Engine(glcanvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false,
      });

      let scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0, 0);

      let camera = new ArcRotateCamera(
        "Camera",
        -Math.PI / 4,
        Math.PI / 3,
        4,
        Vector3.Zero(),
        null
      );
      camera.attachControl(glcanvas, true);

      let blockSize = 1;

      if (!xShape) {
        new HemisphericLight("light", new Vector3(0.8, 1, -0.3), null);
        camera.fov = 0.45 * blockSize;

        const matTop = new StandardMaterial("matTop", null);
        let topTex = new Texture(
          `img/blocks/${topT}.png`,
          null,
          true,
          true,
          Texture.NEAREST_SAMPLINGMODE
        );
        topTex.hasAlpha = true;
        matTop.diffuseTexture = topTex;

        const matLeft = new StandardMaterial("matLeft", null);
        let leftTex = new Texture(
          `img/blocks/${leftT}.png`,
          null,
          true,
          true,
          Texture.NEAREST_SAMPLINGMODE
        );
        leftTex.hasAlpha = true;
        matLeft.diffuseTexture = leftTex;

        const matRight = new StandardMaterial("matRight", null);
        let rightTex = new Texture(
          `img/blocks/${rightT}.png`,
          null,
          true,
          true,
          Texture.NEAREST_SAMPLINGMODE
        );
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
      let texString = this.texString;
      engine.runRenderLoop(function () {
        if (scene && scene.activeCamera && rendered < 10) {
          scene.render();
          rendered++;
        } else if (rendered !== -1) {
          rendered = -1;
          try {
            window.requestAnimationFrame(function () {
              let ctx2d = canvas2d.getContext("2d");
              ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
              ctx2d.drawImage(engine._gl.canvas, 0, 0);
              window.requestAnimationFrame(function () {
                previewCache[texString] = ctx2d.getImageData(0, 0, canvas2d.width, canvas2d.height);
                engine._gl.getExtension("WEBGL_lose_context").loseContext(); // chrome max contexts fuck you
                glcanvas.remove();
                res(previewCache[texString]);
              });
            });
          } catch (e) {}
        }
      });
    });
  }
}
