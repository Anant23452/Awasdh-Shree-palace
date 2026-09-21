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
  Quote,
  Settings,
  Sparkles,
  Star,
  UtensilsCrossed,
  Users,
  WineOff,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Header from './components/Header'
import BookingBar from './components/BookingBar'
import Gallery from './components/Gallery'
import OwnerStudio from './components/OwnerStudio'
import SectionHeading from './components/SectionHeading'
import { facilities, gallery, rooms, trustItems } from './data'

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/JJ7KRoCftp8ind83A?g_st=aw'
const HOTEL_ORIGIN = 'Hotel Awadh Shree Palace, Saketpuri, Deokali, Ayodhya, Uttar Pradesh 224001'
const OWNER_CONTENT_KEY = 'awadh-owner-content-v1'
const EMPTY_OWNER_CONTENT = {
  roomPrices: {},
  hiddenGallery: [],
  customGallery: [],
  hiddenFacilities: [],
  customFacilities: [],
}

function loadOwnerContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(OWNER_CONTENT_KEY))
    return saved ? { ...EMPTY_OWNER_CONTENT, ...saved } : EMPTY_OWNER_CONTENT
  } catch {
    return EMPTY_OWNER_CONTENT
  }
}

const buildDirectionsUrl = (destination) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(HOTEL_ORIGIN)}&destination=${encodeURIComponent(destination)}&travelmode=driving`

const buildRouteEmbedUrl = (destination) =>
  `https://maps.google.com/maps?saddr=${encodeURIComponent(HOTEL_ORIGIN)}&daddr=${encodeURIComponent(destination)}&output=embed`

