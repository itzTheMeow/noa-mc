import noa from "./index";
import { Matrix, Mesh, Texture } from "@babylonjs/core";
import parseMaterial from "./util/parseMaterial";
import blocks from "./blocks";

export type BlockTypes = "block" | "slab" | "flower";
type BlockOptions = {
  transparent?: boolean;
  prev?: string;
  type?: BlockTypes;
  stackSize?: number;
  drops?: string | null;
  dropAmount?: number;
  unbreakable?: boolean;
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

function slabMesh(names: string[]) {
  // [-x, +x, -y, +y, -z, +z]
  const matTop = noa.rendering.makeStandardMaterial(`matTop-${names[5]}`);
  let topTex = new Texture(
    `img/blocks/${names[5]}.png`, // +z
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );
  const matBottom = noa.rendering.makeStandardMaterial(`matBottom-${names[4]}`);
  let bottomTex = new Texture(
    `img/blocks/${names[4]}.png`, // -z
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );

  const matLeft1 = noa.rendering.makeStandardMaterial(`matLeft1-${names[1]}`);
  let leftTex1 = new Texture(
    `img/blocks/${names[1]}.png`, // +x
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );
  const matLeft2 = noa.rendering.makeStandardMaterial(`matLeft2-${names[0]}`);
  let leftTex2 = new Texture(
    `img/blocks/${names[0]}.png`, // -x
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );

  const matRight1 = noa.rendering.makeStandardMaterial(`matRight1-${names[2]}`);
  let rightTex1 = new Texture(
    `img/blocks/${names[2]}.png`, // -y
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );
  const matRight2 = noa.rendering.makeStandardMaterial(`matRight2-${names[3]}`);
  let rightTex2 = new Texture(
    `img/blocks/${names[3]}.png`, // +y
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );

  [topTex, bottomTex, leftTex1, leftTex2, rightTex1, rightTex2].forEach((t) => {
    t.hasAlpha = true;
  });
  [leftTex1, leftTex2, rightTex1, rightTex2].forEach((t) => {
    t.vScale = 0.5;
  });

  matTop.diffuseTexture = topTex;
  matBottom.diffuseTexture = bottomTex;
  matLeft1.diffuseTexture = leftTex1;
  matLeft2.diffuseTexture = leftTex2;
  matRight1.diffuseTexture = rightTex1;
  matRight2.diffuseTexture = rightTex2;

  let top = Mesh.CreatePlane(`top-${names[0]}`, 1, noa.rendering.getScene());
  top.material = matTop;
  top.rotation.x = Math.PI / 2;
  top.position.y = 0.5;
  let bottom = Mesh.CreatePlane(`bottom-${names[0]}`, 1, noa.rendering.getScene());
  bottom.material = matBottom;
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0;

  let left1 = Mesh.CreatePlane(`left1-${names[0]}`, 1, noa.rendering.getScene());
  left1.material = matLeft1;
  left1.rotation.y = -Math.PI / 2;
  left1.position.x = 0.5;
  let left2 = Mesh.CreatePlane(`left2-${names[0]}`, 1, noa.rendering.getScene());
  left2.material = matLeft2;
  left2.rotation.y = Math.PI / 2;
  left2.position.x = -0.5;

  let right1 = Mesh.CreatePlane(`right1-${names[0]}`, 1, noa.rendering.getScene());
  right1.material = matRight1;
  right1.rotation.y = 0;
  right1.position.z = -0.5;
  let right2 = Mesh.CreatePlane(`right2-${names[0]}`, 1, noa.rendering.getScene());
  right2.material = matRight2;
  right2.rotation.y = -Math.PI;
  right2.position.z = 0.5;

  return Mesh.MergeMeshes([top, bottom, left1, left2, right1, right2], true);
}

class Block {
  public id: number;
  public name: string;
  public tex: string[];
  public preview: string;
  public transparent: boolean;
  public type: BlockTypes;
  public stackSize: number;
  public materials: [string, null, string, true][] = [];
  public block: [number, NoaBlockOptions];
  public drops: [string, number] | null;
  public unbreakable: boolean = false;

  constructor(name: string, tex: string[], opts?: BlockOptions) {
    if (!tex.length) tex = [name];
    opts = Object.assign(
      {},
      {
        transparent: false,
        prev: tex[0],
        type: "block",
        stackSize: 64,
        drops: name,
        dropAmount: 1,
        unbreakable: false,
      },
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
    this.type = opts.type;
    this.stackSize = opts.stackSize;
    this.drops = opts.drops ? [opts.drops, opts.dropAmount] : null;
    this.unbreakable = opts.unbreakable;

    let blockOptions: NoaBlockOptions = {
      material: this.tex.length > 1 ? this.tex : this.tex[0],
      opaque: !this.transparent,
      solid: true,
    };

    switch (this.type) {
      case "flower":
        blockOptions.opaque = blockOptions.solid = false;
        delete blockOptions.material;
        break;
      case "slab":
        blockOptions.opaque = false;
        delete blockOptions.material;
        break;
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
    switch (this.type) {
      case "flower":
        this.block[1].blockMesh = xMesh(this.tex[0]);
        break;
      case "slab":
        this.block[1].blockMesh = slabMesh(parseMaterial(this.tex));
        break;
    }
    noa.registry.registerBlock(...this.block);
  }
}

export { blockID, Block };
