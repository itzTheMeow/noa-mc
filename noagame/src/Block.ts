import noa from "./index";
import { Matrix, Mesh, Texture } from "@babylonjs/core";

type BlockOptions = {
  transparent?: boolean;
  prev?: string;
  flowerType?: boolean;
  stackSize?: number;
};
type NoaBlockOptions = {
  material: string | string[];
  opaque: boolean;
  solid: boolean;
  blockMesh?: Mesh;
};

let blockID: number = 1;
let materials: string[] = [];

// definetly not from here: https://github.com/VoxelSrv/voxelsrv-old/blob/master/src/lib/gameplay/registry.ts#L147
function xMesh(name: string) {
  let tex = new Texture(
    `img/blocks/${name}.png`,
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );
  tex.hasAlpha = true;
  const mesh = Mesh.CreatePlane("xblock-" + name, 1, noa.rendering.getScene());
  const mat = noa.rendering.makeStandardMaterial(name);
  mat.backFaceCulling = false;
  mat.diffuseTexture = tex;
  (mat.diffuseTexture as Texture).vOffset = 0.99;
  mesh.material = mat;
  mesh.rotation.y += 0.81;

  const offset = Matrix.Translation(0, 0.5, 0);
  mesh.bakeTransformIntoVertices(offset);
  const clone = mesh.clone();
  clone.rotation.y += 1.62;

  return Mesh.MergeMeshes([mesh, clone], true);
}

class Block {
  public id: number;
  public name: string;
  public tex: string[];
  public preview: string;
  public transparent: boolean;
  public flowerType: boolean;
  public stackSize: number;
  public materials: [string, null, string, true][] = [];
  public block: [number, NoaBlockOptions];

  constructor(name: string, tex: string[], opts?: BlockOptions) {
    if (!tex.length) tex = [name];
    opts = Object.assign(
      {},
      { transparent: false, prev: tex[0], flowerType: false, stackSize: 64 },
      opts
    );

    tex.forEach((t) => {
      if (!materials.includes(t)) {
        this.materials.push([t, null, `img/blocks/${t}.png`, true]);
        materials.push(t);
      }
    });

    this.id = blockID;
    blockID++;
    this.name = name;
    this.tex = tex;
    this.preview = opts.prev;
    this.transparent = opts.transparent;
    this.flowerType = opts.flowerType;
    this.stackSize = opts.stackSize;

    let blockOptions: NoaBlockOptions = {
      material: this.tex.length > 1 ? this.tex : this.tex[0],
      opaque: !this.transparent,
      solid: true,
    };

    if (this.flowerType) {
      blockOptions.blockMesh = xMesh(this.tex[0]);
      blockOptions.opaque = blockOptions.solid = false;
      delete blockOptions.material;
    }
    this.block = [this.id, blockOptions];
  }

  public getPreviewTex() {
    if (this.tex.length == 1) return [this.tex[0], this.tex[0], this.tex[0]];
    else if (this.tex.length == 2) return [this.tex[0], this.tex[1], this.tex[1]];
    else if (this.tex.length == 3) return [this.tex[0], this.tex[2], this.tex[2]];
    else return [this.tex[3], this.tex[1], this.tex[5]];
  }

  public register() {
    this.materials.forEach((m) => {
      noa.registry.registerMaterial(...m);
    });
    noa.registry.registerBlock(...this.block);
  }
}

export { blockID, Block };
