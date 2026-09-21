import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceDirectory = path.resolve('source-assets')
const outputDirectory = path.resolve('public/assets/optimized')

const images = [
  ['hq-awadh-building.png', 'hotel-awadh-shree-palace-ayodhya-exterior', [480, 960, 1440, 1672]],
  ['hq-reception.png', 'hotel-awadh-shree-palace-reception', [480, 800, 1122]],
  ['hq-classic-room.png', 'awadh-shree-palace-deluxe-room', [480, 800, 1122]],
  ['hq-family-suite.png', 'awadh-shree-palace-family-room', [480, 800, 1122]],
  ['hq-family-premium.png', 'awadh-shree-palace-premium-room', [480, 800, 1200]],
  ['hq-deluxe-king.png', 'awadh-shree-palace-king-room', [480, 800, 1200]],
  ['hq-hotel-spaces.png', 'hotel-awadh-shree-palace-interiors', [480, 800, 1200]],
]

await mkdir(outputDirectory, { recursive: true })

for (const [filename, slug, widths] of images) {
  const input = path.join(sourceDirectory, filename)
  for (const width of widths) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5, smartSubsample: true })
      .toFile(path.join(outputDirectory, `${slug}-${width}.webp`))
  }
}

await sharp(path.join(sourceDirectory, 'hq-awadh-building.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 88, progressive: true, chromaSubsampling: '4:4:4' })
  .toFile(path.join(outputDirectory, 'hotel-awadh-shree-palace-og.jpg'))

const iconSvg = Buffer.from(`
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="70" fill="#5a1d2b"/>
    <rect x="38" y="38" width="436" height="436" rx="46" fill="none" stroke="#d8bd82" stroke-width="12"/>
    <text x="256" y="337" text-anchor="middle" font-family="Georgia, serif" font-size="250" fill="#f6f0e5">अ</text>
  </svg>
`)

await sharp(iconSvg).resize(180, 180).png().toFile(path.resolve('public/apple-touch-icon.png'))
await sharp(iconSvg).resize(48, 48).png().toFile(path.resolve('public/favicon-48.png'))
await sharp(iconSvg).resize(192, 192).png().toFile(path.resolve('public/icon-192.png'))
await sharp(iconSvg).resize(512, 512).png().toFile(path.resolve('public/icon-512.png'))

const faviconPng = await sharp(iconSvg).resize(48, 48).png().toBuffer()
const icoHeader = Buffer.alloc(22)
icoHeader.writeUInt16LE(0, 0)
icoHeader.writeUInt16LE(1, 2)
icoHeader.writeUInt16LE(1, 4)
icoHeader.writeUInt8(48, 6)
icoHeader.writeUInt8(48, 7)
icoHeader.writeUInt8(0, 8)
icoHeader.writeUInt8(0, 9)
icoHeader.writeUInt16LE(1, 10)
icoHeader.writeUInt16LE(32, 12)
icoHeader.writeUInt32LE(faviconPng.length, 14)
icoHeader.writeUInt32LE(22, 18)
await import('node:fs/promises').then(({ writeFile }) => writeFile(path.resolve('public/favicon.ico'), Buffer.concat([icoHeader, faviconPng])))

console.log('Responsive hotel images and brand icons generated.')
