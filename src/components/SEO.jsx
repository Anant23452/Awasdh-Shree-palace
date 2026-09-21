import { useEffect } from 'react'
import { createSchemas, OG_IMAGE, PAGE_SEO, SITE_NAME, SITE_URL } from '../seo'

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export default function SEO({ path }) {
  useEffect(() => {
    const isNotFound = path === '/404'
    const page = PAGE_SEO[path] || {
      title: 'Page not found | Hotel Awadh Shree Palace',
      description: 'Return to the official Hotel Awadh Shree Palace website.',
    }
    const canonical = `${SITE_URL}${path === '/' || isNotFound ? '/' : path}`

    document.title = page.title
    upsertMeta('meta[name="description"]', { name: 'description', content: page.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: isNotFound ? 'noindex, follow' : 'index, follow, max-image-preview:large' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: page.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: page.description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: OG_IMAGE })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: page.title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: page.description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: OG_IMAGE })

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical

    let schema = document.head.querySelector('#hotel-structured-data')
    if (!schema) {
      schema = document.createElement('script')
      schema.id = 'hotel-structured-data'
      schema.type = 'application/ld+json'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify(createSchemas(path))
  }, [path])

  return null
}