function Hero() {
  return (
    <section className="hero" id="top">
      <Header />
      <div className="hero-image" />
      <div className="hero-grain" />
      <div className="hero-content section-shell">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> Welcome to Ayodhya</p>
          <h1>Stay close to the <em>soul</em> of Ayodhya.</h1>
          <p>Peaceful rooms, genuine hospitality and an easy base for families, pilgrims and travellers exploring the sacred city.</p>
          <div className="hero-ctas">
            <a className="button button-gold" href="#booking">Find your room <ArrowRight size={17} /></a>
            <a className="hero-link" href="#story"><span><Play size={16} fill="currentColor" /></span> Discover our stay</a>
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
        <div className="story-image-main"><img src="/assets/hq-reception.png" alt="Welcoming reception at Hotel Awadh Shree Palace" /></div>
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
                <img src={room.image} alt={room.name} loading="lazy" />
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
    { number: '03', name: 'Shri Ram Mandir', time: 'Approx. 2.7 km from hotel', destination: 'Shri Ram Janmabhoomi Mandir, Ayodhya', distance: '2.7 km', driveTime: 'check the live road route' },
    { number: '04', name: 'Hanuman Garhi', time: 'Historic hilltop temple · live route', destination: 'Hanuman Garhi Mandir, Ayodhya' },
    { number: '05', name: 'Kanak Bhawan', time: 'Sacred palace temple · live route', destination: 'Kanak Bhawan, Ayodhya' },
    { number: '06', name: 'Saryu Ghat', time: 'Approx. 6.9 km by the fastest road route', destination: 'Saryu Ghat Ayodhya, Naya Ghat, Ayodhya, Uttar Pradesh 224123', distance: '6.9 km', driveTime: 'about 18 min by car' },
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

function Reviews() {
  const reviews = [
    { quote: 'The rooms were clean and the staff was genuinely helpful throughout our family stay.', name: 'Family guest', source: 'Guest feedback' },
    { quote: 'A comfortable, well-organised place to return to after a full day in Ayodhya.', name: 'Ayodhya traveller', source: 'Guest feedback' },
    { quote: 'Warm service, spacious family rooms and easy assistance whenever we needed it.', name: 'Recent guest', source: 'Guest feedback' },
  ]
  return (
    <section className="reviews-section">
      <div className="section-shell">
        <SectionHeading eyebrow="Guest stories" title="Hospitality guests remember" copy="Real comfort is felt in the details — clean spaces, kind service and help at the right moment." align="center" />
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <Quote size={31} strokeWidth={1} />
              <div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
              <p>“{review.quote}”</p>
              <span><strong>{review.name}</strong><small>{review.source}</small></span>
            </article>
          ))}
        </div>
        <a className="arrow-link reviews-link" href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer">View Hotel Awadh Shree Palace on Google <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}

function Footer({ onOwnerOpen }) {
  const year = new Date().getFullYear()
  return (
    <footer id="contact">
      <div className="footer-cta section-shell">
        <div><p className="eyebrow light"><span />Plan your stay<span /></p><h2>Come home to calm in Ayodhya.</h2></div>
        <a className="button button-gold" href="#booking">Book your stay <ArrowRight size={17} /></a>
      </div>
      <div className="footer-main section-shell">
        <div className="footer-brand">
          <a className="brand" href="#top"><span className="brand-mark">अ</span><span className="brand-copy"><strong>Awadh Shree Palace</strong><small>Hotel · Ayodhya</small></span></a>
          <p>A peaceful, family-friendly stay with warm service in Saketpuri, Deokali, Ayodhya.</p>
          <div className="socials"><a href="tel:+919196422812" aria-label="Call"><Phone size={18} /></a><a href="https://wa.me/919196422812" aria-label="WhatsApp"><MessageCircle size={18} /></a><a href="#gallery" aria-label="Gallery"><Images size={18} /></a></div>
        </div>
        <div className="footer-column"><h3>Explore</h3><a href="#rooms">Rooms</a><a href="#facilities">Facilities</a><a href="#gallery">Gallery</a><a href="#ayodhya">Ayodhya</a></div>
        <div className="footer-column"><h3>Contact</h3><a href="tel:+919196422812">+91 91964 22812</a><a href="https://wa.me/918016422812">+91 80164 22812</a><a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer">Get directions</a></div>
        <div className="footer-column footer-address"><h3>Find us</h3><p>Behind Blinkit Store,<br />Saketpuri, Deokali,<br />Ayodhya, Uttar Pradesh 224001</p></div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© {year} Hotel Awadh Shree Palace</span>
        <button className="owner-access" onClick={onOwnerOpen}><Settings size={13} /> Owner access</button>
        <span>Made for memorable Ayodhya stays</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [ownerOpen, setOwnerOpen] = useState(false)
  const [ownerContent, setOwnerContent] = useState(loadOwnerContent)

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

  const saveOwnerContent = (nextContent) => {
    try {
      localStorage.setItem(OWNER_CONTENT_KEY, JSON.stringify(nextContent))
      setOwnerContent(nextContent)
      return true
    } catch {
      return false
    }
  }

  return (
    <>
      <Hero />
      <TrustStrip />
      <Story />
      <Rooms items={liveRooms} />
      <Facilities items={liveFacilities} />
      <Policies />
      <Gallery items={liveGallery} />
      <Ayodhya />
      <Reviews />
      <Footer onOwnerOpen={() => setOwnerOpen(true)} />
      <OwnerStudio
        open={ownerOpen}
        onClose={() => setOwnerOpen(false)}
        content={ownerContent}
        onSave={saveOwnerContent}
        rooms={rooms}
        gallery={gallery}
        facilities={facilities}
      />
      <div className={`whatsapp-float ${showWhatsApp ? 'is-open' : ''}`}>
        {showWhatsApp && <div className="whatsapp-bubble"><button onClick={() => setShowWhatsApp(false)}>×</button><strong>Namaste! How can we help?</strong><p>Ask about rooms, dates, directions or a family stay.</p><a href="https://wa.me/919196422812?text=Hello%20Hotel%20Awadh%20Shree%20Palace%2C%20I%20would%20like%20to%20plan%20a%20stay." target="_blank" rel="noreferrer">Start a conversation <ArrowRight size={15} /></a></div>}
        <button className="whatsapp-button" onClick={() => setShowWhatsApp(!showWhatsApp)} aria-label="Chat on WhatsApp"><MessageCircle size={23} fill="currentColor" /></button>
      </div>
    </>
  )
}
