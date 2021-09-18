import _ from "./_";
import { Engine } from "../../noalib";
import { Block } from "./Block";

let GameOptions = {
  sensitivity: 17,
  touchMode:
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent
    ),
  autoJump: false,
  bindings: {
    forward: "W",
    left: "A",
    backward: "S",
    right: "D",
    fire: "<mouse 1>",
    "mid-fire": "<mouse 2>",
    "alt-fire": "<mouse 3>",
    jump: "<space>",
    sprint: "<shift>",
    crouch: "<control>",
    inventory: "E",
    esc: "<escape>",
    hb1: "1",
    hb2: "2",
    hb3: "3",
    hb4: "4",
    hb5: "5",
    hb6: "6",
    hb7: "7",
    hb8: "8",
    hb9: "9",
  },
  thirdPersonZoom: 8,
};
GameOptions.autoJump = GameOptions.touchMode;
(window as any).touchMode = GameOptions.touchMode;
import initCtrlPad from "./control-pad";

require("body-scroll-lock").disableBodyScroll(_("bsl"), {
  allowTouchMove: (e) => {
    return e.id == "control-pad" || e.id == "noa-container";
  },
});

var opts = {
  debug: true,
  showFPS: true,
  chunkSize: 32,
  playerStart: [32, 64, 32],
  gravity: [0, -16, 0],
  sensitivityX: GameOptions.sensitivity,
  sensitivityY: GameOptions.sensitivity,
  bindings: GameOptions.bindings,
  playerAutoStep: GameOptions.autoJump,
  // See `test` example, or noa docs/source, for more options
};
var noa = new Engine(opts);
export default noa;

initCtrlPad();

(window as any).setSensitivity = function (val) {
  GameOptions.sensitivity = +val;
  if ((window as any).touchMode) GameOptions.sensitivity *= 3;
  noa.camera.sensitivityX = noa.camera.sensitivityY = GameOptions.sensitivity;
};
(window as any).setSensitivity(GameOptions.sensitivity);
(window as any).setTouchMode = function (val) {
  GameOptions.touchMode = (window as any).touchMode = val;
  (window as any).updateTouch();
  (window as any).setSensitivity(GameOptions.sensitivity);
  noa.entities.getPhysics(noa.playerEntity).body.autoStep =
    GameOptions.autoJump || GameOptions.touchMode;
};

// [all] [top-bottom,sides] [top,bottom,sides] [-x, +x, -y, +y, -z, +z]
let blocks = {
  dirt: new Block("dirt", []),
  grass: new Block("grass", ["grass_top", "dirt", "grass_side"], { prev: "grass_side" }),
  stone: new Block("stone", []),
  planks: new Block("planks", []),
  sand: new Block("sand", []),
  gravel: new Block("gravel", []),
  bedrock: new Block("bedrock", []),
  cobblestone: new Block("cobblestone", []),
  bricks: new Block("bricks", []),
  obsidian: new Block("obsidian", []),
  mossyCobblestone: new Block("mossy_cobblestone", []),
  oakLog: new Block("oak_log", ["oak_log_face", "oak_log_side"], { prev: "oak_log_side" }),
  glass: new Block("glass", [], { transparent: true }),
  sapling: new Block("sapling", [], { flowerType: true }),
};
let placeBlock = blocks.grass;
let hotbar = [
  blocks.grass,
  blocks.dirt,
  blocks.planks,
  blocks.oakLog,
  blocks.cobblestone,
  blocks.stone,
  blocks.bricks,
  blocks.obsidian,
  blocks.bedrock,
];
let hotbarSelection = 1;
let hotbarScale = 3;

let getHotbarOffset = (n) => -3 + 20 * hotbarScale * (n - 1);

(window as any).setHotbarSelection = function (num) {
  hotbarSelection = num;
  _("hotbar-selection").style.left = getHotbarOffset(num) + "px";
  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => _(`hotbar-item-${n}`).classList.remove("selected"));
  let selection = _(`hotbar-item-${hotbarSelection}`);
  selection.classList.add("selected");
  placeBlock = hotbar[hotbarSelection - 1];
};
(window as any).setHotbarSelection(hotbarSelection);

