# Memory

```
Block:

   e-------f
  /|      /|
 / |     / |
a--|----b  |
|  g----|--h
| /     | /
c-------d
```


## Chunk Loading:
```
radius = 3
 chunk = 810k (let's call it 1Mb per chunk)
memory = 49Mb 49 chunks

┌────┬────┬────┬────┬────┬────┬────┐
│    │    │    │    │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │ xx │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │    │
└────┴────┴────┴────┴────┴────┴────┘
```

## Share Nothing: 5,040,000 bytes

### Bytes

  * chunk: 5,000 blocks * 1,008 bytes = 5,040,000 bytes
  * per block: 36 vertex * 28 bytes
  * per vertex: 28 bytes
    * position: 3 floats (x,y,z) = 12 bytes
    * color: 1 float (4 bytes r,g,b,a)   =  4 bytes
    * normal: 3 floats (x,y,z)   = 12 bytes

## Indexed:

* Each cube face can share two vertices (b&c)
```
a───b
│ / │
c───d
```

### Bytes

* chunk: 5,000 blocks * 816 bytes = 4,080,000
* per block: 24 vertices * 28 bytes, 36 indices = 4 bytes * 36 = 816 bytes
* per vertex: 28 bytes

## Optimized Shader: 810,272 bytes

* color: Since there will be a limited color pallette for blocks, we can use 1 byte as an index into the color array.
* normals: Many cubes will share the exact same normal in the x,y,z direction. Will we conserve memory by using an index into a normal array?
* positions: A cube will be able to share the vertex 6 times.
* block: each block shares avg of 2 vertices with another block to account for blocks that are right next to each other, so 6 unique vertices per block

### Bytes

  * vertices: len=5,000 blocks * 6 unique vertices = 30,000, 3 bytes = 90k
  * normals: len=6, one in each x,y,z direction, 12 bytes = 72 bytes
  * colors: len=50, 4 bytes = 200 bytes
  * per block: 36 * 4 bytes (color, normal, vertext) = 144 bytes
  * blocks: 5,000 * 144 bytes = 720k
