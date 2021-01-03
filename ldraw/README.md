# ldraw

The library will load and parse LDraw files.


```
yarn add ldraw
# or
npm install ldraw
```

```javascript
import { LDraw } from 'ldraw';

async function main() {
  const ldraw = new LDraw();
  const part = await ldraw.find('3001.dat')
  console.log(part);
  console.log(part.subfiles);
  console.log(part.lines);
  console.log(part.triangles);
  console.log(part.quads);
  console.log(part.optionalLines);
}
main();
```

Commands can be the following
```javascript
// 1 - subfile
const subfile = {
  type: 'SUBFILE',
  colour: 2,
  x: 0, y: 0, z: 0,
  a: 0, b: 0, c: 0,
  d: 0, e: 0, f: 0,
  g: 0, h: 0, i: 0,
  file: '3001.dat',
  inverted: true,
}

// 2 - line
const line = {
  type: 'LINE',
  colour: 2,
  x1: 0, y1: 0, z1: 0, // first point
  x2: 1, y2: 1, z2: 1, // second point
};

// 3 - triangle
const triangle = {
  type: 'TRIANGLE',
  colour: 2,
  x1: 0, y1: 0, z1: 0, // first point
  x2: 1, y2: 1, z2: 1, // second point
  x3: 2, y3: 2, z3: 2, // third point
  winding: 'CW',
  certified: true,
};

// 4 - quad
const quad = {
  type: 'QUAD',
  colour: 2,
  x1: 0, y1: 0, z1: 0, // first point
  x2: 1, y2: 1, z2: 1, // second point
  x3: 2, y3: 2, z3: 2, // third point
  x4: 3, y4: 3, z4: 3, // fourth point
  winding: 'CCW',
  certified: true,
};

// 5 - optional line
const optionalLine = {
  type: 'OPTIONAL_LINE',
  colour: 24,
  x1: 0, y1: 0, z1: 0, // first point
  x2: 1, y2: 1, z2: 1, // second point
  x3: 2, y3: 2, z3: 2, // first control point
  x4: 3, y4: 3, z4: 3, // second control point
};
```

This library does not need a special server. It just needs http access to LDraw files to download. If the files are not served from the same domain, the server hosting LDraw files needs to enable CORS access.

```
curl -O https://www.ldraw.org/library/updates/complete.zip && unzip -d example complete.zip && rm complete.zip && rm example/ldraw/mklist*
npx http-server example --cors
open http://127.0.0.1:8080
```

### ESM
```javascript
import { LDraw } from 'ldraw';
import { FileLoader } from 'ldraw/lib/loaders';
```

### CommonJS
```javascript
const { LDraw } = require('ldraw');
const { FileLoader } = require('ldraw/lib/loaders');
```

### Browser - umd
```html
<html>
  <body>
    <script src="https://unpkg.com/ldraw/lib/ldraw.min.js"></script>
    <script>
      const ldraw = new LDRAW.LDraw()
    </script>
  </body>
</html>
```

## Browser

LDraw will attempt to downlaod files from the same origin that the script is
downloaded from.  It defaults to `/ldraw` folder which can be changed. So, if
you run the server as mentioned above, then it will attempt to find files in
http://127.0.0.1/ldraw/

```javascript
import { LDraw } from 'ldraw';

async function main() {
  const ldraw = new LDraw();
  const part = await ldraw.find('3001.dat')
  console.log(part);
}
main();
```

## Node

```javascript
import { LDraw } from 'ldraw';
import { FileLoader } from 'ldraw/lib/loaders';

async function main() {
  const ldraw = new LDraw({ loaders: [FileLoader('/opt/ldraw')] });
  const part = await ldraw.load('parts/3001.dat')
  console.log(part);
}
main();
```

```javascript
import { LDraw } from 'ldraw';
import { FileLoader, UrlLoader } from 'ldraw/lib/loaders';

async function main() {
  const ldraw = new LDraw({
    loaders: [
      FileLoader('/opt/ldraw'),
      UrlLoader('/ldraw')
    ]
  });
  const part = await ldraw.load('parts/3001.dat');
  console.log(part);
}
main();
```

# Loaders

## UrlLoader

By default, the ldraw library looks in /parts, /p, /models folder of a default LDraw directory.  When accessing these through a browser, in the console logs you will see a lot of failed attempts.  The reason this is happening is that when a file references a part, it uses a relative filename

```javascript
import { url } from './loaders/url'
const loader = urlLoader({ dir: '/ldraw', folders: ['parts', 'p', 'models'] });
const loader = urlLoader({ dir: '/ldraw', folders: ['parts', 'p', 'models'] });
loader('3001.dat');
loader('/parts/3001.dat');
```

Examples:
* `https://www.jasonrowland.com/ldraw/library/3001.dat`
* `/ldraw/library/3001.dat`
* `3001.dat`

## fileLoader

The file loader will load from the file system. It is restricted to the current working directory unless `dir` is passed as a parameter. If folders array is provided, it will prepend it to the filename until it finds the file requested.

```javascript
const loader = fileLoader({ dir: '/opt/ldraw', folders: ['parts', 'p', 'models'] });
loader('3001.dat');
loader('/parts/3001.dat');
```

Examples:
* `/parts/3001.dat` - Absolute will only look at the root of dir and not attempt folders
* `3001.dat`

To configure LDraw to look at a file system, you need to use the FileLoader

