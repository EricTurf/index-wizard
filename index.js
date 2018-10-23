#!/usr/bin/env node --no-deprecation
const fs = require("fs");
const path = require("path");

const readDir = fs.readdirSync;
const writeFile = fs.writeFileSync;

const getComponentName = fileName => {
  const parts = fileName.split("-");
  return parts
    .map(part => part.replace(/[a-z]/, part.charAt(0).toUpperCase()))
    .join();
};

const getIndexContent = fileName => {
  const componentName = getComponentName(fileName);

  return `export { default as ${componentName} } from './${fileName}'`;
};

const startingDir = process.argv
  .find(arg => arg.includes("--d="))
  .split("=")
  .pop();

const directories = readDir(startingDir);

directories.forEach(dir =>
  writeFile(path.join(dir, "index.js"), getIndexContent(dir))
);
