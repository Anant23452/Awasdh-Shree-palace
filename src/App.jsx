import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  CigaretteOff,
  Clock3,
  IdCard,
  Images,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Settings,
  Sparkles,
  UtensilsCrossed,
  Users,
  WineOff,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import BookingBar from './components/BookingBar'
import Gallery from './components/Gallery'
import SectionHeading from './components/SectionHeading'
import SEO from './components/SEO'
import SitePage from './components/SitePages'
import { facilities, gallery, rooms, trustItems } from './data'
import { HOTEL, normalisePath } from './seo'
import { trackEvent } from './analytics'

const OwnerStudio = lazy(() => import('./components/OwnerStudio'))

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/JJ7KRoCftp8ind83A?g_st=aw'
const HOTEL_ORIGIN = 'Hotel Awadh Shree Palace, Saketpuri, Deokali, Ayodhya, Uttar Pradesh 224001'
const OWNER_CONTENT_KEY = 'awadh-owner-content-v1'
const EMPTY_OWNER_CONTENT = {
  roomPrices: {},
  hiddenGallery: [],
  customGallery: [],
  hiddenFacilities: [],
  customFacilities: [],
  updatedAt: null,
}
const OWNER_STUDIO_ENABLED = import.meta.env.VITE_ENABLE_OWNER_STUDIO !== 'false'

function normaliseOwnerContent(value) {
  const content = value && typeof value === 'object' ? value : {}
  return {
    ...EMPTY_OWNER_CONTENT,
    ...content,
    roomPrices: content.roomPrices && typeof content.roomPrices === 'object' ? content.roomPrices : {},
    hiddenGallery: Array.isArray(content.hiddenGallery) ? content.hiddenGallery : [],
    customGallery: Array.isArray(content.customGallery) ? content.customGallery : [],
    hiddenFacilities: Array.isArray(content.hiddenFacilities) ? content.hiddenFacilities : [],
    customFacilities: Array.isArray(content.customFacilities) ? content.customFacilities : [],
  }
}

function saveLocalBackup(content) {
  try {
    localStorage.setItem(OWNER_CONTENT_KEY, JSON.stringify(content))
  } catch {
    // A cloud save can still succeed if the browser cannot keep a local backup.
  }
}

function loadOwnerContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(OWNER_CONTENT_KEY))
    return normaliseOwnerContent(saved)
  } catch {
    return normaliseOwnerContent()
  }
}

const buildDirectionsUrl = (destination) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(HOTEL_ORIGIN)}&destination=${encodeURIComponent(destination)}&travelmode=driving`

const buildRouteEmbedUrl = (destination) =>
  `https://maps.google.com/maps?saddr=${encodeURIComponent(HOTEL_ORIGIN)}&daddr=${encodeURIComponent(destination)}&output=embed`

function Hero() {
  return (
    <section className="hero" id="top">
      <picture className="hero-image">
        <source
          type="image/webp"
          srcSet="/assets/optimized/hotel-awadh-shree-palace-ayodhya-exterior-480.webp 480w, /assets/optimized/hotel-awadh-shree-palace-ayodhya-exterior-960.webp 960w, /assets/optimized/hotel-awadh-shree-palace-ayodhya-exterior-1440.webp 1440w, /assets/optimized/hotel-awadh-shree-palace-ayodhya-exterior-1672.webp 1672w"
          sizes="100vw"
        />
        <img src="/assets/optimized/hotel-awadh-shree-palace-ayodhya-exterior-1672.webp" width="1672" height="941" alt="Hotel Awadh Shree Palace exterior in Ayodhya at sunset" fetchPriority="high" decoding="async" />
      </picture>
      <div className="hero-grain" />
      <div className="hero-content section-shell">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> Welcome to Ayodhya</p>
          <h1>Hotel Awadh Shree Palace, <em>Ayodhya.</em></h1>
          <p>Peaceful rooms, genuine hospitality and an easy base for families, pilgrims and travellers exploring the sacred city.</p>
          <div className="hero-ctas">
            <a className="button button-gold" href="#booking">Check availability <ArrowRight size={17} /></a>
            <a className="hero-link" href="/rooms"><span><BedDouble size={16} /></span> View rooms</a>
          </div>
        </div>
        <div className="hero-note">
          <span className="hero-note-line" />
          <small>Made for unhurried stays</small>
          <strong>Comfort for the whole family</strong>
        </div>
      </div>
      <div className="hero-scroll"><ArrowDown size={18} /> Scroll to explore</div>
      <div className="hero-booking section-shell"><BookingBar /></div>
    </section>
  )
}

