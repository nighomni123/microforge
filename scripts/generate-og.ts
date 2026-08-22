/**
 * One-off generator for public/og-default.png (1200×630) with zero image
 * dependencies — writes a valid PNG by hand (RGB, zlib via node:zlib).
 * Re-run after rebranding with: pnpm og
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const WIDTH = 1200
const HEIGHT = 630

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buf: Buffer): number {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff]! ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

// Horizontal gradient indigo (#312e81) → violet (#7c3aed), matching the brand.
const raw = Buffer.alloc(HEIGHT * (1 + WIDTH * 3))
let offset = 0
for (let y = 0; y < HEIGHT; y++) {
  raw[offset++] = 0 // filter: none
  for (let x = 0; x < WIDTH; x++) {
    const t = x / (WIDTH - 1)
    raw[offset++] = Math.round(49 + t * (124 - 49))
    raw[offset++] = Math.round(46 + t * (58 - 46))
    raw[offset++] = Math.round(129 + t * (237 - 129))
  }
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(WIDTH, 0)
ihdr.writeUInt32BE(HEIGHT, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 2 // color type: truecolor RGB

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
])

const outPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'og-default.png',
)
fs.writeFileSync(outPath, png)
console.log(`og: wrote ${outPath} (${png.length} bytes)`)
