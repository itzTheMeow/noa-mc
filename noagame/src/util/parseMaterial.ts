export default function parseMaterial(mat: string[]) {
  let mats;
  if (!mat) {
    mats = [null, null, null, null, null, null];
  } else if (typeof mat[0] == "string") {
    mats = [mat[0], mat[0], mat[0], mat[0], mat[0], mat[0]];
  } else if (mat.length && mat.length == 2) {
    // interpret as [top/bottom, sides]
    mats = [mat[1], mat[1], mat[0], mat[0], mat[1], mat[1]];
  } else if (mat.length && mat.length == 3) {
    // interpret as [top, bottom, sides]
    mats = [mat[2], mat[2], mat[0], mat[1], mat[2], mat[2]];
  } else if (mat.length && mat.length == 6) {
    // interpret as [-x, +x, -y, +y, -z, +z]
    mats = mat;
  } else throw "Invalid material parameter: " + mat;

  return mats as [string, string, string, string, string, string];
}
