var fs = require("fs");

function deleteFolderRecursive(path, delExts) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
  }
}

console.log("Cleaning working tree...");

deleteFolderRecursive("./build");

console.log("Successfully cleaned working tree!");