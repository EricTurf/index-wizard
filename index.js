#!/usr/bin/env node --no-deprecation
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const readDir = fs.readdirSync;
const writeFile = fs.writeFileSync;
const readFile = fs.readFileSync;

const getComponentName = fileName => {
  const parts = fileName.split('-');
  return parts
    .map(part => part.replace(/[a-z]/, part.charAt(0).toUpperCase()))
    .join('');
};

const getIndexContent = fileName => {
  const componentName = getComponentName(fileName);

  return `export { default as ${componentName} } from './${fileName}';`;
};
const input = process.argv.find(arg => arg.includes('--d='));

if (!input) {
  console.error('You must give a directory by using the --d= flag');
  process.exit();
}
const startingDir = path.join(process.cwd(), input.split('=').pop());

const directories = readDir(startingDir);

const getFullPath = filePath => path.join(startingDir, filePath);

const getPretierConfig = () => {
  try {
    return JSON.parse(
      readFile(path.join(process.cwd(), '.prettierrc'), 'utf-8')
    );
  } catch (e) {
    try {
      return JSON.parse(
        readFile(path.join(process.cwd(), '.prettierrc.json'), 'utf-8')
      );
    } catch (e) {
      return {
        singleQuote: true,
        trailingComma: 'es5',
      };
    }
  }
};

const writeIndexFiles = (directoryContent, r) => {
  directoryContent.forEach(content => {
    if (
      content === '__tests__' ||
      (r && content.split('/').pop() === '__tests__')
    )
      return;
    const fullPath = getFullPath(content);

    const isDir = fs.lstatSync(fullPath).isDirectory();

    if (isDir) {
      const indexFilePath = path.join(fullPath, 'index.js');
      const dirContent = readDir(fullPath);

      if (dirContent.includes('index.js')) return;
      if (
        !dirContent.every(c =>
          fs.lstatSync(path.join(fullPath, c)).isDirectory()
        )
      ) {
        writeFile(
          indexFilePath,
          getIndexContent(r === true ? content.split('/').pop() : content)
        );
        const formattedContent = prettier.format(
          readFile(indexFilePath, 'utf-8'),
          Object.assign({}, getPretierConfig(), { parser: 'babylon' })
        );
        writeFile(indexFilePath, formattedContent);
      }

      if (
        dirContent.some(c => fs.lstatSync(path.join(fullPath, c)).isDirectory())
      ) {
        dirContent.forEach(c => {
          writeIndexFiles([`${content}/${c}`], true);
        });
      }
    }
  });
};

writeIndexFiles(directories);