function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="section-shell trust-grid">
        {trustItems.map(({ icon: Icon, value, label }) => (
          <div className="trust-item" key={value}>
            <span className="trust-icon"><Icon size={20} /></span>
            <span><strong>{value}</strong><small>{label}</small></span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="story section-shell" id="story">
      <div className="story-media">
        <div className="story-image-main"><img src="/assets/optimized/hotel-awadh-shree-palace-reception-1122.webp" srcSet="/assets/optimized/hotel-awadh-shree-palace-reception-480.webp 480w, /assets/optimized/hotel-awadh-shree-palace-reception-800.webp 800w, /assets/optimized/hotel-awadh-shree-palace-reception-1122.webp 1122w" sizes="(max-width: 860px) 85vw, 45vw" width="1122" height="1402" alt="Reception area at Hotel Awadh Shree Palace Ayodhya" loading="lazy" decoding="async" /></div>
        <div className="story-video">
          <video controls muted playsInline poster="/assets/hotel-tour-poster.jpg" preload="metadata">
            <source src="/assets/awadh-hotel-tour.mp4" type="video/mp4" />
          </video>
          <span><Play size={15} fill="currentColor" /> Take a quick tour</span>
        </div>
        <span className="story-stamp">अवध<br /><small>Ayodhya</small></span>
      </div>
      <div className="story-copy">
        <SectionHeading eyebrow="The Awadh welcome" title="A peaceful retreat, made personal." />
        <p>At Hotel Awadh Shree Palace, comfort is simple: a clean room, a warm welcome and thoughtful help whenever you need it. We are here to make your Ayodhya journey feel lighter.</p>
        <p>Set in Saketpuri, Deokali, our stay is especially suited to families and pilgrims who value ease, space and a calm place to return to.</p>
        <div className="story-details">
          <span><strong>24 × 7</strong><small>Guest assistance</small></span>
          <span><strong>Family</strong><small>Friendly rooms</small></span>
          <span><strong>Local</strong><small>Travel guidance</small></span>
        </div>
        <a className="arrow-link" href="#facilities">See what’s included <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}

function Rooms({ items }) {
  return (
    <section className="rooms-section" id="rooms">
      <div className="section-shell">
        <div className="rooms-heading-row">
          <SectionHeading eyebrow="Rooms & family stays" title="Room to rest. Space to reconnect." copy="Choose a comfortable stay shaped around the way you travel." />
          <a className="arrow-link desktop-only" href="#booking">Check your dates <ArrowRight size={17} /></a>
        </div>
        <div className="room-grid">
          {items.map((room, index) => (
            <article className={`room-card ${room.featured ? 'featured' : ''}`} key={room.name}>
              <div className="room-image">
                <img src={room.image} srcSet={room.srcSet} sizes="(max-width: 620px) 100vw, (max-width: 860px) 50vw, 33vw" width={room.width} height={room.height} alt={`${room.name} at Hotel Awadh Shree Palace Ayodhya`} loading="lazy" decoding="async" />
                <span>0{index + 1}</span>
                {room.featured && <small>Family favourite</small>}
              </div>
              <div className="room-content">
                <div className="room-meta"><span><Users size={15} /> {room.guests}</span><span><BedDouble size={15} /> {room.bed}</span></div>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <ul>{room.amenities.map((item) => <li key={item}>{item}</li>)}</ul>
                <div className="room-booking-row">
                  <div className="room-rate"><span>From</span><strong>{room.price}</strong><small>/ night</small></div>
                  <a href="#booking" className="room-book-button">Book now <ArrowRight size={15} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="room-price-note">Starting rates are per room, per night. Taxes and festival-date pricing may vary; the hotel will confirm the final amount before booking.</p>
      </div>
    </section>
  )
}

function Facilities({ items }) {
  return (
    <section className="facilities-section" id="facilities">
      <div className="section-shell facilities-layout">
        <div className="facilities-intro">
          <SectionHeading eyebrow="Everything you need" title="Comfort, without complication." copy="The essentials are already taken care of, so your time in Ayodhya can stay focused on what matters." />
          <div className="facilities-note"><span>“</span><p>A practical, welcoming stay with the little comforts that make travel easier.</p></div>
        </div>
        <div className="facility-grid">
          {items.map(({ icon: Icon, title, copy }) => (
            <article className="facility-card" key={title}>
              <Icon size={25} strokeWidth={1.5} />
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Policies() {
  const policies = [
    { icon: UtensilsCrossed, title: 'Pure vegetarian property', copy: 'Non-vegetarian food is not permitted anywhere inside the hotel.' },
    { icon: WineOff, title: 'No alcohol inside', copy: 'Alcohol consumption is not allowed in rooms or anywhere on hotel premises.' },
    { icon: CigaretteOff, title: 'Non-smoking rooms', copy: 'Smoking is not allowed inside guest rooms or indoor common areas.' },
    { icon: IdCard, title: 'Valid ID required', copy: 'Every adult guest must present a valid government photo ID at check-in.' },
    { icon: Clock3, title: 'Check-in & check-out', copy: 'Check-in from 12:00 PM and check-out by 11:00 AM. Early or late requests depend on availability.' },
    { icon: BadgeCheck, title: 'Registered guests only', copy: 'Visitors and additional guests must be registered with reception before entering guest areas.' },
  ]

  return (
    <section className="policies-section" id="policies">
      <div className="section-shell">
        <SectionHeading eyebrow="Good to know" title="Simple policies for a peaceful stay." copy="Please review these house rules before arrival so every guest can enjoy a comfortable, respectful stay." align="center" />
        <div className="policy-grid">
          {policies.map(({ icon: Icon, title, copy }) => (
            <article className="policy-card" key={title}>
              <span><Icon size={22} strokeWidth={1.6} /></span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
        <p className="policy-note">Alcohol may be consumed only outside the hotel property. Please contact reception if you have any questions before booking.</p>
      </div>
    </section>
  )
}

function Ayodhya() {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const places = [
    { number: '01', name: 'Jai Mata Di Temple', time: 'Approx. 0.9 km from hotel', destination: 'Jai Mata Di Temple, Ayodhya', distance: '0.9 km', driveTime: 'a very short local ride' },
    { number: '02', name: 'Durga Mandir', time: 'Approx. 1.8 km from hotel', destination: 'Durga Mandir, Ayodhya', distance: '1.8 km', driveTime: 'a short local ride' },
    { number: '03', name: 'Shri Ram Mandir', time: 'Approx. 2.1 km from hotel', destination: 'Shri Ram Janmabhoomi Mandir, Ayodhya', distance: '2.7 km', driveTime: 'check the live road route' },
    { number: '04', name: 'Hanuman Garhi', time: 'Historic hilltop temple · live route', destination: 'Hanuman Garhi Mandir, Ayodhya' },
    { number: '05', name: 'Kanak Bhawan', time: 'Sacred palace temple · live route', destination: 'Kanak Bhawan, Ayodhya' },
    { number: '06', name: 'Saryu Ghat', time: 'Approx. 5.9 km by the fastest road route', destination: 'Saryu Ghat Ayodhya, Naya Ghat, Ayodhya, Uttar Pradesh 224123', distance: '6.9 km', driveTime: 'about 18 min by car' },
    { number: '07', name: 'Ayodhya Airport', time: 'Approx. 4.2 km from hotel', destination: 'Maharishi Valmiki International Airport Ayodhya Dham', distance: '4.2 km', driveTime: 'check the live road route' },
  ]

  return (
    <section className="ayodhya-section" id="ayodhya">
      <div className="ayodhya-pattern" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="section-shell ayodhya-layout">
        <div className="ayodhya-copy">
          <p className="eyebrow light"><span />Your Ayodhya journey<span /></p>
          <h2>Wake up near a city of timeless stories.</h2>
          <p>From temple mornings to peaceful evenings by the Saryu, discover Ayodhya at your own pace. Our team can help with directions, local transport and simple recommendations.</p>
          <a className="button button-ivory" href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer"><MapPin size={17} /> Find us on Maps</a>
        </div>
        <div className="place-list">
          {places.map((place) => (
            <button className={`place-item ${selectedPlace?.name === place.name ? 'active' : ''}`} key={place.name} onClick={() => setSelectedPlace(place)} aria-expanded={selectedPlace?.name === place.name}>
              <span>{place.number}</span>
              <div><strong>{place.name}</strong><small>{place.time}</small></div>
              <ArrowRight size={18} />
            </button>
          ))}
          {selectedPlace && (
            <div className="route-panel">
              <div className="route-panel-heading">
                <div><small>From Hotel Awadh Shree Palace</small><strong>Route to {selectedPlace.name}</strong></div>
                <button onClick={() => setSelectedPlace(null)} aria-label="Close route">×</button>
              </div>
              {selectedPlace.distance && (
                <div className="route-distance">
                  <span><small>Approx. distance</small><strong>{selectedPlace.distance}</strong></span>
                  <span><small>Typical fastest drive</small><strong>{selectedPlace.driveTime}</strong></span>
                </div>
              )}
              <iframe
                title={`Route from Hotel Awadh Shree Palace to ${selectedPlace.name}`}
                src={buildRouteEmbedUrl(selectedPlace.destination)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="route-panel-footer">
                <span><MapPin size={15} /> Google Maps shows the live road distance and travel time.</span>
                <a href={buildDirectionsUrl(selectedPlace.destination)} target="_blank" rel="noreferrer">Open directions <ArrowRight size={15} /></a>
              </div>
            </div>
          )}
          <div className="local-help"><Clock3 size={20} /><span><strong>Need a local plan?</strong><small>Ask our front desk for a simple one-day itinerary.</small></span></div>
        </div>
      </div>
    </section>
  )
}

function BookingConfidence() {
  const cards = [
    { icon: Images, title: 'See the real hotel', copy: 'Browse photographs of the reception, rooms, corridors and other hotel spaces before enquiring.', href: '/gallery', label: 'View hotel gallery' },
    { icon: Phone, title: 'Contact the hotel directly', copy: 'Call or send your dates on WhatsApp. The hotel team confirms availability personally.', href: '/contact', label: 'Contact the hotel' },
    { icon: MapPin, title: 'Check the location', copy: 'Review the full Ayodhya address and open a live route in Google Maps.', href: '/location', label: 'View location details' },
  ]
  return (
    <section className="reviews-section">
      <div className="section-shell">
        <SectionHeading eyebrow="Book with clarity" title="The details you need, before you decide" copy="Use real photography, verified hotel information and direct contact options to plan your stay." align="center" />
        <div className="review-grid">
          {cards.map(({ icon: Icon, title, copy, href, label }) => (
            <article className="review-card trust-card" key={title}>
              <Icon size={31} strokeWidth={1.3} />
              <h3>{title}</h3>
              <p>{copy}</p>
              <a className="arrow-link" href={href}>{label} <ArrowRight size={16} /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ onOwnerOpen, ownerStudioEnabled }) {
  const year = new Date().getFullYear()
  return (
    <footer id="contact">
      <div className="footer-cta section-shell">
        <div><p className="eyebrow light"><span />Plan your stay<span /></p><h2>Come home to calm in Ayodhya.</h2></div>
        <a className="button button-gold" href="/#booking">Book your stay <ArrowRight size={17} /></a>
      </div>
      <div className="footer-main section-shell">
        <div className="footer-brand">
          <a className="brand" href="/"><span className="brand-mark">अ</span><span className="brand-copy"><strong>Awadh Shree Palace</strong><small>Hotel · Ayodhya</small></span></a>
          <p>A peaceful, family-friendly stay with warm service in Saketpuri, Deokali, Ayodhya.</p>
          <div className="socials"><a href="tel:+919196422812" aria-label="Call Hotel Awadh Shree Palace"><Phone size={18} /></a><a href="https://wa.me/919196422812" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Hotel Awadh Shree Palace"><MessageCircle size={18} /></a><a href="/gallery" aria-label="Hotel photo gallery"><Images size={18} /></a></div>
        </div>
        <div className="footer-column"><h3>Explore</h3><a href="/rooms">Rooms</a><a href="/amenities">Amenities</a><a href="/gallery">Gallery</a><a href="/location">Location</a><a href="/ayodhya-travel-guide">Ayodhya travel guide</a></div>
        <div className="footer-column"><h3>Contact</h3><a href="tel:+919196422812">+91 91964 22812</a><a href="https://wa.me/918016422812" target="_blank" rel="noopener noreferrer">+91 80164 22812</a><a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">Get directions</a><a href="/faq">Hotel FAQs</a></div>
        <div className="footer-column footer-address"><h3>Find us</h3><address>Behind Blinkit Store,<br />Saketpuri, Deokali,<br />Ayodhya, Uttar Pradesh 224001</address><a href="/#policies">Hotel policies</a></div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© {year} Hotel Awadh Shree Palace</span>
        {ownerStudioEnabled && <button className="owner-access" onClick={onOwnerOpen}><Settings size={13} /> Owner access</button>}
        <span>Made for memorable Ayodhya stays</span>
      </div>
    </footer>
  )
}

export default function App() {
  const path = normalisePath(typeof window === 'undefined' ? '/' : window.location.pathname)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [ownerOpen, setOwnerOpen] = useState(false)
  const [ownerContent, setOwnerContent] = useState(loadOwnerContent)

  useEffect(() => {
    let active = true
    const loadSharedContent = async () => {
      try {
        const response = await fetch('/api/site-content', { headers: { Accept: 'application/json' }, cache: 'no-store' })
        if (!response.ok) return
        const payload = await response.json()
        // Keep an owner's existing browser-only edits available for the first
        // cloud publish instead of replacing them with an empty new database.
        if (!payload.content?.updatedAt) return
        const nextContent = normaliseOwnerContent(payload.content)
        if (active) {
          setOwnerContent(nextContent)
          saveLocalBackup(nextContent)
        }
      } catch {
        // Keep the latest local backup when offline or during plain Vite development.
      }
    }

    loadSharedContent()
    const refreshOnFocus = () => loadSharedContent()
    const refreshWhenVisible = () => document.visibilityState === 'visible' && loadSharedContent()
    window.addEventListener('focus', refreshOnFocus)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      active = false
      window.removeEventListener('focus', refreshOnFocus)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [])

  const liveRooms = useMemo(
    () => rooms.map((room) => ({ ...room, price: ownerContent.roomPrices[room.name] || room.price })),
    [ownerContent.roomPrices],
  )
  const liveGallery = useMemo(
    () => [
      ...gallery.filter((item) => !ownerContent.hiddenGallery.includes(item.src)),
      ...ownerContent.customGallery,
    ],
    [ownerContent.hiddenGallery, ownerContent.customGallery],
  )
  const liveFacilities = useMemo(
    () => [
      ...facilities.filter((item) => !ownerContent.hiddenFacilities.includes(item.title)),
      ...ownerContent.customFacilities.map((item) => ({ ...item, icon: Sparkles })),
    ],
    [ownerContent.hiddenFacilities, ownerContent.customFacilities],
  )

  const authenticateOwner = async (passcode) => {
    try {
      const response = await fetch('/api/site-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${passcode}` },
      })
      const payload = await response.json().catch(() => ({}))
      if (response.ok) return { ok: true }
      if (import.meta.env.DEV && response.status === 503 && passcode === (import.meta.env.VITE_OWNER_PASSCODE || 'awadh-owner')) {
        return { ok: true, mode: 'local' }
      }
      return { ok: false, message: payload.message || 'Owner access is unavailable. Please try again.' }
    } catch {
      if (import.meta.env.DEV && passcode === (import.meta.env.VITE_OWNER_PASSCODE || 'awadh-owner')) {
        return { ok: true, mode: 'local' }
      }
      return { ok: false, message: 'Could not reach the secure owner service. Check your connection and try again.' }
    }
  }

  const saveOwnerContent = async (nextContent, ownerKey, authMode) => {
    if (import.meta.env.DEV && authMode === 'local') {
      const localContent = normaliseOwnerContent({ ...nextContent, updatedAt: new Date().toISOString() })
      saveLocalBackup(localContent)
      setOwnerContent(localContent)
      return { ok: true, content: localContent, mode: 'local' }
    }

    try {
      const response = await fetch('/api/site-content', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerKey}`,
        },
        body: JSON.stringify({ content: nextContent }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) return { ok: false, message: payload.message || 'The website changes could not be published.' }
      const publishedContent = normaliseOwnerContent(payload.content)
      saveLocalBackup(publishedContent)
      setOwnerContent(publishedContent)
      return { ok: true, content: publishedContent, mode: 'cloud' }
    } catch {
      return { ok: false, message: 'Could not publish the changes. Check your internet connection and try again.' }
    }
  }

  return (
    <>
      <SEO path={path} />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header solid={path !== '/'} />
      <main id="main-content">
        {path === '/' ? (
          <>
            <Hero />
            <TrustStrip />
            <Story />
            <Rooms items={liveRooms} />
            <Facilities items={liveFacilities} />
            <Policies />
            <Gallery items={liveGallery} />
            <Ayodhya />
            <BookingConfidence />
          </>
        ) : <SitePage path={path} rooms={liveRooms} gallery={liveGallery} facilities={liveFacilities} />}
      </main>
      <Footer onOwnerOpen={() => setOwnerOpen(true)} ownerStudioEnabled={OWNER_STUDIO_ENABLED} />
      {OWNER_STUDIO_ENABLED && <Suspense fallback={null}><OwnerStudio
        open={ownerOpen}
        onClose={() => setOwnerOpen(false)}
        content={ownerContent}
        onAuthenticate={authenticateOwner}
        onSave={saveOwnerContent}
        rooms={rooms}
        gallery={gallery}
        facilities={facilities}
      /></Suspense>}
      <div className={`whatsapp-float ${showWhatsApp ? 'is-open' : ''}`}>
        {showWhatsApp && <div className="whatsapp-bubble"><button onClick={() => setShowWhatsApp(false)}>×</button><strong>Namaste! How can we help?</strong><p>Ask about rooms, dates, directions or a family stay.</p><a href="https://wa.me/919196422812?text=Hello%20Hotel%20Awadh%20Shree%20Palace%2C%20I%20would%20like%20to%20plan%20a%20stay." target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { placement: 'floating_chat' })}>Start a conversation <ArrowRight size={15} /></a></div>}
        <button className="whatsapp-button" onClick={() => setShowWhatsApp(!showWhatsApp)} aria-label="Chat on WhatsApp"><MessageCircle size={23} fill="currentColor" /></button>
      </div>
      <nav className="mobile-actions" aria-label="Quick hotel actions">
        <a href={HOTEL.telephoneHref} onClick={() => trackEvent('phone_click', { placement: 'mobile_bar' })}><Phone size={17} />Call</a>
        <a href={HOTEL.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { placement: 'mobile_bar' })}><MessageCircle size={17} />WhatsApp</a>
        <a href="/#booking"><BedDouble size={17} />Book</a>
      </nav>
    </>
  )
}
