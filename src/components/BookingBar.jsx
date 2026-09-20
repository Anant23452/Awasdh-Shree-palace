import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, Check, ChevronDown, Search, Users, X } from 'lucide-react'

const toISO = (date) => {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return copy.toISOString().split('T')[0]
}

export default function BookingBar() {
  const today = useMemo(() => new Date(), [])
  const tomorrow = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), [today])
  const dayAfter = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), [today])
  const [checkIn, setCheckIn] = useState(toISO(tomorrow))
  const [checkOut, setCheckOut] = useState(toISO(dayAfter))
  const [guests, setGuests] = useState('2 Adults')
  const [open, setOpen] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const whatsappText = encodeURIComponent(`Hello Hotel Awadh Shree Palace, I would like to check availability from ${checkIn} to ${checkOut} for ${guests}.`)

  return (
    <>
      <form className="booking-bar" id="booking" onSubmit={submit}>
        <label>
          <span><CalendarDays size={16} /> Check in</span>
          <input type="date" value={checkIn} min={toISO(today)} onChange={(event) => {
            setCheckIn(event.target.value)
            if (event.target.value >= checkOut) {
              const next = new Date(`${event.target.value}T12:00:00`)
              next.setDate(next.getDate() + 1)
              setCheckOut(toISO(next))
            }
          }} />
        </label>
        <span className="booking-divider" />
        <label>
          <span><CalendarDays size={16} /> Check out</span>
          <input type="date" value={checkOut} min={checkIn} onChange={(event) => setCheckOut(event.target.value)} />
        </label>
        <span className="booking-divider" />
        <label>
          <span><Users size={16} /> Guests</span>
          <span className="select-wrap">
            <select value={guests} onChange={(event) => setGuests(event.target.value)}>
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>2 Adults, 1 Child</option>
              <option>2 Adults, 2 Children</option>
              <option>4 Adults</option>
              <option>5 Guests</option>
            </select>
            <ChevronDown size={16} />
          </span>
        </label>
        <button type="submit" className="button button-maroon booking-submit"><Search size={18} /> Check availability</button>
      </form>

      {open && createPortal(
        <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <div className="enquiry-card">
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close"><X /></button>
            <span className="success-mark"><Check /></span>
            <p className="eyebrow">Your dates are ready</p>
            <h2 id="enquiry-title">Let us confirm your perfect room.</h2>
            <p>Availability is confirmed personally by our team. Continue on WhatsApp and we’ll reply with the best room for your stay.</p>
            <div className="enquiry-summary">
              <span><small>Check in</small>{checkIn}</span>
              <span><small>Check out</small>{checkOut}</span>
              <span><small>Guests</small>{guests}</span>
            </div>
            <a className="button button-maroon full-button" href={`https://wa.me/919196422812?text=${whatsappText}`} target="_blank" rel="noreferrer">Continue on WhatsApp</a>
            <button className="text-button" onClick={() => setOpen(false)}>Keep exploring</button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
