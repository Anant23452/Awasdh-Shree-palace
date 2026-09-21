import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createSchemas, FAQ_ITEMS, INDEXABLE_PATHS, OG_IMAGE, PAGE_SEO, SITE_NAME, SITE_URL } from '../src/seo.js'

const distDirectory = path.resolve('dist')
const templatePath = path.join(distDirectory, 'index.html')
const template = await readFile(templatePath, 'utf8')

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const escapeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

function createFallback(page, pathName) {
  const links = '<a href="/rooms">Rooms</a> <a href="/amenities">Amenities</a> <a href="/gallery">Gallery</a> <a href="/location">Location</a> <a href="/about">About</a> <a href="/contact">Contact</a> <a href="/faq">FAQs</a>'
  const staticContent = {
    '/': '<h2>Hotel rooms and direct enquiries</h2><p>Review Deluxe, Family and Premium room categories, hotel facilities, real property photographs and the Saketpuri, Deokali address.</p>',
    '/rooms': '<h2>Room categories</h2><p>Deluxe Room: two guests and one king bed. Family Room: up to four guests and two queen beds. Premium Room: up to four guests and two king beds. Availability and the final rate are confirmed directly by the hotel.</p>',
    '/amenities': '<h2>Hotel facilities</h2><p>Listed facilities include free Wi-Fi, free parking, air-conditioned rooms, hot and cold water, daily housekeeping, lift access, power backup and 24-hour assistance.</p>',
    '/gallery': '<h2>Real hotel photography</h2><p>View photographs of Hotel Awadh Shree Palace rooms, reception, corridors, lift and other property spaces.</p>',
    '/location': '<h2>Hotel address</h2><address>Behind Blinkit Store, Saketpuri, Deokali, Ayodhya, Uttar Pradesh 224001</address><p>Use live Google Maps directions for current road conditions and journey time.</p>',
    '/about': '<h2>About the hotel</h2><p>Hotel Awadh Shree Palace provides a practical Ayodhya stay for families, pilgrims and other travellers, with direct room enquiries and local guidance.</p>',
    '/contact': '<h2>Contact the hotel</h2><p>Call +91 91964 22812 or send a WhatsApp enquiry to confirm room availability, guest capacity, dates or directions.</p>',
    '/ayodhya-travel-guide': '<h2>Plan with current information</h2><p>Check official access information and live road routes before visiting Ayodhya places. Leave flexibility for local traffic and queues.</p>',
    '/hotel-near-ram-mandir-ayodhya': '<h2>Plan the live route to Ram Mandir</h2><p>The hotel is in Saketpuri, Deokali, Ayodhya. Use current Google Maps directions rather than relying on a fixed journey-time claim.</p>',
    '/faq': `<h2>Hotel questions</h2>${FAQ_ITEMS.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('')}`,
  }[pathName] || ''
  return `<main class="seo-static"><h1>${escapeHtml(page.h1 || page.title)}</h1><p>${escapeHtml(page.description)}</p>${staticContent}<nav aria-label="Hotel pages">${links}</nav>${pathName !== '/' ? '<p><a href="/">Hotel Awadh Shree Palace home</a></p>' : ''}</main>`
}

function renderHtml(pathName, page, noindex = false) {
  const canonical = `${SITE_URL}${pathName === '/' || noindex ? '/' : pathName}`
  let html = template
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<script id="hotel-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script id="hotel-structured-data" type="application/ld+json">${escapeJson(createSchemas(noindex ? '/404' : pathName))}</script>`)
    .replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/i, `<div id="root">${createFallback(page, pathName)}</div>\n  </body>`)

  html = html.replace(/(<meta name="description" content=")[^"]*("\s*\/>)/i, `$1${escapeHtml(page.description)}$2`)
  html = html.replace(/(<meta name="robots" content=")[^"]*("\s*\/>)/i, `$1${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}$2`)
  html = html.replace(/(<meta property="og:title" content=")[^"]*("\s*\/>)/i, `$1${escapeHtml(page.title)}$2`)
  html = html.replace(/(<meta property="og:description" content=")[^"]*("\s*\/>)/i, `$1${escapeHtml(page.description)}$2`)
  html = html.replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/i, `$1${canonical}$2`)
  html = html.replace(/(<meta property="og:image" content=")[^"]*("\s*\/>)/i, `$1${OG_IMAGE}$2`)
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*("\s*\/>)/i, `$1${escapeHtml(page.title)}$2`)
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*("\s*\/>)/i, `$1${escapeHtml(page.description)}$2`)
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*("\s*\/>)/i, `$1${OG_IMAGE}$2`)
  return html
}

for (const pathName of INDEXABLE_PATHS) {
  const html = renderHtml(pathName, PAGE_SEO[pathName])
  if (pathName === '/') {
    await writeFile(templatePath, html)
  } else {
    const routeDirectory = path.join(distDirectory, pathName.slice(1))
    await mkdir(routeDirectory, { recursive: true })
    await writeFile(path.join(routeDirectory, 'index.html'), html)
    await writeFile(path.join(distDirectory, `${pathName.slice(1)}.html`), html)
  }
}

const notFound = { title: `Page not found | ${SITE_NAME}`, description: 'Return to the official Hotel Awadh Shree Palace website.', h1: 'This page could not be found' }
await writeFile(path.join(distDirectory, '404.html'), renderHtml('/404', notFound, true))
console.log(`Prepared ${INDEXABLE_PATHS.length} crawlable pages plus a branded 404 page.`)
