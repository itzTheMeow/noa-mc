let prod = false;

let buildOpts = {
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "build/bundle.js",
  minify: true,
  sourcemap: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error("Watch build failed:", error);
      else console.log("Rebuilt!");
    },
  },
  target: "es2020",
};
let serveOpts = {
  port: 8080,
  servedir: "build",
};

console.log("Building...");
require("esbuild")
  .build(buildOpts)
  .then(() => {
    console.log("Built!");
    let app = require("express")();
    app.use(require("express").static(serveOpts.servedir));
    app.listen(serveOpts.port, () => console.log("Listening..."));
  })
  .catch(() => process.exit(1));
