import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'
import { gallery as defaultGallery } from '../data'
import SectionHeading from './SectionHeading'

export default function Gallery({ items = defaultGallery, pageMode = false }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active !== null && active >= items.length) setActive(null)
  }, [active, items.length])

  useEffect(() => {
    const keydown = (event) => {
      if (active === null) return
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((active + 1) % items.length)
      if (event.key === 'ArrowLeft') setActive((active - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [active, items.length])

  return (
    <section className={`gallery-section ${pageMode ? 'gallery-page-mode' : ''}`} id="gallery">
      <div className="section-shell">
        <SectionHeading eyebrow="Inside Awadh" title="A closer look at your stay" copy="Real spaces, warm light and rooms prepared with care." align="center" />
        <div className="gallery-grid">
          {items.map((item, index) => (
            <button className={`gallery-item gallery-item-${index + 1}`} key={item.src} onClick={() => setActive(index)}>
              <img src={item.src} srcSet={item.srcSet} sizes="(max-width: 620px) 50vw, (max-width: 860px) 50vw, 33vw" width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
              <span>{item.label}<Expand size={17} /></span>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close gallery"><X /></button>
          <button className="lightbox-arrow prev" onClick={() => setActive((active - 1 + items.length) % items.length)} aria-label="Previous photo"><ArrowLeft /></button>
          <figure>
            <img src={items[active].src} width={items[active].width} height={items[active].height} alt={items[active].alt} />
            <figcaption><span>{items[active].label}</span><small>{active + 1} / {items.length}</small></figcaption>
          </figure>
          <button className="lightbox-arrow next" onClick={() => setActive((active + 1) % items.length)} aria-label="Next photo"><ArrowRight /></button>
        </div>
      )}
    </section>
  )
}
