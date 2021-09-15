const fs = require("fs");
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

fs.copyFileSync("assets/index.html", "build/index.html");
//fs.copyFileSync("assets/Minecraft.ttf", "build/Minecraft.ttf");
