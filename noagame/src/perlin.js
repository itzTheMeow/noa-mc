import rand from "./random";

function PerlinNoiseFilter(levels) {
  this.seed;
  this.levels;
  this.fuzz;

  this.seed = Math.random();
  this.levels = 0;
  this.fuzz = 16;
  this.levels = levels;

  this.read = function (width, height) {
    let tmp = [];
    let level = this.levels;
    let step = width >> level;

    let val;
    let ss;
    for (val = 0; val < height; val += step) {
      for (ss = 0; ss < width; ss += step) {
        tmp[ss + val * width] = (rand(0, 256 - 1) - 128) * this.fuzz;
      }
    }

    for (step = width >> level; step > 1; step /= 2) {
      val = 256 * (step << level);
      ss = step / 2;

      let y;
      let x;
      let c;
      let r;
      let d;
      let mu;
      let ml;
      for (y = 0; y < height; y += step) {
        for (x = 0; x < width; x += step) {
          c = tmp[(x % width) + (y % height) * width];
          r = tmp[((x + step) % width) + (y % height) * width];
          d = tmp[(x % width) + ((y + step) % height) * width];
          mu = tmp[((x + step) % width) + ((y + step) % height) * width];
          ml = (c + d + r + mu) / 4 + rand(0, val * 2 - 1) - val;
          tmp[x + ss + (y + ss) * width] = ml;
        }
      }

      for (y = 0; y < height; y += step) {
        for (x = 0; x < width; x += step) {
          c = tmp[x + y * width];
          r = tmp[((x + step) % width) + y * width];
          d = tmp[x + ((y + step) % width) * width];
          mu = tmp[((x + ss) & (width - 1)) + ((y + ss - step) & (height - 1)) * width];
          ml = tmp[((x + ss - step) & (width - 1)) + ((y + ss) & (height - 1)) * width];
          let m = tmp[((x + ss) % width) + ((y + ss) % height) * width];
          let u = (c + r + m + mu) / 4 + rand(0, val * 2 - 1) - val;
          let l = (c + d + m + ml) / 4 + rand(0, val * 2 - 1) - val;
          tmp[x + ss + y * width] = u;
          tmp[x + (y + ss) * width] = l;
        }
      }
    }

    let result = [];

    for (val = 0; val < height; ++val) {
      for (ss = 0; ss < width; ++ss) {
        result[ss + val * width] = tmp[(ss % width) + (val % height) * width] / 512 + 128;
      }
    }

    return result;
  };
}

export default PerlinNoiseFilter;
