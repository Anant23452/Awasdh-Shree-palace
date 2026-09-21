import {
  AirVent,
  Bath,
  BedDouble,
  CarFront,
  Coffee,
  ConciergeBell,
  Clock3,
  Droplets,
  Hotel,
  HeartHandshake,
  BroomSparkles,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  UtensilsCrossed,
  Wifi,
  Zap,
} from 'lucide-react'

export const rooms = [
  {
    name: 'Deluxe Room',
    image: '/assets/optimized/awadh-shree-palace-deluxe-room-1122.webp',
    srcSet: '/assets/optimized/awadh-shree-palace-deluxe-room-480.webp 480w, /assets/optimized/awadh-shree-palace-deluxe-room-800.webp 800w, /assets/optimized/awadh-shree-palace-deluxe-room-1122.webp 1122w',
    width: 1122,
    height: 1402,
    guests: '2 guests',
    bed: '1 king bed',
    price: '₹1,799',
    description: 'A quiet, thoughtfully prepared room for restful nights after exploring Ayodhya.',
    amenities: ['Air conditioning', 'Private bathroom', 'Free Wi-Fi'],
  },
  {
    name: 'Family Room',
    image: '/assets/optimized/awadh-shree-palace-family-room-1122.webp',
    srcSet: '/assets/optimized/awadh-shree-palace-family-room-480.webp 480w, /assets/optimized/awadh-shree-palace-family-room-800.webp 800w, /assets/optimized/awadh-shree-palace-family-room-1122.webp 1122w',
    width: 1122,
    height: 1402,
    guests: 'Up to 6 guests',
    bed: '2 queen beds',
    price: '₹2,499',
    description: 'Generous space and two comfortable beds, made for families travelling together.',
    amenities: ['Family friendly', 'Room service', 'Hot water'],
    featured: true,
  },
  {
    name: 'Premium Room',
    image: '/assets/optimized/awadh-shree-palace-premium-room-1200.webp',
    srcSet: '/assets/optimized/awadh-shree-palace-premium-room-480.webp 480w, /assets/optimized/awadh-shree-palace-premium-room-800.webp 800w, /assets/optimized/awadh-shree-palace-premium-room-1200.webp 1200w',
    width: 1200,
    height: 973,
    guests: 'Up to 4 guests',
    bed: '2 king beds',
    price: '₹2,999',
    description: 'Our most spacious room, with premium interiors and room for the family to unwind.',
    amenities: ['Modern interior', 'Air conditioning', 'Daily housekeeping'],
  },
]

export const facilities = [
  { icon: Wifi, title: 'Free Wi-Fi', copy: 'Stay connected throughout your visit.' },
  { icon: CarFront, title: 'Free parking', copy: 'Convenient parking for a simpler arrival.' },
  { icon: ConciergeBell, title: '24-hour assistance', copy: 'A helpful team whenever you need us.' },
  { icon: AirVent, title: 'Air-conditioned rooms', copy: 'Cool, comfortable rooms in every season.' },
  { icon: UtensilsCrossed, title: '24-hour food service', copy: 'Food and refreshments available around the clock.' },
  { icon: Droplets, title: 'Hot & cold water', copy: 'Hot and cold running water available 24 hours.' },
  { icon: BroomSparkles, title: 'Daily housekeeping', copy: 'Clean, cared-for spaces throughout your stay.' },
  { icon: Hotel, title: 'Lift access', copy: 'Comfortable access across the hotel.' },
  { icon: Zap, title: 'Power backup', copy: 'Backup support for a more comfortable, uninterrupted stay.' },
  { icon: Clock3, title: 'Anytime service', copy: 'Assistance, food and essential support day or night.' },
  { icon: ShieldCheck, title: 'Safe stay', copy: 'Attentive service and secure common areas.' },
]

export const gallery = [
  { src: '/assets/optimized/hotel-awadh-shree-palace-reception-1122.webp', srcSet: '/assets/optimized/hotel-awadh-shree-palace-reception-480.webp 480w, /assets/optimized/hotel-awadh-shree-palace-reception-800.webp 800w, /assets/optimized/hotel-awadh-shree-palace-reception-1122.webp 1122w', width: 1122, height: 1402, alt: 'Reception area at Hotel Awadh Shree Palace Ayodhya', label: 'Reception' },
  { src: '/assets/optimized/awadh-shree-palace-premium-room-1200.webp', srcSet: '/assets/optimized/awadh-shree-palace-premium-room-480.webp 480w, /assets/optimized/awadh-shree-palace-premium-room-800.webp 800w, /assets/optimized/awadh-shree-palace-premium-room-1200.webp 1200w', width: 1200, height: 973, alt: 'Premium family room at Hotel Awadh Shree Palace Ayodhya', label: 'Premium room' },
  { src: '/assets/optimized/awadh-shree-palace-king-room-1200.webp', srcSet: '/assets/optimized/awadh-shree-palace-king-room-480.webp 480w, /assets/optimized/awadh-shree-palace-king-room-800.webp 800w, /assets/optimized/awadh-shree-palace-king-room-1200.webp 1200w', width: 1200, height: 900, alt: 'King guest room at Hotel Awadh Shree Palace Ayodhya', label: 'King room' },
  { src: '/assets/optimized/hotel-awadh-shree-palace-interiors-1200.webp', srcSet: '/assets/optimized/hotel-awadh-shree-palace-interiors-480.webp 480w, /assets/optimized/hotel-awadh-shree-palace-interiors-800.webp 800w, /assets/optimized/hotel-awadh-shree-palace-interiors-1200.webp 1200w', width: 1200, height: 900, alt: 'Hotel corridors, lift and reception at Hotel Awadh Shree Palace', label: 'Hotel spaces' },
  { src: '/assets/optimized/awadh-shree-palace-family-room-1122.webp', srcSet: '/assets/optimized/awadh-shree-palace-family-room-480.webp 480w, /assets/optimized/awadh-shree-palace-family-room-800.webp 800w, /assets/optimized/awadh-shree-palace-family-room-1122.webp 1122w', width: 1122, height: 1402, alt: 'Family room with sitting area at Hotel Awadh Shree Palace', label: 'Family room' },
  { src: '/assets/optimized/awadh-shree-palace-deluxe-room-1122.webp', srcSet: '/assets/optimized/awadh-shree-palace-deluxe-room-480.webp 480w, /assets/optimized/awadh-shree-palace-deluxe-room-800.webp 800w, /assets/optimized/awadh-shree-palace-deluxe-room-1122.webp 1122w', width: 1122, height: 1402, alt: 'Deluxe guest room at Hotel Awadh Shree Palace Ayodhya', label: 'Deluxe room' },
]

export const trustItems = [
  { icon: Sparkles, value: 'Direct help', label: 'Call or WhatsApp the hotel' },
  { icon: MapPin, value: 'Ayodhya', label: 'Saketpuri, Deokali' },
  { icon: CarFront, value: 'Complimentary', label: 'On-site parking' },
  { icon: HeartHandshake, value: 'Family first', label: 'Comfortable group stays' },
]

export const roomIconMap = { guests: Users, bed: BedDouble, bath: Bath, coffee: Coffee }
