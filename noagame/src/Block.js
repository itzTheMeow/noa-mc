import noa from "./index";
import { Matrix, Mesh, Texture } from "@babylonjs/core";

let blockID = 1;
let materials = [];

// definetly not from here: https://github.com/VoxelSrv/voxelsrv-old/blob/master/src/lib/gameplay/registry.ts#L147
function xMesh(name) {
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
  mat.diffuseTexture.vOffset = 0.99;
  mesh.material = mat;
  mesh.rotation.y += 0.81;

  const offset = Matrix.Translation(0, 0.5, 0);
  mesh.bakeTransformIntoVertices(offset);
  const clone = mesh.clone();
  clone.rotation.y += 1.62;

  return Mesh.MergeMeshes([mesh, clone], true);
}

let Block = function (name, tex, opts) {
  if (!tex.length) tex = [name];
  opts = Object.assign({}, { transparent: false, prev: tex[0], flowerType: false }, opts);

  tex.forEach((t) => {
    if (!materials.includes(t)) {
      noa.registry.registerMaterial(t, null, `img/blocks/${t}.png`, true);
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

  let blockOptions = {
    material: this.tex.length > 1 ? this.tex : this.tex[0],
    opaque: !this.transparent,
  };
  if (this.flowerType) {
    blockOptions.blockMesh = xMesh(this.tex[0]);
    blockOptions.opaque = false;
    blockOptions.solid = false;
    delete blockOptions.material;
  }
  noa.registry.registerBlock(this.id, blockOptions);
};

export { blockID, Block };
