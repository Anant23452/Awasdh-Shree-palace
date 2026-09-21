import { useState } from 'react'
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  CarFront,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import Gallery from './Gallery'
import SectionHeading from './SectionHeading'
import { FAQ_ITEMS, HOTEL, PAGE_SEO } from '../seo'
import { trackEvent } from '../analytics'

const buildDirectionsUrl = (destination) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`

function Breadcrumbs({ current }) {
  return (
    <nav className="breadcrumbs section-shell" aria-label="Breadcrumb">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">{current}</span>
    </nav>
  )
}

function PageHero({ path, image = 'exterior' }) {
  const page = PAGE_SEO[path]
  const source = image === 'room'
    ? '/assets/optimized/awadh-shree-palace-family-room-1122.webp'
    : '/assets/optimized/hotel-awadh-shree-palace-ayodhya-exterior-1440.webp'
  return (
    <section className="page-hero">
      <img src={source} alt="" width="1440" height="810" fetchPriority="high" />
      <div className="page-hero-overlay" />
      <div className="section-shell page-hero-content">
        <p>{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <a className="button button-gold" href="/#booking">Check availability <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}

function RoomCards({ rooms }) {
  return (
    <div className="detail-room-grid">
      {rooms.map((room) => (
        <article className="detail-room" key={room.name}>
          <img src={room.image} srcSet={room.srcSet} sizes="(max-width: 760px) 100vw, 33vw" width={room.width} height={room.height} alt={`${room.name} at Hotel Awadh Shree Palace Ayodhya`} loading="lazy" />
          <div>
            <p className="detail-room-meta"><span><Users size={15} /> {room.guests}</span><span><BedDouble size={15} /> {room.bed}</span></p>
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <ul>{room.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
            <div className="detail-room-footer"><span>From <strong>{room.price}</strong> / night</span><a href="/#booking">Enquire about this room <ArrowRight size={15} /></a></div>
          </div>
        </article>
      ))}
    </div>
  )
}

function RoomsPage({ rooms }) {
  return (
    <>
      <PageHero path="/rooms" image="room" />
      <Breadcrumbs current="Rooms" />
      <section className="content-section section-shell">
        <SectionHeading eyebrow="Verified room details" title="Choose the space that suits your visit" copy="Compare the room types currently listed by the hotel, then contact the team to confirm dates and availability." />
        <RoomCards rooms={rooms} />
        <p className="content-note">Rates shown are starting prices per room, per night. Taxes and festival-date pricing may vary, and the hotel confirms the final amount before booking.</p>
      </section>
    </>
  )
}

function AmenitiesPage({ facilities }) {
  return (
    <>
      <PageHero path="/amenities" />
      <Breadcrumbs current="Amenities" />
      <section className="content-section section-shell">
        <SectionHeading eyebrow="Hotel facilities" title="Everyday essentials for an easier stay" copy="These are the facilities currently listed by Hotel Awadh Shree Palace. Contact the hotel if you need to confirm a specific requirement." />
        <div className="amenity-detail-grid">
          {facilities.map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={24} /><div><h2>{title}</h2><p>{copy}</p></div></article>)}
        </div>
        <div className="content-cta"><div><h2>Need to confirm a facility?</h2><p>Speak with the hotel before your arrival.</p></div><a className="button button-maroon" href={HOTEL.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { placement: 'amenities' })}>Ask on WhatsApp</a></div>
      </section>
    </>
  )
}

function GalleryPage({ gallery }) {
  return (
    <>
      <PageHero path="/gallery" image="room" />
      <Breadcrumbs current="Gallery" />
      <Gallery items={gallery} pageMode />
    </>
  )
}

function LocationMap() {
  const [showMap, setShowMap] = useState(false)
  if (!showMap) {
    return (
      <button className="map-placeholder" onClick={() => setShowMap(true)}>
        <MapPin size={31} /><strong>Load the interactive map</strong><span>The map loads only when you request it, helping this page open faster.</span>
      </button>
    )
  }
  return <iframe className="location-map" title="Map showing Hotel Awadh Shree Palace in Ayodhya" src="https://maps.google.com/maps?q=Hotel%20Awadh%20Shree%20Palace%2C%20Saketpuri%2C%20Deokali%2C%20Ayodhya%2C%20Uttar%20Pradesh%20224001&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
}

function LocationPage() {
  const nearby = [
    ['Jai Mata Di Temple', 'Approx. 0.9 km from the hotel'],
    ['Durga Mandir', 'Approx. 1.8 km from the hotel'],
    ['Shri Ram Mandir', 'Approx. 2.7 km from the hotel'],
    ['Ayodhya Airport', 'Approx. 4.2 km from the hotel'],
    ['Saryu Ghat', 'Approx. 6.9 km by the fastest road route'],
  ]
  return (
    <>
      <PageHero path="/location" />
      <Breadcrumbs current="Location" />
      <section className="content-section section-shell location-page-grid">
        <div>
          <SectionHeading eyebrow="Saketpuri, Deokali" title="Address and live directions" copy="Use the live Google Maps route for current road conditions and travel time. Route information can change with traffic and local access arrangements." />
          <address className="address-card"><MapPin size={24} /><span><strong>Hotel Awadh Shree Palace</strong>{HOTEL.addressLines.map((line) => <span key={line}>{line}</span>)}</span></address>
          <div className="contact-actions"><a className="button button-maroon" href={HOTEL.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('directions_click', { placement: 'location' })}>Get directions</a><a className="button button-outline" href={HOTEL.telephoneHref}>Call hotel</a></div>
        </div>
        <LocationMap />
      </section>
      <section className="nearby-section"><div className="section-shell"><SectionHeading eyebrow="Nearby Ayodhya places" title="Plan each journey with a live route" copy="The approximate distances below are the figures currently supplied by the hotel website. Open Maps before travelling for the latest route." />
        <div className="nearby-grid">{nearby.map(([name, detail]) => <article key={name}><MapPin size={19} /><div><h2>{name}</h2><p>{detail}</p></div><a href={buildDirectionsUrl(`${name}, Ayodhya`)} target="_blank" rel="noopener noreferrer" aria-label={`Directions to ${name}`}>Live route <ArrowRight size={14} /></a></article>)}</div>
      </div></section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHero path="/about" />
      <Breadcrumbs current="About" />
      <section className="content-section section-shell editorial-grid">
        <img src="/assets/optimized/hotel-awadh-shree-palace-reception-1122.webp" srcSet="/assets/optimized/hotel-awadh-shree-palace-reception-480.webp 480w, /assets/optimized/hotel-awadh-shree-palace-reception-800.webp 800w, /assets/optimized/hotel-awadh-shree-palace-reception-1122.webp 1122w" sizes="(max-width: 800px) 100vw, 48vw" width="1122" height="1402" alt="Reception area at Hotel Awadh Shree Palace Ayodhya" loading="lazy" />
        <div><SectionHeading eyebrow="The Awadh welcome" title="A practical place to return to" /><p>Hotel Awadh Shree Palace offers a calm place to stay in Saketpuri, Deokali, Ayodhya. The hotel serves families, pilgrims and other travellers who value clean rooms, direct assistance and clearly explained facilities.</p><p>Guests can review real hotel photographs, compare the listed room categories and contact the hotel team directly to check availability. The team can also help with local directions and simple travel guidance during a stay.</p><a className="arrow-link" href="/rooms">Explore the rooms <ArrowRight size={16} /></a></div>
      </section>
    </>
  )
}

function ContactPage() {
  return (
    <>
      <PageHero path="/contact" />
      <Breadcrumbs current="Contact" />
      <section className="content-section section-shell" id="booking-options">
        <SectionHeading eyebrow="Direct enquiries" title="Choose the simplest way to reach us" copy="Ask about room availability, dates, guest capacity or directions. A member of the hotel team confirms booking details personally." align="center" />
        <div className="contact-card-grid">
          <a href={HOTEL.telephoneHref} onClick={() => trackEvent('phone_click', { placement: 'contact' })}><Phone size={25} /><h2>Call the hotel</h2><p>{HOTEL.telephone}</p><span>Call now <ArrowRight size={14} /></span></a>
          <a href={`${HOTEL.whatsappHref}?text=Hello%20Hotel%20Awadh%20Shree%20Palace%2C%20I%20would%20like%20to%20check%20room%20availability.`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { placement: 'contact' })}><MessageCircle size={25} /><h2>WhatsApp enquiry</h2><p>Send your dates and guest details.</p><span>Start chat <ArrowRight size={14} /></span></a>
          <a href={HOTEL.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('directions_click', { placement: 'contact' })}><MapPin size={25} /><h2>Get directions</h2><p>Saketpuri, Deokali, Ayodhya.</p><span>Open Maps <ArrowRight size={14} /></span></a>
        </div>
        <address className="contact-address"><strong>Hotel Awadh Shree Palace</strong>{HOTEL.addressLines.map((line) => <span key={line}>{line}</span>)}</address>
      </section>
    </>
  )
}

function FaqPage() {
  return (
    <>
      <PageHero path="/faq" />
      <Breadcrumbs current="Frequently asked questions" />
      <section className="content-section section-shell faq-layout">
        <SectionHeading eyebrow="Before you arrive" title="Straight answers to common questions" copy="These answers use information already confirmed on the hotel website. Contact the team if your question is not covered." />
        <div className="faq-list">{FAQ_ITEMS.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>
    </>
  )
}

function TravelGuidePage() {
  const tips = [
    { icon: CalendarCheck, title: 'Confirm opening and access details', copy: 'Temple access, local arrangements and traffic can change. Check official sources and live Maps information before setting out.' },
    { icon: CarFront, title: 'Plan each road journey live', copy: 'Use current directions rather than relying only on a fixed distance or old travel-time estimate.' },
    { icon: Clock3, title: 'Leave time between visits', copy: 'A flexible schedule makes room for queues, local traffic and the pace of travelling with family.' },
    { icon: ShieldCheck, title: 'Keep essential documents ready', copy: 'Every adult guest needs a valid government photo ID when checking in at the hotel.' },
  ]
  return (
    <>
      <PageHero path="/ayodhya-travel-guide" />
      <Breadcrumbs current="Ayodhya travel guide" />
      <article className="content-section section-shell guide-article">
        <SectionHeading eyebrow="Ayodhya travel guide" title="Plan with current information and a little flexibility" copy="Ayodhya draws visitors for temples, ghats and the wider story of the city. This concise guide helps you prepare without relying on outdated timings or route claims." />
        <div className="guide-grid">{tips.map(({ icon: Icon, title, copy }) => <section key={title}><Icon size={23} /><h2>{title}</h2><p>{copy}</p></section>)}</div>
        <section className="guide-copy"><h2>Places guests commonly ask about</h2><p>The hotel website provides live route links for Shri Ram Mandir, Hanuman Garhi, Kanak Bhawan, Saryu Ghat and Ayodhya Airport. Use the <a href="/location">hotel location page</a> to open current directions from your device.</p><h2>Preparing for the hotel stay</h2><p>Review the <a href="/rooms">available room categories</a>, check the listed facilities and send your dates and guest count through the availability form. The hotel team confirms the final room and rate directly.</p></section>
      </article>
    </>
  )
}

function RamMandirPage() {
  return (
    <>
      <PageHero path="/hotel-near-ram-mandir-ayodhya" />
      <Breadcrumbs current="Ram Mandir visit" />
      <article className="content-section section-shell editorial-copy">
        <SectionHeading eyebrow="Ram Mandir visit" title="A clear base for planning your journey" copy="Hotel Awadh Shree Palace is in Saketpuri, Deokali, Ayodhya. Use live directions to check the current road route to Shri Ram Mandir before travelling." />
        <div className="editorial-columns"><section><h2>Check the live route</h2><p>Traffic, security arrangements and local access can affect travel. The hotel therefore links to current Google Maps directions instead of promising a fixed journey time.</p><a className="arrow-link" href={buildDirectionsUrl('Shri Ram Janmabhoomi Mandir, Ayodhya')} target="_blank" rel="noopener noreferrer">Open Ram Mandir directions <ArrowRight size={16} /></a></section><section><h2>Choose a suitable room</h2><p>Deluxe, Family and Premium room categories are shown with occupancy, bed and facility information. Availability is confirmed directly by the hotel.</p><a className="arrow-link" href="/rooms">Compare hotel rooms <ArrowRight size={16} /></a></section></div>
        <div className="content-cta"><div><h2>Ask the hotel team for local guidance</h2><p>Send your dates and guest details for a direct response.</p></div><a className="button button-maroon" href={HOTEL.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp the hotel</a></div>
      </article>
    </>
  )
}

function NotFoundPage() {
  return (
    <section className="not-found section-shell"><span>404</span><h1>This page could not be found.</h1><p>The page may have moved. Continue with the hotel information below.</p><div><a className="button button-maroon" href="/">Return home</a><a className="button button-outline" href="/rooms">View rooms</a><a className="arrow-link" href="/contact">Contact hotel</a></div></section>
  )
}

export default function SitePage({ path, rooms, gallery, facilities }) {
  if (path === '/rooms') return <RoomsPage rooms={rooms} />
  if (path === '/amenities') return <AmenitiesPage facilities={facilities} />
  if (path === '/gallery') return <GalleryPage gallery={gallery} />
  if (path === '/location') return <LocationPage />
  if (path === '/about') return <AboutPage />
  if (path === '/contact') return <ContactPage />
  if (path === '/faq') return <FaqPage />
  if (path === '/ayodhya-travel-guide') return <TravelGuidePage />
  if (path === '/hotel-near-ram-mandir-ayodhya') return <RamMandirPage />
  return <NotFoundPage />
}
