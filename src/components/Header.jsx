import { useEffect, useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'

const links = [
  ['Rooms', '/rooms'],
  ['Amenities', '/amenities'],
  ['Gallery', '/gallery'],
  ['Location', '/location'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

export default function Header({ solid = false }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return (
    <>
      <header className={`site-header ${solid ? 'is-solid' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="/" aria-label="Hotel Awadh Shree Palace home">
          <span className="brand-mark" aria-hidden="true">अ</span>
          <span className="brand-copy">
            <strong>Awadh Shree Palace</strong>
            <small>Hotel · Ayodhya</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>

        <div className="header-actions">
          <a className="header-phone" href="tel:+919196422812" aria-label="Call the hotel">
            <Phone size={17} /> <span>+91 91964 22812</span>
          </a>
          <a className="button button-gold header-book" href="/#booking">Book your stay</a>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a href="tel:+919196422812">Call +91 91964 22812</a>
        <a className="button button-gold" href="/#booking" onClick={() => setOpen(false)}>Book your stay</a>
      </div>
    </>
  )
}
