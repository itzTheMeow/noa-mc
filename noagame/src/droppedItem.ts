import noa from "./index";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/Builders/boxBuilder";
import { MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";
import setInventoryItem from "./setInventoryItem";
import { Block } from "./Block";

export function newDroppedItem(x: number, y: number, z: number, block: Block, count: number = 1) {
  let sz = 0.55;

  const mat = new StandardMaterial("mat", noa.rendering.getScene());
  let texMat = new Texture(
    `img/blocks/${block.preview}.png`,
    noa.rendering.getScene(),
    true,
    true,
    Texture.NEAREST_SAMPLINGMODE
  );
  texMat.hasAlpha = true;
  mat.diffuseTexture = texMat;

  let mesh = MeshBuilder.CreatePlane("droppedItem", { size: sz }, noa.rendering.getScene());
  mesh.material = mat;
  mesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
  mesh.scaling.x = sz;
  mesh.scaling.z = sz;
  mesh.scaling.y = sz;

  let id = (noa.entities as any).add([x, y, z], sz, sz, mesh, [0, sz / 2, 0], true, true);
  (noa.entities as any).addComponent(id, (noa.entities.names as any).collideTerrain);
  (noa.entities as any).addComponent(id, (noa.entities.names as any).collideEntities, {
    callback: function (other) {
      if (other == noa.playerEntity) {
        (noa.entities as any).deleteEntity(id);
        new Array(count).fill(0).map(() => setInventoryItem(block));
      }
    },
  });
}