import blockPreview from "./blockPreview";
let hotbarCache = [];
(window as any).updateHotbar = function (force) {
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => {
    let sel = hotbar[n - 1];
    if (!sel) return;
    if (hotbarCache[n - 1] == sel.id && !force) return;

    let hb = _(`hotbar-item-${n}`);
    if (hb.firstChild) hb.firstChild.remove();

    let glcanv = document.createElement("canvas");
    glcanv.width = 16 * hotbarScale;
    glcanv.height = 16 * hotbarScale;
    glcanv.style.visibility = "none";

    let canv = document.createElement("canvas");
    canv.width = 16 * hotbarScale;
    canv.height = 16 * hotbarScale;

    hb.appendChild(canv);
    document.body.appendChild(glcanv);
    hb.style.left = getHotbarOffset(n) + "px";

    let prev = sel.getPreviewTex();
    blockPreview(glcanv, canv, prev[0], prev[1], prev[2], sel.flowerType);
  });
  hotbarCache = hotbar.map((h) => h.id);
};
(window as any).updateHotbar(true);

(window as any).addEventListener("touchstart", (touch) => {
  if (!touch.target.id.startsWith("hotbar-item-")) return;
  let sel = Number(touch.target.id.substring("hotbar-item-".length)) || 1;
  (window as any).setHotbarSelection(sel);
});

[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
  noa.inputs.down.on(`hb${n}`, () => (window as any).setHotbarSelection(n))
);

noa.blockTargetIdCheck = (id) => {
  return id !== 0;
};

Object.values(blocks).forEach((b) => {
  let item = document.createElement("div");
  item.className = "invblock";
  item.id = `inv-${b.name}`;
  item.style.backgroundImage = `url(img/blocks/${b.preview}.png)`;
  item.onclick = function () {
    hotbar[hotbarSelection - 1] = b;
    (window as any).setHotbarSelection(hotbarSelection);
    (window as any).updateHotbar(false);
    _("blocks").style.display = "none";
    noa.container.setPointerLock(true);
  };
  _("blocks").appendChild(item);
});
noa.inputs.up.on("esc", () => {
  if (_("blocks").style.display !== "none") {
    _("blocks").style.display = "none";
    noa.container.setPointerLock(true);
  }
});

/*
 *
 *      World generation
 *
 *  The world is divided into chunks, and `noa` will emit an
 *  `worldDataNeeded` event for each chunk of data it needs.
 *  The game client should catch this, and call
 *  `noa.world.setChunkData` whenever the world data is ready.
 *  (The latter can be done asynchronously.)
 *
 */

import noise from "./perlin";
let width = 64;
let height = 64;
let filter = new noise(0).read(width, height);
function getVoxelID(x, y, z) {
  if (x >= 64 || y >= 64 || z >= 64) return 0;
  if (x < 0 || y < 0 || z < 0) return 0;

  let h = Math.floor(filter[x + z * width] / 3);
  if (y == 0) return blocks.bedrock.id;
  if (y == h) return blocks.grass.id;
  if (y < h && y >= h - 3) return blocks.dirt.id;
  if (y < h - 3) return blocks.stone.id;
  return 0;
}

// register for world events
noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
  // `id` - a unique string id for the chunk
  // `data` - an `ndarray` of voxel ID data (see: https://github.com/scijs/ndarray)
  // `x, y, z` - world coords of the corner of the chunk
  for (var i = 0; i < data.shape[0]; i++) {
    for (var j = 0; j < data.shape[1]; j++) {
      for (var k = 0; k < data.shape[2]; k++) {
        var voxelID = getVoxelID(x + i, y + j, z + k);
        data.set(i, j, k, voxelID);
      }
    }
  }
  // tell noa the chunk's terrain data is now set
  noa.world.setChunkData(id, data, null);
});

/*
 *
 *      Create a mesh to represent the player:
 *
 */

// get the player entity's ID and other info (position, size, ..)
var player = noa.playerEntity;
var dat = noa.entities.getPositionData(player);
var w = dat.width;
var h = dat.height;

// add a mesh to represent the player, and scale it, etc.
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/Builders/boxBuilder";

var scene = noa.rendering.getScene();
var mesh = Mesh.CreateBox("player-mesh", 1, scene);
mesh.scaling.x = w;
mesh.scaling.z = w;
mesh.scaling.y = h;

