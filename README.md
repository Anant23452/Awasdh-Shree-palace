# Hotel Awadh Shree Palace

A polished, responsive Vite + React website for Hotel Awadh Shree Palace in Ayodhya. The project uses the supplied hotel photographs and walkthrough video, with a warm ivory, maroon and muted-gold visual system.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Main editing points

- `src/App.jsx` — homepage sections and copy
- `src/data.js` — rooms, facilities, gallery and trust content
- `src/styles.css` — full visual system and responsive layout
- `public/assets` — hotel photography and video

The booking UI currently creates a pre-filled WhatsApp enquiry. It does not claim a room is booked or charge a payment; a future booking backend can replace that hand-off.

## Owner Studio

The footer now includes **Owner access**. After signing in, the owner can directly:

- update every room's nightly price;
- upload or remove gallery images;
- add or remove hotel features and facilities.

Changes are published immediately to the homepage and saved in the current browser using local storage. The development passcode is `awadh-owner`. To choose another passcode, copy `.env.example` to `.env`, change its value, and restart the development server.

> Important: this built-in version is intended for local use and demonstration. Browser storage is tied to one browser/device, and a `VITE_` passcode is visible in the compiled frontend. Before a public launch, connect Owner Studio to a real authenticated backend such as Supabase or Firebase so changes sync securely across devices.
