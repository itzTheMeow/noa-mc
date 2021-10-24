let CONFIG = {
  buildOptions: {
    entryPoints: ["src/index.ts"],
    outfile: "build/bundle.js",
    bundle: true,
    //minify: true, // https://github.com/evanw/esbuild/issues/1618
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("Watch build failed:", error);
        else console.log("Rebuilt!");
      },
    },
    target: "es2020",
  },
  serveOptions: {
    port: 8080,
    servedir: "build",
  },
  copyFiles: ["index.html"],
  cleanIgnore: ["babylon.js"],
};

// ==================================================== //
//                Clean build directory.                //
// ==================================================== //

const fs = require("fs");

function deleteFolderRecursive(path, delExts) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      let curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        let ignored = CONFIG.cleanIgnore
          .map((i) => curPath.toLowerCase().includes(i.toLowerCase()))
          .includes(true);
        if (!ignored) fs.unlinkSync(curPath);
      }
    });
  }
}

console.log("Cleaning working tree...");

deleteFolderRecursive("./build");

console.log("Successfully cleaned working tree!");

// =================================================== //
//                   Compile assets.                   //
//             HTML + CSS + Images + Fonts             //
// =================================================== //

const sass = require("sass");

let allStyle = "";
fs.readdirSync("assets/css").forEach((css) => {
  let compiled = sass.renderSync({ file: `assets/css/${css}` });
  allStyle += String(`${compiled.css}\n`);
});
if (allStyle) fs.writeFileSync("build/style.css", allStyle);
else console.error("No css.");

try {
  fs.mkdirSync("build/img");
} catch (e) {}
fs.readdirSync("assets/img").forEach((dir) => {
  try {
    fs.mkdirSync(`build/img/${dir}`);
  } catch (e) {}
  fs.readdirSync(`assets/img/${dir}`).forEach((a) => {
    fs.copyFileSync(`assets/img/${dir}/${a}`, `build/img/${dir}/${a}`);
  });
});

try {
  fs.mkdirSync("build/font");
} catch (e) {}
fs.readdirSync("assets/font").forEach((font) => {
  fs.copyFileSync(`assets/font/${font}`, `build/font/${font}`);
});

CONFIG.copyFiles.forEach((f) => {
  fs.copyFileSync(`assets/${f}`, `build/${f}`);
});

// ==================================================== //
//                 Build using esbuild.                 //
// ==================================================== //

const { build } = require("esbuild");

console.log("Building...");
build(CONFIG.buildOptions)
  .then(() => {
    console.log("Built!");
    let app = require("express")();
    app.use(require("express").static(CONFIG.serveOptions.servedir));
    app.listen(CONFIG.serveOptions.port, () => console.log("Listening..."));
  })
  .catch(() => process.exit(1));
