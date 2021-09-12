import noa from "./index";

let blockID = 1;
let materials = [];

let Block = function (name, tex) {
  if (!tex) tex = [name];
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

  if (tex.length == 1) {
    noa.registry.registerBlock(this.id, { material: tex[0] });
  } else {
    noa.registry.registerBlock(this.id, { material: tex });
  }
};

export { blockID, Block };