// add "mesh" component to the player entity
// this causes the mesh to move around in sync with the player entity
noa.entities.addComponent(player, (noa.entities.names as any).mesh, {
  mesh: mesh,
  // offset vector is needed because noa positions are always the
  // bottom-center of the entity, and Babylon's CreateBox gives a
  // mesh registered at the center of the box
  offset: [0, h / 2, 0],
});

/*
 *
 *      Minimal interactivity
 *
 */

import MPS from "./mesh-particle-system.js";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
let breakTextures = {};
var capacity = 80;
var rate = 80;

let actionTicks = 0;
let mining = false;
function mine() {
  if (noa.targetedBlock) {
    var pos = noa.targetedBlock.position;
    noa.setBlock(0, pos[0], pos[1], pos[2]);

    let block = Object.values(blocks).find((b) => b.id == noa.targetedBlock.blockID);
    let tex =
      breakTextures[block.name] ||
      (breakTextures[block.name] = new Texture(
        `img/blocks/${block.preview}.png`,
        scene,
        true,
        true,
        Texture.NEAREST_SAMPLINGMODE
      ));
    tex.uAng = tex.vAng = Math.PI;
    var mps = new MPS(capacity, rate, scene, null, null, null);
    mps.disposeOnEmpty = true;
    mps.initParticle = function initParticle(pdata) {
      pdata.position.copyFromFloats(Math.random(), Math.max(Math.random(), 0.6), Math.random());
      pdata.velocity.x = ((Math.random() > 0.5 ? 1 : -1) * Math.random()) / 1.5;
      pdata.velocity.y = -Math.random() * 3;
      pdata.velocity.z = ((Math.random() > 0.5 ? 1 : -1) * Math.random()) / 1.5;
      pdata.size = 0.3;
      pdata.age = 0;
      pdata.lifetime = Math.random() * 2;
    };
    mps.setTexture(tex);
    mps.setSizeRange(0.4, 0.4);
    mps.mesh.position.x = pos[0];
    mps.mesh.position.y = pos[1];
    mps.mesh.position.z = pos[2];
    noa.rendering.addMeshToScene(mps.mesh);
    mps.start();
    setTimeout(function () {
      mps.rate = 0;
    }, 350);

    actionTicks = 0;
  }
}
noa.inputs.down.on("alt-fire", function () {
  mining = true;
  mine();
});
noa.inputs.up.on("alt-fire", function () {
  mining = false;
});

let placing = false;
let lastPlacedOn = [];
function place() {
  if (noa.targetedBlock) {
    var pos = noa.targetedBlock.adjacent;
    noa.setBlock(placeBlock.id, pos[0], pos[1], pos[2]);
    lastPlacedOn = [...pos];
  }
}
noa.inputs.down.on("fire", function () {
  placing = true;
  place();
});
noa.inputs.up.on("fire", function () {
  placing = false;
});

noa.inputs.up.on("mid-fire", function () {
  if (noa.targetedBlock) {
    let picked =
      Object.values(blocks).find((b) => b.id == noa.targetedBlock.blockID) || blocks.grass;
    hotbar[hotbarSelection - 1] = picked;
    (window as any).setHotbarSelection(hotbarSelection);
    (window as any).updateHotbar();
  }
});

noa.inputs.up.on("inventory", function () {
  let hidden = _("blocks").style.display == "none";
  _("blocks").style.display = hidden ? "" : "none";
  if (hidden) noa.container.setPointerLock(false);
  else noa.container.setPointerLock(true);
});

noa.on("tick", function (dt) {
  actionTicks++;
  let scroll = noa.inputs.state.scrolly;
  if (scroll !== 0) {
    let sel = hotbarSelection + (scroll > 0 ? 1 : -1);
    if (sel < 1) sel = 9;
    if (sel > 9) sel = 1;
    (window as any).setHotbarSelection(sel);
  }

  let pos = noa.entities.getPositionData(noa.playerEntity).position.map((p) => Math.ceil(p));
  _("coordinate-display").innerHTML = `${pos[0]}, ${pos[1]}, ${pos[2]}`;
  if (pos[1] < 0) noa.entities.setPosition(noa.playerEntity, [32, 64, 32]);

  if (mining && actionTicks % 12 == 0) mine();
  let target = (noa.targetedBlock || {}).position;
  if (target) {
    if (
      placing &&
      (lastPlacedOn[0] !== target[0] ||
        lastPlacedOn[1] !== target[1] ||
        lastPlacedOn[2] !== target[2])
    )
      place();
  }
});
