/*
 *
 *          noa hello-world example
 *
 *  This is a bare-minimum example world, intended to be a
 *  starting point for hacking on noa game world content.
 *
 */

import { Engine } from "../../noalib";
import { Block } from "./Block";

let GameOptions = {
  sensitivity: 15,
};

var opts = {
  debug: true,
  showFPS: true,
  chunkSize: 32,
  playerStart: [32, 64, 32],
  sensitivityX: GameOptions.sensitivity,
  sensitivityY: GameOptions.sensitivity,
  // See `test` example, or noa docs/source, for more options
};
var noa = new Engine(opts);
export default noa;

// [all] [top-bottom,sides] [top,bottom,sides] [-x, +x, -y, +y, -z, +z]
let dirt = new Block("dirt", ["dirt"]);
let grass = new Block("grass", ["grass_top", "dirt", "grass_side"]);
let stone = new Block("stone", ["stone"]);
let planks = new Block("planks", ["planks"]);
let sand = new Block("sand", ["sand"]);
let gravel = new Block("gravel", ["gravel"]);
let bedrock = new Block("bedrock", ["bedrock"]);

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
  if (y == 0) return bedrock.id;
  if (y == h) return grass.id;
  if (y < h && y >= h - 3) return dirt.id;
  if (y < h - 3) return stone.id;
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
import _ from "./_";

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

let actionTicks = 0;
let mining = false;
function mine() {
  if (noa.targetedBlock) {
    var pos = noa.targetedBlock.position;
    noa.setBlock(0, pos[0], pos[1], pos[2]);
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
    noa.setBlock(grass.id, pos[0], pos[1], pos[2]);
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
