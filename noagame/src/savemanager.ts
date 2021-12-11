import VoxelCrunch from "voxel-crunch";
import noa, { craftingInv, hotbar, inventory, needsLoaded } from ".";
import blocks from "./blocks";

interface Save {
  world: any;
  hotbar: ([string, number] | null)[];
  inventory: ([string, number] | null)[];
  craftingInv: {
    in: ([string, number] | null)[];
    out: [[string, number] | null];
  };
}
interface GameData {
  hotbar: typeof hotbar;
  inventory: typeof inventory;
  craftingInv: typeof craftingInv;
}

export function saveGame() {
  if (needsLoaded != 0) return;

  let loadedChunks = [
    noa.world._getChunkByCoords(0, 0, 0),
    noa.world._getChunkByCoords(32, 0, 0),
    noa.world._getChunkByCoords(32, 32, 0),
    noa.world._getChunkByCoords(0, 32, 0),
    noa.world._getChunkByCoords(0, 32, 32),
    noa.world._getChunkByCoords(0, 0, 32),
    noa.world._getChunkByCoords(32, 0, 32),
    noa.world._getChunkByCoords(32, 32, 32),
  ];
  let chunks = loadedChunks.map((c) => [
    c.requestID as string,
    c.voxels as any,
  ]);
  let crunched = chunks.map((c) => [
    c[0],
    c[1].data.length,
    { ...c[1], ...{ data: VoxelCrunch.encode(c[1].data) } },
  ]);

  let save: Save = {
    world: crunched,
    hotbar: hotbar.map((h) => (h ? [h[0].name, h[1]] : null)),
    inventory: inventory.map((h) => (h ? [h[0].name, h[1]] : null)),
    craftingInv: {
      in: craftingInv.in.map((h) => (h ? [h[0].name, h[1]] : null)),
      out: [
        craftingInv.out[0]
          ? [craftingInv.out[0][0].name, craftingInv.out[0][1]]
          : null,
      ],
    },
  };
  localStorage.setItem("savegame", JSON.stringify(save));
}

export function savedChunks() {
  let saveGameData = localStorage.getItem("savegame");
  if (!saveGameData) return 0;
  let chunks = JSON.parse(saveGameData).world;
  return chunks.length;
}

export function getSavedChunk(id: string) {
  let saveGameData = localStorage.getItem("savegame");
  if (!saveGameData) return null;
  let chunks = (JSON.parse(saveGameData) as Save).world;

  let found = chunks.find((u) => u[0] == id);
  if (!found) return null;
  return new Uint8Array(Object.values(found[2].data));
}
export function loadInventory(): GameData {
  let saveGameData = localStorage.getItem("savegame");
  if (!saveGameData) return {} as GameData;
  let save = JSON.parse(saveGameData) as Save;
  let data: GameData = {
    hotbar: save.hotbar.map((h) => (h ? [blocks[h[0]], h[1]] : null)),
    inventory: save.inventory.map((h) => (h ? [blocks[h[0]], h[1]] : null)),
    craftingInv: {
      in: save.craftingInv.in.map((h) => (h ? [blocks[h[0]], h[1]] : null)),
      out: [
        save.craftingInv.out[0]
          ? [blocks[save.craftingInv.out[0][0]], save.craftingInv.out[0][1]]
          : null,
      ],
    },
  };
  return data;
}
