#!/usr/bin/env node

import yargs from 'yargs/yargs';
import fs from 'fs/promises';
import path from 'path';
import { LDraw, SingleFile, SpecType, Comment, parse } from 'ldraw';
import FileLoader from 'ldraw/dist/cjs/loaders/FileLoader';

const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
}).argv;
const dir = argv._[0];

// const argv = yargs(process.argv).positional('library', {
//   describe: 'LDraw library location',
// }).argv;

//const yargs = require('yargs/yargs');
//const { hideBin } = require('yargs/helpers');

async function scan(name: string, ldraw: LDraw, rootFolder: string) {
  const filename = path.join(rootFolder, name);

  const stat = await fs.stat(filename);
  if (stat.isFile()) {
    // Ignore non ldraw files
    if (!['.dat', '.lpr', '.mpd'].includes(path.extname(filename))) {
      return;
    }

    //console.log(filename);
    const text = await fs.readFile(filename, { encoding: 'utf8' });
    const part = parse(text);
    if (part) {
      // const p = part as SingleFile;
      // const comments = p.specs
      //   .filter((s) => s.type === SpecType.COMMENT)
      //   .map((s) => s as Comment);
      // for (const c of comments) {
      //   console.log(c.tokens[0]);
      // }
      console.log(part);
      //console.log(filename, 'parsed');
    } else {
      console.log('!!!!!!!!!! failed');
    }
    return;
  }

  console.log(filename);

  // It's a directory, so scan this baby and recurse
  const entries = await fs.readdir(filename, {
    encoding: 'utf8',
    withFileTypes: true,
  });

  // Files first
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  for (const file of files) {
    await scan(path.join(name, file), ldraw, rootFolder);
  }
  // Now directories
  const subfolders = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  for (const subfolder of subfolders) {
    await scan(path.join(name, subfolder), ldraw, rootFolder);
  }
}

async function main() {
  const loader = FileLoader(dir);
  const ldraw = new LDraw({ loadFile: loader });
  const rootFolder = path.join(dir);
  scan('', ldraw, rootFolder);

  //console.log(part);
  // console.log(partsDir);
  // const files = await fs.readdir(partsDir, {
  //   encoding: 'utf8',
  // });
  // for (const filename of files) {
  //   const data = await fs.readFile(path.join(partsDir, filename), {
  //     encoding: 'utf8',
  //   });
  //   const parsed = ldraw.parse(data);
  //   console.log(parsed);
  // }
}

console.log('hello world');
main();
