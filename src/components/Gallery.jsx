import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'
import { gallery } from '../data'
import SectionHeading from './SectionHeading'

export default function Gallery() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const keydown = (event) => {
      if (active === null) return
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((active + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setActive((active - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [active])

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-shell">
        <SectionHeading eyebrow="Inside Awadh" title="A closer look at your stay" copy="Real spaces, warm light and rooms prepared with care." align="center" />
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <button className={`gallery-item gallery-item-${index + 1}`} key={item.src} onClick={() => setActive(index)}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <span>{item.label}<Expand size={17} /></span>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close gallery"><X /></button>
          <button className="lightbox-arrow prev" onClick={() => setActive((active - 1 + gallery.length) % gallery.length)} aria-label="Previous photo"><ArrowLeft /></button>
          <figure>
            <img src={gallery[active].src} alt={gallery[active].alt} />
            <figcaption><span>{gallery[active].label}</span><small>{active + 1} / {gallery.length}</small></figcaption>
          </figure>
          <button className="lightbox-arrow next" onClick={() => setActive((active + 1) % gallery.length)} aria-label="Next photo"><ArrowRight /></button>
        </div>
      )}
    </section>
  )
}
