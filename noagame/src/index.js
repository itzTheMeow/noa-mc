import _ from "./_";
import { Engine } from "../../noalib";
import { Block } from "./Block";

let GameOptions = {
  sensitivity: 15,
  touchMode:
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent
    ),
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
  },
};
window.touchMode = GameOptions.touchMode;
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
  sensitivityX: GameOptions.sensitivity,
  sensitivityY: GameOptions.sensitivity,
  bindings: GameOptions.bindings,
  // See `test` example, or noa docs/source, for more options
};
var noa = new Engine(opts);
export default noa;

initCtrlPad(GameOptions);

window.setTouchMode = function (val) {
  GameOptions.touchMode = window.touchMode = val;
  window.updateTouch();
};

// [all] [top-bottom,sides] [top,bottom,sides] [-x, +x, -y, +y, -z, +z]
let blocks = {
  dirt: new Block("dirt", ["dirt"]),
  grass: new Block("grass", ["grass_top", "dirt", "grass_side"]),
  stone: new Block("stone", ["stone"]),
  planks: new Block("planks", ["planks"]),
  sand: new Block("sand", ["sand"]),
  gravel: new Block("gravel", ["gravel"]),
  bedrock: new Block("bedrock", ["bedrock"]),
};
let placeBlock = blocks.grass;

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
window.n = [];
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
  noa.world.setChunkData(id, data);
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
noa.entities.addComponent(player, noa.entities.names.mesh, {
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
import { Texture } from "../../noalib/node_modules/@babylonjs/core/Materials/Textures/texture";
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
    var tex =
      breakTextures[block.name] ||
      (breakTextures[block.name] = new Texture(`img/blocks/${block.tex[0]}.png`, scene));
    var mps = new MPS(capacity, rate, scene);
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

noa.inputs.up.on("mid-fire", function () {
  if (noa.targetedBlock) {
    placeBlock =
      Object.values(blocks).find((b) => b.id == noa.targetedBlock.blockID) || blocks.grass;
  }
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

noa.on("tick", function (dt) {
  actionTicks++;
  var scroll = noa.inputs.state.scrolly;
  if (scroll !== 0) {
    noa.camera.zoomDistance += scroll > 0 ? 1 : -1;
    if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0;
    if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10;
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
