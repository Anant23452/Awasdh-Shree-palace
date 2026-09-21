import { useEffect, useRef, useState } from 'react'
import {
  Check,
  ImagePlus,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import './owner-studio.css'

const OWNER_SESSION_KEY = 'awadh-owner-authenticated'
const OWNER_PASSCODE = import.meta.env.VITE_OWNER_PASSCODE || 'awadh-owner'

function formatRoomPrice(value) {
  const amount = String(value).replace(/[^0-9]/g, '')
  return amount ? `₹${Number(amount).toLocaleString('en-IN')}` : ''
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('The image could not be read.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('This image format is not supported.'))
      image.onload = () => {
        const maxSize = 1600
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function OwnerStudio({ open, onClose, content, onSave, rooms, gallery, facilities }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(OWNER_SESSION_KEY) === 'yes')
  const [passcode, setPasscode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('prices')
  const [draft, setDraft] = useState(content)
  const [featureTitle, setFeatureTitle] = useState('')
  const [featureCopy, setFeatureCopy] = useState('')
  const [message, setMessage] = useState('')
  const fileInput = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    setDraft(content)
    setMessage('')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, content, onClose])

  if (!open) return null

  const login = (event) => {
    event.preventDefault()
    if (passcode !== OWNER_PASSCODE) {
      setLoginError('That passcode is not correct. Please try again.')
      return
    }
    sessionStorage.setItem(OWNER_SESSION_KEY, 'yes')
    setAuthenticated(true)
    setLoginError('')
    setPasscode('')
  }

  const logout = () => {
    sessionStorage.removeItem(OWNER_SESSION_KEY)
    setAuthenticated(false)
    setActiveTab('prices')
  }

  const saveChanges = () => {
    const next = {
      ...draft,
      roomPrices: Object.fromEntries(
        Object.entries(draft.roomPrices).map(([name, value]) => [name, formatRoomPrice(value)]),
      ),
    }
    const saved = onSave(next)
    if (saved) {
      setDraft(next)
      setMessage('Your website changes are now live on this device.')
      window.setTimeout(() => setMessage(''), 3200)
    } else {
      setMessage('The browser could not save these changes. Try removing a large gallery image.')
    }
  }

  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    if (draft.customGallery.length + files.length > 8) {
      setMessage('You can keep up to 8 owner-uploaded photos in this browser.')
      event.target.value = ''
      return
    }

    try {
      const newImages = []
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue
        if (file.size > 10 * 1024 * 1024) throw new Error('Please choose images smaller than 10 MB.')
        const src = await compressImage(file)
        const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          src,
          label: cleanName || 'Hotel photo',
          alt: `${cleanName || 'Hotel'} at Hotel Awadh Shree Palace`,
        })
      }
      setDraft((current) => ({ ...current, customGallery: [...current.customGallery, ...newImages] }))
      setMessage(`${newImages.length} photo${newImages.length === 1 ? '' : 's'} ready. Select “Publish changes” to make it live.`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      event.target.value = ''
    }
  }

  const addFeature = (event) => {
    event.preventDefault()
    if (!featureTitle.trim() || !featureCopy.trim()) {
      setMessage('Add both a feature name and a short description.')
      return
    }
    setDraft((current) => ({
      ...current,
      customFacilities: [
        ...current.customFacilities,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: featureTitle.trim(), copy: featureCopy.trim() },
      ],
    }))
    setFeatureTitle('')
    setFeatureCopy('')
    setMessage('Feature added to your draft. Publish when ready.')
  }

  const activeGallery = [
    ...gallery.filter((item) => !draft.hiddenGallery.includes(item.src)).map((item) => ({ ...item, source: 'default' })),
    ...draft.customGallery.map((item) => ({ ...item, source: 'custom' })),
  ]
  const activeFacilities = [
    ...facilities.filter((item) => !draft.hiddenFacilities.includes(item.title)).map((item) => ({ ...item, source: 'default' })),
    ...draft.customFacilities.map((item) => ({ ...item, source: 'custom' })),
  ]

  return (
    <div className="owner-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="owner-studio" role="dialog" aria-modal="true" aria-label="Owner dashboard">
        <header className="owner-header">
          <div className="owner-title">
            <span><LayoutDashboard size={20} /></span>
            <div><small>Hotel management</small><strong>Owner Studio</strong></div>
          </div>
          <button className="owner-icon-button" onClick={onClose} aria-label="Close owner dashboard"><X size={21} /></button>
        </header>

        {!authenticated ? (
          <div className="owner-login">
            <span className="owner-login-icon"><ShieldCheck size={30} /></span>
            <p className="owner-eyebrow">Private owner access</p>
            <h2>Manage the website without editing code.</h2>
            <p>Enter your owner passcode to update prices, gallery photos and hotel features.</p>
            <form onSubmit={login}>
              <label htmlFor="owner-passcode">Owner passcode</label>
              <input id="owner-passcode" type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} autoFocus autoComplete="current-password" placeholder="Enter passcode" />
              {loginError && <span className="owner-error">{loginError}</span>}
              <button className="owner-primary" type="submit">Open dashboard <ShieldCheck size={17} /></button>
            </form>
            <small className="owner-security-note">This dashboard saves changes in this browser. See the project guide before publishing it online.</small>
          </div>
        ) : (
          <div className="owner-workspace">
            <nav className="owner-tabs" aria-label="Owner tools">
              <button className={activeTab === 'prices' ? 'active' : ''} onClick={() => setActiveTab('prices')}><IndianRupee size={17} /> Room prices</button>
              <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}><ImagePlus size={17} /> Gallery</button>
              <button className={activeTab === 'facilities' ? 'active' : ''} onClick={() => setActiveTab('facilities')}><Sparkles size={17} /> Features</button>
            </nav>

            <div className="owner-panel">
              {activeTab === 'prices' && (
                <section>
                  <p className="owner-eyebrow">Rooms</p>
                  <h2>Update nightly prices</h2>
                  <p>Enter the base amount shown on each room card. Festival dates and taxes can still be confirmed during booking.</p>
                  <div className="owner-price-list">
                    {rooms.map((room) => (
                      <label key={room.name}>
                        <img src={room.image} alt="" />
                        <span><strong>{room.name}</strong><small>Price per night</small></span>
                        <div className="owner-price-input"><IndianRupee size={15} /><input inputMode="numeric" value={String(draft.roomPrices[room.name] ?? room.price).replace('₹', '')} onChange={(event) => setDraft((current) => ({ ...current, roomPrices: { ...current.roomPrices, [room.name]: event.target.value } }))} aria-label={`${room.name} price`} /></div>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'gallery' && (
                <section>
                  <p className="owner-eyebrow">Gallery</p>
                  <h2>Add or remove hotel photos</h2>
                  <p>Upload clear JPG, PNG or WebP images. Photos are resized automatically for faster loading.</p>
                  <input ref={fileInput} className="owner-file-input" type="file" accept="image/*" multiple onChange={uploadImages} />
                  <button className="owner-upload" onClick={() => fileInput.current?.click()}><ImagePlus size={20} /><span><strong>Upload gallery photos</strong><small>Up to 10 MB each · maximum 8 uploads</small></span></button>
                  <div className="owner-photo-grid">
                    {activeGallery.map((item) => (
                      <figure key={item.id || item.src}>
                        <img src={item.src} alt={item.alt} />
                        <figcaption><span>{item.label}</span><button onClick={() => setDraft((current) => item.source === 'custom' ? { ...current, customGallery: current.customGallery.filter((photo) => photo.id !== item.id) } : { ...current, hiddenGallery: [...new Set([...current.hiddenGallery, item.src])] })} aria-label={`Remove ${item.label}`}><Trash2 size={15} /></button></figcaption>
                      </figure>
                    ))}
                  </div>
                  {draft.hiddenGallery.length > 0 && <button className="owner-text-button" onClick={() => setDraft((current) => ({ ...current, hiddenGallery: [] }))}>Restore original gallery photos</button>}
                </section>
              )}

              {activeTab === 'facilities' && (
                <section>
                  <p className="owner-eyebrow">Hotel features</p>
                  <h2>Keep amenities up to date</h2>
                  <p>Add a service guests should know about, or remove anything no longer available.</p>
                  <form className="owner-feature-form" onSubmit={addFeature}>
                    <label>Feature name<input value={featureTitle} onChange={(event) => setFeatureTitle(event.target.value)} placeholder="Example: Airport pickup" maxLength={45} /></label>
                    <label>Short description<textarea value={featureCopy} onChange={(event) => setFeatureCopy(event.target.value)} placeholder="Tell guests what is included." maxLength={120} rows="3" /></label>
                    <button type="submit"><Plus size={17} /> Add feature</button>
                  </form>
                  <div className="owner-feature-list">
                    {activeFacilities.map((item) => (
                      <article key={item.id || item.title}>
                        <span><Sparkles size={17} /></span>
                        <div><strong>{item.title}</strong><small>{item.copy}</small></div>
                        <button onClick={() => setDraft((current) => item.source === 'custom' ? { ...current, customFacilities: current.customFacilities.filter((feature) => feature.id !== item.id) } : { ...current, hiddenFacilities: [...new Set([...current.hiddenFacilities, item.title])] })} aria-label={`Delete ${item.title}`}><Trash2 size={16} /></button>
                      </article>
                    ))}
                  </div>
                  {draft.hiddenFacilities.length > 0 && <button className="owner-text-button" onClick={() => setDraft((current) => ({ ...current, hiddenFacilities: [] }))}>Restore original features</button>}
                </section>
              )}
            </div>

            <footer className="owner-actions">
              <button className="owner-logout" onClick={logout}><LogOut size={16} /> Log out</button>
              {message && <span className="owner-message"><Check size={14} /> {message}</span>}
              <button className="owner-primary" onClick={saveChanges}><Save size={17} /> Publish changes</button>
            </footer>
          </div>
        )}
      </aside>
    </div>
  )
}
